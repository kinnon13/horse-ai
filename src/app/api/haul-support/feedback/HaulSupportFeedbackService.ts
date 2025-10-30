import { supabaseAdmin } from '@/lib/supabase'
import { recordHaulSupportFeedback } from '@/lib/haulSupport'

export class HaulSupportFeedbackService {
  async submitFeedback(feedbackData: any, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const {
      point_id,
      safe_score,
      would_use_again,
      comments,
      amenities_rating,
      accessibility_rating,
      cleanliness_rating
    } = feedbackData

    if (!point_id || !safe_score || would_use_again === undefined) {
      throw new Error('Missing required fields: point_id, safe_score, would_use_again')
    }

    if (safe_score < 1 || safe_score > 5) {
      throw new Error('Safe score must be between 1 and 5')
    }

    const { data: feedback, error } = await supabaseAdmin
      .from('haul_support_feedback')
      .insert([{
        point_id,
        user_id: userId,
        safe_score,
        would_use_again,
        comments,
        amenities_rating,
        accessibility_rating,
        cleanliness_rating,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    await recordHaulSupportFeedback(point_id, {
      safe_score,
      would_use_again,
      amenities_rating,
      accessibility_rating,
      cleanliness_rating
    })

    return feedback
  }

  async getFeedback(filters: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    let query = supabaseAdmin
      .from('haul_support_feedback')
      .select('*')

    if (filters.point_id) query = query.eq('point_id', filters.point_id)
    if (filters.user_id) query = query.eq('user_id', filters.user_id)

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
      .from('haul_support_feedback')
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

  async deleteFeedback(feedbackId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { error } = await supabaseAdmin
      .from('haul_support_feedback')
      .delete()
      .eq('id', feedbackId)

    if (error) throw error
    return { success: true }
  }
}

