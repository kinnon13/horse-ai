import { ComposeData, OutreachTemplate } from './OutreachTypes'

export class OutreachConstants {
  static getInitialComposeData(): ComposeData {
    return {
      type: 'custom',
      target: '',
      template: '',
      subject: '',
      content: '',
      horse_name: '',
      event_name: ''
    }
  }

  static getTemplates(): OutreachTemplate[] {
    return [
      {
        id: 'horse_claim',
        name: 'Horse Claim Template',
        type: 'horse_claim',
        subject: 'Horse Claim Request - {{horse_name}}',
        content: 'Hi there! I noticed you have a horse named {{horse_name}} that might be competing at {{event_name}}. Would you like to claim this horse in our system?',
        variables: ['horse_name', 'event_name']
      },
      {
        id: 'event_claim',
        name: 'Event Claim Template',
        type: 'event_claim',
        subject: 'Event Claim Request - {{event_name}}',
        content: 'Hi there! I noticed you might be organizing {{event_name}}. Would you like to claim this event in our system?',
        variables: ['event_name']
      },
      {
        id: 'concierge_offer',
        name: 'Concierge Offer Template',
        type: 'concierge_offer',
        subject: 'HorseGPT Concierge Service',
        content: 'Hi there! I can help you with horse-related tasks like finding providers, booking services, and managing your horse business. Would you like to try our concierge service?',
        variables: []
      }
    ]
  }

  static getTemplate(templateId: string): OutreachTemplate | undefined {
    return this.getTemplates().find(t => t.id === templateId)
  }
}



