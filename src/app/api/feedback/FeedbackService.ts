import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database, supabaseAdmin } from '@/lib/supabase'

export class FeedbackService {
  private async getSupabaseClient() {
    const cookieStore = await cookies()
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    )
  }

  async submitFeedback(feedbackData: any, userId?: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: feedback, error } = await supabaseAdmin
      .from('user_feedback')
      .insert([{user_id: userId,
        feedback_type: feedbackData.feedbackType,
        rating: feedbackData.rating,
        message: feedbackData.message,
        feature: feedbackData.feature,
        urgency: feedbackData.urgency,
        contact_email: feedbackData.contactEmail,
        user_agent: feedbackData.userAgent,
        url: feedbackData.url,
        metadata: feedbackData.metadata,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return feedback
  }

  async getFeedback(filters: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    let query = supabaseAdmin
      .from('user_feedback')
      .select('*')

    if (filters.userId) query = query.eq('user_id', filters.userId)
    if (filters.feedbackType) query = query.eq('feedback_type', filters.feedbackType)
    if (filters.feature) query = query.eq('feature', filters.feature)

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
      .from('user_feedback')
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
      .from('user_feedback')
      .delete()
      .eq('id', feedbackId)

    if (error) throw error
    return { success: true }
  }
}

