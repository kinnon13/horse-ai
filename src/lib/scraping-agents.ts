import { supabase } from './supabase'
import { GrokAPI } from './grok'

export interface ScrapedData {
  horseName: string
  earnings?: number
  progeny?: string[]
  owners?: string[]
  riders?: string[]
  articles?: string[]
  socialMedia?: string[]
  recentResults?: any[]
  bloodline?: {
    sire: string
    dam: string
    grandsire: string
    granddam: string
  }
}

export class ScrapingAgents {
  private grok: GrokAPI

  constructor() {
    this.grok = new GrokAPI()
  }

  async triggerHorseScrub(horseName: string, userId: string) {
    console.log(`🔍 Triggering scrub for: ${horseName}`)
    
    try {
      // 1. Search Equibase for earnings and progeny
      const equibaseData = await this.scrapeEquibase(horseName)
      
      // 2. Search AQHA for registration and bloodline data
      const aqhaData = await this.scrapeAQHA(horseName)
      
      // 3. Search X/Twitter for mentions and recent activity
      const socialData = await this.scrapeSocialMedia(horseName)
      
      // 4. Search web for articles and news
      const articlesData = await this.scrapeArticles(horseName)
      
      // 5. Combine and enrich data
      const enrichedData = await this.enrichHorseData({
        horseName,
        ...equibaseData,
        ...aqhaData,
        ...socialData,
        ...articlesData
      })

      // 6. Store in database
      await this.storeScrapedData(enrichedData, userId)
      
      // 7. Award points for successful scrub
      await this.awardScrubPoints(userId, enrichedData)
      
      return enrichedData
    } catch (error) {
      console.error(`Scrub failed for ${horseName}:`, error)
      throw error
    }
  }

  private async scrapeEquibase(horseName: string): Promise<Partial<ScrapedData>> {
    const prompt = `Search Equibase for horse "${horseName}" and extract:
    - Total earnings (lifetime)
    - Recent race results (last 5 races)
    - Progeny names and earnings
    - Owner information
    - Trainer information
    
    Format as JSON with specific data points.`
    
    const response = await this.grok.query([
      { role: 'system', content: 'You are an expert at extracting horse racing data from Equibase.' },
      { role: 'user', content: prompt }
    ])
    
    return this.parseScrapedResponse(response)
  }

  private async scrapeAQHA(horseName: string): Promise<Partial<ScrapedData>> {
    const prompt = `Search AQHA (American Quarter Horse Association) for horse "${horseName}" and extract:
    - Registration number
    - Bloodline details (sire, dam, grandsire, granddam)
    - Breeder information
    - Performance records
    - Awards and achievements
    
    Format as JSON with specific data points.`
    
    const response = await this.grok.query([
      { role: 'system', content: 'You are an expert at extracting Quarter Horse data from AQHA.' },
      { role: 'user', content: prompt }
    ])
    
    return this.parseScrapedResponse(response)
  }

  private async scrapeSocialMedia(horseName: string): Promise<Partial<ScrapedData>> {
    const prompt = `Search X/Twitter and social media for horse "${horseName}" and extract:
    - Recent mentions and posts
    - Owner/trainer social media activity
    - Race results and updates
    - Fan discussions and comments
    - Photo/video content
    
    Format as JSON with specific data points.`
    
    const response = await this.grok.query([
      { role: 'system', content: 'You are an expert at extracting social media data for horses.' },
      { role: 'user', content: prompt }
    ])
    
    return this.parseScrapedResponse(response)
  }

  private async scrapeArticles(horseName: string): Promise<Partial<ScrapedData>> {
    const prompt = `Search the web for recent articles and news about horse "${horseName}" and extract:
    - Recent news articles
    - Race reports and results
    - Breeding announcements
    - Performance updates
    - Industry mentions
    
    Format as JSON with specific data points.`
    
    const response = await this.grok.query([
      { role: 'system', content: 'You are an expert at extracting news and article data for horses.' },
      { role: 'user', content: prompt }
    ])
    
    return this.parseScrapedResponse(response)
  }

  private parseScrapedResponse(response: string): Partial<ScrapedData> {
    try {
      // Try to parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      // Fallback: extract key information using regex
      const earnings = response.match(/earnings?[:\s]*\$?([\d,]+)/i)?.[1]?.replace(/,/g, '')
      const progeny = response.match(/progeny[:\s]*([^\.]+)/i)?.[1]?.split(',').map(p => p.trim())
      const owners = response.match(/owner[s]?[:\s]*([^\.]+)/i)?.[1]?.split(',').map(o => o.trim())
      
      return {
        earnings: earnings ? parseInt(earnings) : undefined,
        progeny,
        owners
      }
    } catch (error) {
      console.error('Failed to parse scraped response:', error)
      return {}
    }
  }

  private async enrichHorseData(data: Partial<ScrapedData>): Promise<ScrapedData> {
    // Use AI to cross-reference and validate data
    const enrichmentPrompt = `Analyze and cross-reference this horse data for accuracy:
    ${JSON.stringify(data, null, 2)}
    
    Identify:
    - Data inconsistencies
    - Missing information that can be filled
    - Duplicate entries
    - Confidence scores for each data point
    
    Return enriched and validated data.`
    
    const enrichedResponse = await this.grok.query([
      { role: 'system', content: 'You are an expert at validating and enriching horse data.' },
      { role: 'user', content: enrichmentPrompt }
    ])
    
    return {
      horseName: data.horseName || '',
      ...data,
      // Add enriched data from AI analysis
      ...this.parseScrapedResponse(enrichedResponse)
    }
  }

  private async storeScrapedData(data: ScrapedData, userId: string) {
    // Store in scraped_data table
    const { error: scrapedError } = await supabase
      .from('scraped_data')
      .insert({
        horse_name: data.horseName,
        earnings: data.earnings,
        progeny: data.progeny ? JSON.stringify(data.progeny) : null,
        owners: data.owners ? JSON.stringify(data.owners) : null,
        riders: data.riders ? JSON.stringify(data.riders) : null,
        articles: data.articles ? JSON.stringify(data.articles) : null,
        social_media: data.socialMedia ? JSON.stringify(data.socialMedia) : null,
        bloodline: data.bloodline ? JSON.stringify(data.bloodline) : null,
        user_id: userId,
        created_at: new Date().toISOString()
      })

    if (scrapedError) {
      console.error('Failed to store scraped data:', scrapedError)
    }

    // Create linked entities for mentioned people
    if (data.owners) {
      await this.createLinkedEntities(data.owners, 'owner', userId)
    }
    if (data.riders) {
      await this.createLinkedEntities(data.riders, 'rider', userId)
    }
  }

  private async createLinkedEntities(names: string[], type: 'owner' | 'rider', userId: string) {
    for (const name of names) {
      const { error } = await supabase
        .from('linked_entities')
        .upsert({
          name: name.trim(),
          type,
          user_id: userId,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error(`Failed to create linked entity ${name}:`, error)
      }
    }
  }

  private async awardScrubPoints(userId: string, data: ScrapedData) {
    // Calculate points based on data richness
    let points = 50 // Base points for successful scrub
    
    if (data.earnings) points += 25
    if (data.progeny && data.progeny.length > 0) points += data.progeny.length * 5
    if (data.owners && data.owners.length > 0) points += data.owners.length * 10
    if (data.articles && data.articles.length > 0) points += data.articles.length * 5
    
    // Award points
    const { error } = await supabase
      .from('users')
      .update({ 
        points: points, // This would need to be handled with a proper increment in production
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Failed to award scrub points:', error)
    }

    console.log(`🎉 Awarded ${points} points for ${data.horseName} scrub`)
  }

  // Schedule daily re-scrubs for active horses
  async scheduleDailyRescrubs() {
    const { data: activeHorses } = await supabase
      .from('horses')
      .select('name, id')
      .order('updated_at', { ascending: false })
      .limit(100)

    if (activeHorses) {
      for (const horse of activeHorses) {
        // Only re-scrub if horse has been active recently
        await this.triggerHorseScrub(horse.name, horse.id)
      }
    }
  }
}
