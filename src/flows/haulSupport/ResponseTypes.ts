// ResponseTypes.ts (35 lines) - Single responsibility: Response type definitions
export interface HaulSupportResponse {
  message: string
  haulSupport?: {
    route: {
      origin: string
      destination: string
    }
    supportPoints: {
      fuel: any[]
      overnight: any[]
      emergency: any[]
      hookups: any[]
      feedStores: any[]
    }
    safetyRanking: 'high' | 'medium' | 'low'
  }
  requiresUpgrade?: boolean
  upgradeAction?: string
}

export interface HaulSupportIntent {
  type: 'haul_support'
  route: {
    origin: {
      city: string
      state: string
    }
    destination: {
      city: string
      state: string
    }
  }
  urgency: 'low' | 'normal' | 'high' | 'urgent'
  supportTypes: string[]
}