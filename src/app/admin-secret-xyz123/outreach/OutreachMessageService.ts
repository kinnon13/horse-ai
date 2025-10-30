import { OutreachMessage } from './OutreachTypes'

export async function fetchOutreachMessages(): Promise<OutreachMessage[]> {
  // TODO: Replace with actual API call
  return [
    {
      id: '1',
      type: 'horse_claim',
      target: 'sarah@example.com',
      template: 'horse_claim',
      status: 'pending',
      created_at: new Date().toISOString(),
      horse_name: 'Lightning Bolt',
      event_name: 'Pink Buckle Classic'
    },
    {
      id: '2',
      type: 'event_claim',
      target: 'producer@example.com',
      template: 'event_claim',
      status: 'sent',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      horse_name: null,
      event_name: 'Diamond Classic'
    },
    {
      id: '3',
      type: 'concierge_offer',
      target: '+1234567890',
      template: 'concierge_offer',
      status: 'replied',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      horse_name: null,
      event_name: null
    }
  ]
}

export async function createOutreachMessage(messageData: Omit<OutreachMessage, 'id' | 'created_at'>): Promise<OutreachMessage> {
  // TODO: Replace with actual API call
  const newMessage: OutreachMessage = {
    ...messageData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  }
  return newMessage
}

