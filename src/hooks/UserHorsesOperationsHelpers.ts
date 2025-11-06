// Queries: paginated with limit
// UserHorsesOperationsHelpers.ts (30 lines) - Single responsibility: Operations helper functions
import { supabase } from '@/lib/supabase'
import { UserHorse } from './UserHorsesOperations.repo'

export class UserHorsesOperationsHelpers {
  static async executeQuery(query: any): Promise<UserHorse[]> {
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async executeSingleQuery(query: any): Promise<UserHorse> {
    const { data, error } = await query.single()
    if (error) throw error
    return data
  }

  static async executeDelete(query: any): Promise<void> {
    const { error } = await query
    if (error) throw error
  }

  static buildSelectQuery(userId: string) {
    return supabase
      .from('user_horses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  }

  static buildInsertQuery(horseData: Omit<UserHorse, 'id' | 'created_at' | 'updated_at'>) {
    return supabase
      .from('user_horses')
      .insert(horseData)
      .select()
  }
}

