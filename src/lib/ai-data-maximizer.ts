import { supabase } from './supabase'
import { GrokAPI } from './grok'

export interface HighValueScrubData {
  horseName: string
  earnings: number | null
  progeny: string[]
  owners: string[]
  riders: string[]
  breedingFees: number | null
  contactInfo: {
    phone?: string
    email?: string
    website?: string
  }
  performanceRecords: {
    race: string
    finish: number
    time: string
    earnings: number
    date: string
  }[]
  sourceAttribution: {
    equibase: boolean
    aqha: boolean
    bloodhorse: boolean
    official: boolean
  }
}

export class AIDataMaximizer {
  private grok: GrokAPI

  constructor() {
    this.grok = new GrokAPI()
  }

  async prioritizeHighValueScrubs(): Promise<void> {
    try {
      // Get horses with high earning potential for priority scrubbing
      const { data: priorityHorses } = await supabase
        .from('horses')
        .select('name, user_id, earnings, sire, dam')
        .or('earnings.gt.50000,sire.not.is.null,dam.not.is.null')
        .order('earnings', { ascending: false })
        .limit(20)

      if (!priorityHorses) return

      for (const horse of priorityHorses) {
        try {
          // Enhanced scrub focusing on verified sources
          const enhancedData = await this.scrubHighValueData(horse.name, horse.user_id)
          
          // Store enhanced data
          await this.storeHighValueData(enhancedData, horse.user_id)
          
          // Award bonus points for high-value scrubs
          await this.awardHighValuePoints(horse.user_id, enhancedData)
        } catch (error) {
          console.error(`High-value scrub failed for ${horse.name}:`, error)
        }
      }
    } catch (error) {
      console.error('High-value scrub trigger error:', error)
    }
  }

  private async scrubHighValueData(horseName: string, userId: string): Promise<HighValueScrubData> {
    const prompt = `HIGH-VALUE SCRUB for ${horseName}
    
    PRIORITY SOURCES (verified only):
    1. Equibase.com - Official racing records, earnings, progeny
    2. AQHA.com - Quarter Horse registry, breeding records  
    3. BloodHorse.com - Racing news, performance data
    4. Official track websites - Race results, earnings
    5. Stallion directories - Breeding fees, contact info
    
    AVOID unreliable sources:
    - AllBreedPedigree (unreliable)
    - Unverified social media
    - Hypothetical data
    
    Focus on HIGH-VALUE data:
    - Exact earnings from official sources
    - Progeny with registered names and earnings
    - Owner/rider contact information
    - Breeding fees and availability
    - Performance records with times/ratings
    
    Return structured JSON with source attribution for verification.`

    const response = await this.grok.query([
      { role: 'system', content: 'You are an expert equine data researcher specializing in high-value, verified information. Only return data from official, reliable sources with source attribution.' },
      { role: 'user', content: prompt }
    ])

    return this.parseHighValueResponse(response)
  }

  private parseHighValueResponse(response: string): HighValueScrubData {
    try {
      // Parse AI response and extract high-value data
      const data = JSON.parse(response)
      
      return {
        horseName: data.horseName || '',
        earnings: data.earnings || null,
        progeny: data.progeny || [],
        owners: data.owners || [],
        riders: data.riders || [],
        breedingFees: data.breedingFees || null,
        contactInfo: data.contactInfo || {},
        performanceRecords: data.performanceRecords || [],
        sourceAttribution: data.sourceAttribution || {
          equibase: false,
          aqha: false,
          bloodhorse: false,
          official: false
        }
      }
    } catch (error) {
      console.error('Failed to parse high-value response:', error)
      return {
        horseName: '',
        earnings: null,
        progeny: [],
        owners: [],
        riders: [],
        breedingFees: null,
        contactInfo: {},
        performanceRecords: [],
        sourceAttribution: {
          equibase: false,
          aqha: false,
          bloodhorse: false,
          official: false
        }
      }
    }
  }

  private async storeHighValueData(data: HighValueScrubData, userId: string): Promise<void> {
    try {
      await supabase
        .from('scraped_data')
        .insert({
          horse_name: data.horseName,
          earnings: data.earnings,
          progeny: JSON.stringify(data.progeny),
          owners: JSON.stringify(data.owners),
          riders: JSON.stringify(data.riders),
          breeding_fees: data.breedingFees,
          contact_info: JSON.stringify(data.contactInfo),
          performance_records: JSON.stringify(data.performanceRecords),
          source_attribution: JSON.stringify(data.sourceAttribution),
          user_id: userId,
          scrub_type: 'high_value',
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Failed to store high-value data:', error)
    }
  }

  private async awardHighValuePoints(userId: string, data: HighValueScrubData): Promise<void> {
    let points = 0
    
    // Base points for high-value scrub
    points += 100
    
    // Bonus points for specific high-value data
    if (data.earnings && data.earnings > 100000) points += 50
    if (data.progeny && data.progeny.length > 5) points += 25
    if (data.owners && data.owners.length > 0) points += 30
    if (data.breedingFees) points += 40
    if (data.contactInfo.phone || data.contactInfo.email) points += 20
    
    // Award points
    const { error } = await supabase
      .from('users')
      .update({ 
        points: points,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Failed to award high-value points:', error)
    }
  }

  // Focus on verified sources only
  async scrubVerifiedSourcesOnly(horseName: string): Promise<HighValueScrubData> {
    const verifiedSourcesPrompt = `SCRUB VERIFIED SOURCES ONLY for ${horseName}
    
    ONLY use these verified sources:
    1. Equibase.com - Official racing database
    2. AQHA.com - Quarter Horse registry
    3. BloodHorse.com - Racing news and data
    4. Official track websites
    5. Stallion directories (verified breeding fees)
    
    DO NOT use:
    - AllBreedPedigree (unreliable)
    - Social media
    - Unverified websites
    - Speculative data
    
    Return only verified, factual information with source attribution.`

    const response = await this.grok.query([
      { role: 'system', content: 'You are a verified equine data researcher. Only return data from official, reliable sources. Never use AllBreedPedigree or unverified sources.' },
      { role: 'user', content: verifiedSourcesPrompt }
    ])

    return this.parseHighValueResponse(response)
  }
}
