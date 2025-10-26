export interface ABTest {
  id: string
  name: string
  variants: {
    [key: string]: {
      weight: number
      config: any
    }
  }
  isActive: boolean
  startDate: string
  endDate?: string
}

export class ABTestingEngine {
  private tests: Map<string, ABTest> = new Map()

  constructor() {
    this.initializeTests()
  }

  private initializeTests() {
    // Pricing A/B Test
    this.tests.set('pricing_tiers', {
      id: 'pricing_tiers',
      name: 'Pricing Tier Display',
      variants: {
        'control': {
          weight: 50,
          config: {
            showIntroPrice: true,
            highlightPro: false,
            showComparison: true
          }
        },
        'variant_a': {
          weight: 50,
          config: {
            showIntroPrice: false,
            highlightPro: true,
            showComparison: false
          }
        }
      },
      isActive: true,
      startDate: new Date().toISOString()
    })

    // Dashboard Layout Test
    this.tests.set('dashboard_layout', {
      id: 'dashboard_layout',
      name: 'Dashboard Layout',
      variants: {
        'control': {
          weight: 50,
          config: {
            layout: 'grid',
            showAnalytics: true,
            compactMode: false
          }
        },
        'variant_a': {
          weight: 50,
          config: {
            layout: 'list',
            showAnalytics: false,
            compactMode: true
          }
        }
      },
      isActive: true,
      startDate: new Date().toISOString()
    })
  }

  getVariant(testId: string, userId: string): string {
    const test = this.tests.get(testId)
    if (!test || !test.isActive) {
      return 'control'
    }

    // Use user ID to ensure consistent assignment
    const hash = this.hashString(userId + testId)
    const bucket = hash % 100

    let cumulativeWeight = 0
    for (const [variant, config] of Object.entries(test.variants)) {
      cumulativeWeight += config.weight
      if (bucket < cumulativeWeight) {
        return variant
      }
    }

    return 'control'
  }

  getTestConfig(testId: string, userId: string): any {
    const variant = this.getVariant(testId, userId)
    const test = this.tests.get(testId)
    
    if (!test) return {}
    
    return test.variants[variant]?.config || {}
  }

  trackConversion(testId: string, userId: string, conversion: string): void {
    // Track conversion for analytics
    const variant = this.getVariant(testId, userId)
    
    // Store in analytics (would integrate with your analytics system)
    console.log(`AB Test Conversion: ${testId} - ${variant} - ${conversion}`)
    
    // In production, this would send to your analytics service
    this.sendToAnalytics({
      testId,
      variant,
      userId,
      conversion,
      timestamp: new Date().toISOString()
    })
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private sendToAnalytics(data: any): void {
    // In production, integrate with your analytics service
    // For now, just log
    console.log('Analytics Event:', data)
  }
}

export const abTesting = new ABTestingEngine()
