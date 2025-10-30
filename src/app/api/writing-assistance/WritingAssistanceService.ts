import { supabase } from '@/lib/supabase'

export class WritingAssistanceService {
  async checkUserSubscription(userId: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (error || !user) {
      throw new Error('User not found')
    }

    if (user.subscription_tier !== 'plus') {
      throw new Error('Writing assistance is only available for Plus tier subscribers')
    }

    return user
  }

  async generateContent(type: string, context: string, prompt: string) {
    // This would integrate with AI service
    const content = await this.callAIWritingService(type, context, prompt)
    return content
  }

  async callAIWritingService(type: string, context: string, prompt: string) {
    // Mock AI service call - replace with actual AI integration
    const templates = {email: `Subject: ${prompt}\n\nDear [Name],\n\nI hope this email finds you well. ${context}\n\nBest regards,\n[Your Name]`,
      contract: `CONTRACT AGREEMENT\n\nThis agreement is between [Party 1] and [Party 2] regarding ${prompt}.\n\nTerms:\n${context}\n\nSigned: [Date]`,
      proposal: `PROPOSAL: ${prompt}\n\nExecutive Summary:\n${context}\n\nRecommendations:\n1. [Recommendation 1]\n2. [Recommendation 2]\n3. [Recommendation 3]`
    }

    return templates[type as keyof typeof templates] || `Generated content for ${type}: ${prompt}\n\nContext: ${context}`
  }

  async saveWritingSession(userId: string, sessionData: any) {
    const { data: session, error } = await supabase
      .from('writing_sessions')
      .insert([{user_id: userId,
        ...sessionData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return session
  }

  async getWritingSessions(userId: string) {
    const { data: sessions, error } = await supabase
      .from('writing_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return sessions || []
  }

  async updateWritingSession(sessionId: string, updates: any) {
    const { data: session, error } = await supabase
      .from('writing_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return session
  }

  async deleteWritingSession(sessionId: string) {
    const { error } = await supabase
      .from('writing_sessions')
      .delete()
      .eq('id', sessionId)

    if (error) throw error
    return { success: true }
  }
}

