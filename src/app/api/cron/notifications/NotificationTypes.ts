export interface NotificationRecord {
  id: string
  user_id: string
  channel: string
  message: string
  scheduled_for: string
  users: {
    id: string
    email: string
    phone: string
    full_name: string
  }
}




