import { supabaseAdmin } from '@/lib/supabase'

export class ClaimService {
  async getClaims(filters: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    let query = supabaseAdmin
      .from('horse_claims')
      .select(`
        *,
        horses:horse_id (
          id,
          name,
          breed,
          reg_number,
          sire,
          dam
        ),
        users:user_id (
          id,
          email,
          first_name,
          last_name
        )
      `)

    if (filters.userId) query = query.eq('user_id', filters.userId)
    if (filters.horseId) query = query.eq('horse_id', filters.horseId)
    if (filters.status) query = query.eq('status', filters.status)

    query = query.order('created_at', { ascending: false })
    query = query.limit(filters.limit || 50)

    const { data: claims, error } = await query

    if (error) throw error
    return claims || []
  }

  async createClaim(claimData: any) {
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

  async updateClaim(claimId: string, updates: any) {
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

  async deleteClaim(claimId: string) {
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

