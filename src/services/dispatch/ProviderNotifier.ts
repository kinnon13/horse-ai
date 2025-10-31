// ProviderNotifier.ts (30 lines) - Main notification service
import { Notification } from './ProviderNotifierTypes'

export class ProviderNotifier {
  async sendNotification(notification: Omit<Notification, 'id' | 'sentAt' | 'status'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      sentAt: new Date(),
      status: 'sent'
    }
    
    console.log('Notification sent:', newNotification)
    return newNotification
  }

  async sendBulkNotifications(notifications: Omit<Notification, 'id' | 'sentAt' | 'status'>[]): Promise<Notification[]> {
    return Promise.all(notifications.map(notification => this.sendNotification(notification)))
  }

  async getNotificationHistory(providerId: string): Promise<Notification[]> {
    return []
  }

  async updateNotificationStatus(notificationId: string, status: Notification['status']): Promise<void> {
    console.log(`Notification ${notificationId} status updated to ${status}`)
  }
}

export const providerNotifier = new ProviderNotifier()