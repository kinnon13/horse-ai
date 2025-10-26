export interface UpsellTrigger {
  userId: string
  currentTier: 'free' | 'verified' | 'pro'
  triggerType: 'gpt_limit' | 'buyer_interest' | 'data_verification'
  context: {
    horseName?: string
    buyerCount?: number
    earnings?: number
    bloodline?: string
  }
}

export interface UpsellMessage {
  title: string
  message: string
  cta: string
  valueProposition: string
  urgency: boolean
}

export class UpsellEngine {
  generateUpsellMessage(trigger: UpsellTrigger): UpsellMessage {
    switch (trigger.triggerType) {
      case 'gpt_limit':
        return this.generateGPTLimitUpsell(trigger)
      case 'buyer_interest':
        return this.generateBuyerInterestUpsell(trigger)
      case 'data_verification':
        return this.generateDataVerificationUpsell(trigger)
      default:
        return this.generateDefaultUpsell(trigger)
    }
  }

  private generateGPTLimitUpsell(trigger: UpsellTrigger): UpsellMessage {
    const { context } = trigger
    
    return {
      title: "Unlock Unlimited HorseGPT",
      message: `You're answering buyer questions about ${context.bloodline || 'this bloodline'} and ${context.earnings ? `$${context.earnings.toLocaleString()}` : 'high-value'} horses. Upgrade to Pro ($19.99/mo) to unlock unlimited answers and be shown first to buyers asking for this bloodline.`,
      cta: "Upgrade to Pro - $19.99/mo",
      valueProposition: "Be first in line to get paid for your bloodline",
      urgency: true
    }
  }

  private generateBuyerInterestUpsell(trigger: UpsellTrigger): UpsellMessage {
    const { context } = trigger
    
    return {
      title: "Hot Buyers Waiting",
      message: `You have ${context.buyerCount || 3} buyers asking about ${context.horseName || 'your horses'} right now. Upgrade to Pro ($19.99/mo) to respond first and lock these deals.`,
      cta: "Respond to Buyers Now",
      valueProposition: "Turn inquiries into sales",
      urgency: true
    }
  }

  private generateDataVerificationUpsell(trigger: UpsellTrigger): UpsellMessage {
    const { context } = trigger
    
    return {
      title: "Claim Your Horse",
      message: `We're tracking ${context.horseName || 'your horse'} with verified earnings. Claim it now ($4.99/mo) so nobody else defines your record and you get alerts when it wins.`,
      cta: "Claim & Get Verified Badge",
      valueProposition: "Control your horse's public record",
      urgency: false
    }
  }

  private generateDefaultUpsell(trigger: UpsellTrigger): UpsellMessage {
    return {
      title: "Unlock More Features",
      message: "Upgrade to get unlimited access and priority placement.",
      cta: "Upgrade Now",
      valueProposition: "Get more visibility and features",
      urgency: false
    }
  }

  // One-tap upgrade without signup flow
  async processOneTapUpgrade(userId: string, fromTier: string, toTier: string): Promise<boolean> {
    try {
      // Update user tier immediately
      await this.updateUserTier(userId, toTier)
      
      // Log the upgrade
      await this.logUpgrade(userId, fromTier, toTier)
      
      // Send confirmation
      await this.sendUpgradeConfirmation(userId, toTier)
      
      return true
    } catch (error) {
      console.error('One-tap upgrade failed:', error)
      return false
    }
  }

  private async updateUserTier(userId: string, tier: string): Promise<void> {
    // Implementation would update user subscription in Stripe and database
    console.log(`Upgrading user ${userId} to ${tier}`)
  }

  private async logUpgrade(userId: string, fromTier: string, toTier: string): Promise<void> {
    // Log for analytics
    console.log(`Upgrade logged: ${userId} from ${fromTier} to ${toTier}`)
  }

  private async sendUpgradeConfirmation(userId: string, tier: string): Promise<void> {
    // Send confirmation message
    console.log(`Confirmation sent to ${userId} for ${tier}`)
  }
}
