import { supabaseAdmin } from '@/lib/supabase'

export class ConciergeRequestService {
  async saveConciergeRequest(userId: string, serviceType: string, location: string, urgency: string, amount: number, sessionId: string) {
    const { data: conciergeRequest, error } = await supabaseAdmin
      .from('concierge_requests')
      .insert([{
        user_id: userId,
        service_type: serviceType,
        location,
        urgency,
        amount,
        stripe_session_id: sessionId,
        status: 'pending_payment',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return conciergeRequest
  }

  async getConciergeRequests(userId: string) {
    if (!supabaseAdmin) throw new Error('Database not available')

    const { data: requests, error } = await supabaseAdmin
      .from('concierge_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return requests || []
  }

  async updateConciergeRequest(requestId: string, updates: any) {
    if (!supabaseAdmin) throw new Error('Database not available')

    const { data: request, error } = await supabaseAdmin
      .from('concierge_requests')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) throw error
    return request
  }
}

