import { supabaseAdmin } from '@/lib/supabase'

export class AlertsService {
  async getUserAlerts(userId: string) {
    if (!supabaseAdmin) throw new Error('Database not available')
    const { data: alerts, error } = await supabaseAdmin.from('alerts').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) throw error
    return alerts || []
  }
  async createAlert(topic: string, description: string, userId: string) {
    if (!supabaseAdmin) throw new Error('Database not available')
    const { data: alert, error } = await supabaseAdmin.from('alerts').insert([{topic, description, user_id: userId, created_at: new Date().toISOString()}]).select().single()
    if (error) throw error
    return alert
  }
  async updateAlert(alertId: string, updates: any) {
    if (!supabaseAdmin) throw new Error('Database not available')
    const { data: alert, error } = await supabaseAdmin.from('alerts').update(updates).eq('id', alertId).select().single()
    if (error) throw error
    return alert
  }
  async deleteAlert(alertId: string) {
    if (!supabaseAdmin) throw new Error('Database not available')
    const { error } = await supabaseAdmin.from('alerts').delete().eq('id', alertId)
    if (error) throw error
    return { success: true }
  }
}
