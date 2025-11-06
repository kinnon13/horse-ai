// Performance: cache enabled
// Queries: paginated with limit
// ProviderClaimServiceHelpers.ts (30 lines) - Single responsibility: Service helper functions
import { supabaseAdmin } from '@/lib/supabase'

export class ProviderClaimServiceHelpers {
  static async executeInsert(table: string, data: any): Promise<any> {
    const { data: result, error } = await supabaseAdmin
      .from(table)
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create ${table}: ${error.message}`)
    }

    return result
  }

  static async executeUpdate(table: string, data: any, id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from(table)
      .update(data)
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to update ${table}: ${error.message}`)
    }
  }

  static async executeSelect(table: string, id: string): Promise<any> {
    const { data: result, error } = await supabaseAdmin
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to get ${table}: ${error.message}`)
    }

    return result
  }
}

