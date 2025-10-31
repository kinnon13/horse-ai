import { supabase } from '@/lib/supabase'

export class LeadGenerationStorageService {
  async saveLeadGeneration(userId: string, leadData: any) {
    const { data: lead, error } = await supabase
      .from('lead_generations')
      .insert([{
        user_id: userId,
        ...leadData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return lead
  }
}




