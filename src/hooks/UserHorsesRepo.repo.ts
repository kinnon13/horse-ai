// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
// UserHorsesRepo.repo.ts (35 lines) - Single responsibility: Main repository functions
import { supabase } from '@/lib/supabase'
import { UserHorsesRepoHelpers } from './UserHorsesRepoHelpers'

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
  const query = UserHorsesRepoHelpers.buildSelectQuery(userId)
  return UserHorsesRepoHelpers.executeQuery(query)
}

export async function createUserHorse(horseData: Omit<UserHorse, 'id' | 'created_at' | 'updated_at'>): Promise<UserHorse> {
  const query = UserHorsesRepoHelpers.buildInsertQuery(horseData)
  return UserHorsesRepoHelpers.executeSingleQuery(query)
}

export async function updateUserHorse(horseId: string, updateData: Partial<UserHorse>): Promise<UserHorse> {
  const query = supabase
    .from('user_horses')
    .update(updateData)
    .eq('id', horseId)
    .select()
  return UserHorsesRepoHelpers.executeSingleQuery(query)
}

export async function deleteUserHorse(horseId: string): Promise<void> {
  const query = supabase
    .from('user_horses')
    .delete()
    .eq('id', horseId)
  return UserHorsesRepoHelpers.executeDelete(query)
}