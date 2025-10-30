import { supabaseAdmin } from '@/lib/supabase'
import { recordProviderFeedbackAndUpdateScores } from '@/lib/feedback'
import { markAftercarePingAnswered } from '@/lib/aftercare'

export class AftercareFeedbackService {
  async submitFeedback(feedbackData: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const {
      ping_id,
      safe_score,
      care_score,
      would_use_again,
      comments,
      provider_id,
      user_id
    } = feedbackData

    if (!ping_id || !provider_id || !user_id) {
      throw new Error('Missing required fields: ping_id, provider_id, user_id')
    }

    if (safe_score < 1 || safe_score > 5 || care_score < 1 || care_score > 5) {
      throw new Error('Scores must be between 1 and 5')
    }

    const { data: feedback, error } = await supabaseAdmin
      .from('provider_feedback')
      .insert([{
        ping_id,
        provider_id,
        user_id,
        safe_score,
        care_score,
        would_use_again,
        comments,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    await recordProviderFeedbackAndUpdateScores(provider_id, {
      safe_score,
      care_score,
      would_use_again
    })

    await markAftercarePingAnswered(ping_id)

    return feedback
  }

  async getFeedback(filters: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    let query = supabaseAdmin
      .from('provider_feedback')
      .select('*')

    if (filters.provider_id) query = query.eq('provider_id', filters.provider_id)
    if (filters.user_id) query = query.eq('user_id', filters.user_id)
    if (filters.ping_id) query = query.eq('ping_id', filters.ping_id)

    query = query.order('created_at', { ascending: false })
    query = query.limit(filters.limit || 50)

    const { data: feedback, error } = await query

    if (error) throw error
    return feedback || []
  }

  async updateFeedback(feedbackId: string, updates: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: feedback, error } = await supabaseAdmin
      .from('provider_feedback')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', feedbackId)
      .select()
      .single()

    if (error) throw error
    return feedback
  }
}

