export interface LeadScore {
  contactId: string
  score: number
  factors: {
    hasMoneyRelevantAnimals: boolean
    recentlyClocked: boolean
    hasPayouts: boolean
    isCurrentlyBreeding: boolean
    hasInquiries: boolean
    isActiveSeller: boolean
  }
  priority: 'high' | 'medium' | 'low'
  lastActivity: Date
}

export interface ContactProfile {
  id: string
  name: string
  isMinor: boolean
  hasStallion: boolean
  hasBroodmare: boolean
  hasColtProspect: boolean
  recentEarnings: number
  lastRaceDate: Date
  breedingStatus: 'active' | 'inactive' | 'unknown'
  inquiryCount: number
  responseRate: number
}

export class LeadScoringEngine {
  async calculateLeadScore(contactId: string): Promise<LeadScore> {
    try {
      // Get contact profile
      const profile = await this.getContactProfile(contactId)
      
      // Calculate score factors
      const factors = {
        hasMoneyRelevantAnimals: profile.hasStallion || profile.hasBroodmare || profile.hasColtProspect,
        recentlyClocked: this.isRecentlyActive(profile.lastRaceDate),
        hasPayouts: profile.recentEarnings > 0,
        isCurrentlyBreeding: profile.breedingStatus === 'active',
        hasInquiries: profile.inquiryCount > 0,
        isActiveSeller: profile.responseRate > 0.5
      }

      // Calculate score (0-100)
      let score = 0
      if (factors.hasMoneyRelevantAnimals) score += 25
      if (factors.recentlyClocked) score += 20
      if (factors.hasPayouts) score += 15
      if (factors.isCurrentlyBreeding) score += 15
      if (factors.hasInquiries) score += 15
      if (factors.isActiveSeller) score += 10

      // Determine priority
      let priority: 'high' | 'medium' | 'low'
      if (score >= 80) priority = 'high'
      else if (score >= 50) priority = 'medium'
      else priority = 'low'

      return {
        contactId,
        score,
        factors,
        priority,
        lastActivity: profile.lastRaceDate
      }
    } catch (error) {
      console.error('Lead scoring error:', error)
      return {
        contactId,
        score: 0,
        factors: {
          hasMoneyRelevantAnimals: false,
          recentlyClocked: false,
          hasPayouts: false,
          isCurrentlyBreeding: false,
          hasInquiries: false,
          isActiveSeller: false
        },
        priority: 'low',
        lastActivity: new Date()
      }
    }
  }

  async getTopPriorityContacts(limit: number = 50): Promise<LeadScore[]> {
    try {
      // Get all contacts and score them
      const contacts = await this.getAllContacts()
      const scores = await Promise.all(
        contacts.map(contact => this.calculateLeadScore(contact.id))
      )

      // Sort by score and return top contacts
      return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .filter(score => score.priority === 'high')
    } catch (error) {
      console.error('Top priority contacts error:', error)
      return []
    }
  }

  private async getContactProfile(contactId: string): Promise<ContactProfile> {
    // Implementation would fetch from database
    return {
      id: contactId,
      name: 'Sample Contact',
      isMinor: false,
      hasStallion: true,
      hasBroodmare: true,
      hasColtProspect: false,
      recentEarnings: 15000,
      lastRaceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      breedingStatus: 'active',
      inquiryCount: 3,
      responseRate: 0.8
    }
  }

  private async getAllContacts(): Promise<{ id: string }[]> {
    // Implementation would fetch from database
    return [
      { id: 'contact1' },
      { id: 'contact2' },
      { id: 'contact3' }
    ]
  }

  private isRecentlyActive(lastActivity: Date): boolean {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return lastActivity > thirtyDaysAgo
  }

  // AI should prioritize top 5% hardest
  async getTop5PercentContacts(): Promise<LeadScore[]> {
    const allContacts = await this.getAllContacts()
    const top5PercentCount = Math.max(1, Math.floor(allContacts.length * 0.05))
    
    return this.getTopPriorityContacts(top5PercentCount)
  }
}
