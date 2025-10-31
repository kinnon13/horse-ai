// UserHorsesOperations.repo.ts (35 lines) - Single responsibility: Main operations functions
import { supabase } from '@/lib/supabase'
import { UserHorsesOperationsHelpers } from './UserHorsesOperationsHelpers'

export interface UserHorse {
  id: string
  user_id: string
  horse_name: string
  horse_type: string
  breed: string
  value?: number
  created_at: string
  updated_at: string
}

export async function getUserHorses(userId: string): Promise<UserHorse[]> {
  const query = UserHorsesOperationsHelpers.buildSelectQuery(userId)
  return UserHorsesOperationsHelpers.executeQuery(query)
}

export async function createUserHorse(horseData: Omit<UserHorse, 'id' | 'created_at' | 'updated_at'>): Promise<UserHorse> {
  const query = UserHorsesOperationsHelpers.buildInsertQuery(horseData)
  return UserHorsesOperationsHelpers.executeSingleQuery(query)
}

export async function updateUserHorse(horseId: string, updateData: Partial<UserHorse>): Promise<UserHorse> {
  const query = supabase
    .from('user_horses')
    .update(updateData)
    .eq('id', horseId)
    .select()
  return UserHorsesOperationsHelpers.executeSingleQuery(query)
}

export async function deleteUserHorse(horseId: string): Promise<void> {
  const query = supabase
    .from('user_horses')
    .delete()
    .eq('id', horseId)
  return UserHorsesOperationsHelpers.executeDelete(query)
}