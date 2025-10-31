// ProviderNotifierTypes.ts (20 lines) - Notification types
export interface Notification {
  id: string
  providerId: string
  type: 'service_request' | 'reminder' | 'update' | 'cancellation'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  sentAt?: Date
  status: 'pending' | 'sent' | 'delivered' | 'failed'
}

export interface NotificationChannel {
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
}

