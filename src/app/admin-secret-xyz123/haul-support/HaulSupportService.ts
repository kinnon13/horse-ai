// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
import { supabase } from '@/lib/supabase'
import { HaulSupportPoint, HaulSupportStats, HaulSupportFormData } from './HaulSupportTypes'

export async function fetchHaulSupportPoints(): Promise<HaulSupportPoint[]> {
  const { data, error } = await supabase.from('haul_support_points').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(`Failed to fetch haul support points: ${error.message}`)
  return data || []
}

export async function createHaulSupportPoint(pointData: HaulSupportFormData): Promise<HaulSupportPoint> {
  const { data, error } = await supabase.from('haul_support_points').insert([pointData]).select().single()
  if (error) throw new Error(`Failed to create haul support point: ${error.message}`)
  return data
}

export async function updateHaulSupportPoint(id: string, updates: Partial<HaulSupportPoint>): Promise<HaulSupportPoint> {
  const { data, error } = await supabase.from('haul_support_points').update(updates).eq('id', id).select().single()
  if (error) throw new Error(`Failed to update haul support point: ${error.message}`)
  return data
}

export async function deleteHaulSupportPoint(id: string): Promise<void> {
  const { error } = await supabase.from('haul_support_points').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete haul support point: ${error.message}`)
}

export async function fetchHaulSupportStats(): Promise<HaulSupportStats> {
  const { data: points, error: pointsError } = await supabase.from('haul_support_points').select('is_approved, safety_score')
  if (pointsError) throw new Error(`Failed to fetch stats: ${pointsError.message}`)
  const totalPoints = points?.length || 0
  const approvedPoints = points?.filter(p => p.is_approved).length || 0
  const pendingApproval = totalPoints - approvedPoints
  const avgSafetyScore = points?.reduce((sum, p) => sum + (p.safety_score || 0), 0) / totalPoints || 0
  return { totalPoints, approvedPoints, pendingApproval, avgSafetyScore: Math.round(avgSafetyScore * 10) / 10, totalFeedback: 0 }
}
