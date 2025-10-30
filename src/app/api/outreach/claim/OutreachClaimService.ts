import { supabaseAdmin } from '@/lib/supabase'

export class OutreachClaimService {
  async previewHorseClaim(horseName?: string, riderName?: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    if (!horseName && !riderName) {
      throw new Error('Horse name or rider name required')
    }

    let query = supabaseAdmin.from('horses_master').select('*')
    
    if (horseName) {
      query = query.ilike('reg_name', `%${horseName}%`)
    }
    
    const { data: horses, error: horseError } = await query.limit(5)
    
    if (horseError) throw horseError

    let riders = []
    if (riderName) {
      const { data: riderData, error: riderError } = await supabaseAdmin
        .from('riders_master')
        .select('*')
        .ilike('rider_name', `%${riderName}%`)
        .limit(5)
      
      if (riderError) throw riderError
      riders = riderData || []
    }

    return {horses: horses || [],
      riders,
      total_horses: horses?.length || 0,
      total_riders: riders.length
    }
  }

  async createHorseClaim(claimData: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: claim, error } = await supabaseAdmin
      .from('horse_claims')
      .insert([{
        ...claimData,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return claim
  }

  async getHorseClaims(filters: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    let query = supabaseAdmin
      .from('horse_claims')
      .select('*')

    if (filters.user_id) query = query.eq('user_id', filters.user_id)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.horse_id) query = query.eq('horse_id', filters.horse_id)

    query = query.order('created_at', { ascending: false })
    query = query.limit(filters.limit || 50)

    const { data: claims, error } = await query

    if (error) throw error
    return claims || []
  }

  async updateHorseClaim(claimId: string, updates: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: claim, error } = await supabaseAdmin
      .from('horse_claims')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', claimId)
      .select()
      .single()

    if (error) throw error
    return claim
  }

  async deleteHorseClaim(claimId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { error } = await supabaseAdmin
      .from('horse_claims')
      .delete()
      .eq('id', claimId)

    if (error) throw error
    return { success: true }
  }
}

