export interface OutreachLog {
  id: string
  contactId: string
  method: 'sms' | 'email'
  purpose: 'data_verification' | 'profile_accuracy' | 'lead_routing' | 'opt_out'
  message: string
  consentStatus: 'granted' | 'denied' | 'pending'
  timestamp: Date
  response?: string
  doNotContact: boolean
}

export interface ComplianceRules {
  sms: {
    includeStop: boolean
    identifyPurpose: boolean
    respectStop: boolean
  }
  email: {
    includeUnsubscribe: boolean
    respectUnsubscribe: boolean
    transactionalOnly: boolean
  }
  minors: {
    noDirectContact: boolean
    parentGateRequired: boolean
    leadRoutingOnly: boolean
  }
}

export class ComplianceEngine {
  private rules: ComplianceRules = {
    sms: {
      includeStop: true,
      identifyPurpose: true,
      respectStop: true
    },
    email: {
      includeUnsubscribe: true,
      respectUnsubscribe: true,
      transactionalOnly: true
    },
    minors: {
      noDirectContact: true,
      parentGateRequired: true,
      leadRoutingOnly: true
    }
  }

  async sendSMS(contactId: string, message: string, purpose: string): Promise<boolean> {
    try {
      // Check if contact has opted out
      const hasOptedOut = await this.checkOptOutStatus(contactId, 'sms')
      if (hasOptedOut) {
        console.log(`SMS blocked for ${contactId} - opted out`)
        return false
      }

      // Format SMS with compliance requirements
      const compliantMessage = this.formatSMSMessage(message, purpose)
      
      // Log the outreach
      await this.logOutreach({
        id: this.generateId(),
        contactId,
        method: 'sms',
        purpose: purpose as any,
        message: compliantMessage,
        consentStatus: 'pending',
        timestamp: new Date(),
        doNotContact: false
      })

      // Send SMS (implementation would use SMS service)
      console.log(`SMS sent to ${contactId}: ${compliantMessage}`)
      return true
    } catch (error) {
      console.error('SMS compliance error:', error)
      return false
    }
  }

  async sendEmail(contactId: string, subject: string, message: string, purpose: string): Promise<boolean> {
    try {
      // Check if contact has opted out
      const hasOptedOut = await this.checkOptOutStatus(contactId, 'email')
      if (hasOptedOut) {
        console.log(`Email blocked for ${contactId} - opted out`)
        return false
      }

      // Format email with compliance requirements
      const compliantEmail = this.formatEmailMessage(subject, message, purpose)
      
      // Log the outreach
      await this.logOutreach({
        id: this.generateId(),
        contactId,
        method: 'email',
        purpose: purpose as any,
        message: compliantEmail.content,
        consentStatus: 'pending',
        timestamp: new Date(),
        doNotContact: false
      })

      // Send email (implementation would use email service)
      console.log(`Email sent to ${contactId}: ${compliantEmail.subject}`)
      return true
    } catch (error) {
      console.error('Email compliance error:', error)
      return false
    }
  }

  private formatSMSMessage(message: string, purpose: string): string {
    let compliantMessage = message
    
    // Add purpose identification
    if (this.rules.sms.identifyPurpose) {
      compliantMessage = `[Horse.AI - ${purpose}] ${message}`
    }
    
    // Add STOP instruction
    if (this.rules.sms.includeStop) {
      compliantMessage += '\n\nReply STOP to opt out.'
    }
    
    return compliantMessage
  }

  private formatEmailMessage(subject: string, message: string, purpose: string): { subject: string; content: string } {
    let compliantSubject = subject
    let compliantContent = message
    
    // Add purpose identification to subject
    if (this.rules.email.transactionalOnly) {
      compliantSubject = `[Horse.AI - Data Verification] ${subject}`
    }
    
    // Add unsubscribe footer
    if (this.rules.email.includeUnsubscribe) {
      compliantContent += '\n\n---\nUnsubscribe: [LINK]'
    }
    
    return {
      subject: compliantSubject,
      content: compliantContent
    }
  }

  async handleStopRequest(contactId: string, method: 'sms' | 'email'): Promise<void> {
    // Immediately respect STOP
    await this.setOptOutStatus(contactId, method, true)
    
    // Log the opt-out
    await this.logOutreach({
      id: this.generateId(),
      contactId,
      method,
      purpose: 'opt_out',
      message: 'STOP request received',
      consentStatus: 'denied',
      timestamp: new Date(),
      doNotContact: true
    })
  }

  async handleUnsubscribeRequest(contactId: string): Promise<void> {
    // Immediately respect unsubscribe
    await this.setOptOutStatus(contactId, 'email', true)
    
    // Log the opt-out
    await this.logOutreach({
      id: this.generateId(),
      contactId,
      method: 'email',
      purpose: 'opt_out',
      message: 'Unsubscribe request received',
      consentStatus: 'denied',
      timestamp: new Date(),
      doNotContact: true
    })
  }

  // Minors protection
  async handleMinorContact(contactId: string, action: 'lead_request' | 'direct_contact'): Promise<boolean> {
    const isMinor = await this.checkIfMinor(contactId)
    
    if (isMinor && action === 'direct_contact') {
      console.log(`Direct contact blocked for minor ${contactId}`)
      return false
    }
    
    if (isMinor && action === 'lead_request') {
      // Route to parent instead
      const parentContactId = await this.getParentContact(contactId)
      if (parentContactId) {
        await this.sendEmail(parentContactId, 'Lead Request for Your Child', 
          'Someone is interested in your child\'s horse. Please respond through your parent account.', 
          'lead_routing')
        return true
      }
    }
    
    return true
  }

  private async checkOptOutStatus(contactId: string, method: string): Promise<boolean> {
    // Implementation would check database
    return false
  }

  private async setOptOutStatus(contactId: string, method: string, optedOut: boolean): Promise<void> {
    // Implementation would update database
    console.log(`Opt-out status set for ${contactId}: ${method} = ${optedOut}`)
  }

  private async checkIfMinor(contactId: string): Promise<boolean> {
    // Implementation would check database
    return false
  }

  private async getParentContact(contactId: string): Promise<string | null> {
    // Implementation would fetch parent contact
    return null
  }

  private async logOutreach(outreach: OutreachLog): Promise<void> {
    // Implementation would store in database
    console.log('Outreach logged:', outreach)
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}
