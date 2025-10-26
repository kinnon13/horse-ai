import { supabase } from './supabase'

export interface ConsentPreferences {
  dataSharing: boolean
  marketing: boolean
  analytics: boolean
  crossPromo: boolean
}

export interface AnonymousSession {
  sessionId: string
  preferences: ConsentPreferences
  createdAt: Date
  lastActivity: Date
}

export class AnonymousModeManager {
  private static readonly SESSION_KEY = 'horse_ai_anonymous_session'
  private static readonly CONSENT_KEY = 'horse_ai_consent_preferences'

  static createAnonymousSession(): AnonymousSession {
    const sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session: AnonymousSession = {
      sessionId,
      preferences: {
        dataSharing: false,
        marketing: false,
        analytics: true, // Allow analytics by default for anonymous users
        crossPromo: false
      },
      createdAt: new Date(),
      lastActivity: new Date()
    }

    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
    }

    return session
  }

  static getAnonymousSession(): AnonymousSession | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(this.SESSION_KEY)
      if (stored) {
        const session = JSON.parse(stored)
        // Update last activity
        session.lastActivity = new Date()
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
        return session
      }
    } catch (error) {
      console.error('Failed to get anonymous session:', error)
    }

    return null
  }

  static updateConsentPreferences(preferences: Partial<ConsentPreferences>): void {
    if (typeof window === 'undefined') return

    try {
      const session = this.getAnonymousSession()
      if (session) {
        session.preferences = { ...session.preferences, ...preferences }
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
      }

      // Also store consent separately for easy access
      localStorage.setItem(this.CONSENT_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.error('Failed to update consent preferences:', error)
    }
  }

  static getConsentPreferences(): ConsentPreferences | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(this.CONSENT_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to get consent preferences:', error)
    }

    return null
  }

  static async saveConsentToDatabase(userId: string, preferences: ConsentPreferences): Promise<void> {
    try {
      // Save consent records to database
      const consentRecords = Object.entries(preferences).map(([type, granted]) => ({
        user_id: userId,
        consent_type: type,
        granted,
        granted_at: new Date().toISOString()
      }))

      await supabase
        .from('consent_records')
        .insert(consentRecords)
    } catch (error) {
      console.error('Failed to save consent to database:', error)
    }
  }

  static async migrateAnonymousDataToUser(anonymousSession: AnonymousSession, userId: string): Promise<void> {
    try {
      // Save anonymous session data to user account
      await supabase
        .from('users')
        .update({
          anonymous_session_id: anonymousSession.sessionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      // Save consent preferences
      await this.saveConsentToDatabase(userId, anonymousSession.preferences)

      // Clear anonymous session
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.SESSION_KEY)
        localStorage.removeItem(this.CONSENT_KEY)
      }
    } catch (error) {
      console.error('Failed to migrate anonymous data:', error)
    }
  }

  static canUseFeature(feature: keyof ConsentPreferences): boolean {
    const session = this.getAnonymousSession()
    if (!session) return false

    return session.preferences[feature] === true
  }

  static shouldShowConsentBanner(): boolean {
    const session = this.getAnonymousSession()
    if (!session) return true

    // Show banner if any consent is false
    return Object.values(session.preferences).some(consent => consent === false)
  }

  static getConsentBannerMessage(): string {
    const session = this.getAnonymousSession()
    if (!session) return 'We use cookies and analytics to improve your experience.'

    const missingConsents = Object.entries(session.preferences)
      .filter(([_, granted]) => !granted)
      .map(([type, _]) => type)

    if (missingConsents.length === 0) return ''

    return `Please review your privacy preferences for: ${missingConsents.join(', ')}`
  }
}

export class CrossPromoManager {
  static async getPromoOpportunities(userId?: string): Promise<any[]> {
    try {
      // Get user's niche and interests
      const { data: searchAnalytics } = await supabase
        .from('search_analytics')
        .select('niche, search_query')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!searchAnalytics) return []

      // Analyze niches and suggest relevant promos
      const niches = Array.from(new Set(searchAnalytics.map(s => s.niche)))
      const queries = searchAnalytics.map(s => s.search_query)

      const opportunities = []

      // Breeding equipment promos for breeding-focused users
      if (queries.some(q => q.toLowerCase().includes('breeding'))) {
        opportunities.push({
          type: 'equipment',
          title: 'Breeding Equipment Specialists',
          description: 'Get 10% off premium breeding supplies',
          partner: 'EquineBreedingPro',
          discount: '10%',
          category: 'breeding'
        })
      }

      // Training equipment for performance-focused users
      if (queries.some(q => q.toLowerCase().includes('training') || q.toLowerCase().includes('performance'))) {
        opportunities.push({
          type: 'equipment',
          title: 'Performance Training Gear',
          description: 'Professional training equipment for serious competitors',
          partner: 'PerformanceEquine',
          discount: '15%',
          category: 'training'
        })
      }

      // Veterinary services for health-focused users
      if (queries.some(q => q.toLowerCase().includes('health') || q.toLowerCase().includes('veterinary'))) {
        opportunities.push({
          type: 'services',
          title: 'Equine Health Services',
          description: 'Connect with certified equine veterinarians',
          partner: 'EquineHealthNetwork',
          discount: 'Free consultation',
          category: 'health'
        })
      }

      return opportunities
    } catch (error) {
      console.error('Failed to get promo opportunities:', error)
      return []
    }
  }

  static async trackPromoClick(promoId: string, userId?: string): Promise<void> {
    try {
      await supabase
        .from('promo_tracking')
        .insert({
          user_id: userId,
          promo_id: promoId,
          clicked_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Failed to track promo click:', error)
    }
  }
}
