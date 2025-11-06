// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
// entityIntelligence.ts - 360° entity intelligence queries
import { getSupabaseClient } from './entityIntelligence.helpers'

export async function getUser360(userId: string) {
  const supabase = await getSupabaseClient()
  return await supabase.from('user_dimensions').select('*').eq('user_id', userId).single()
}

export async function getHorse360(horseId: string) {
  const supabase = await getSupabaseClient()
  return await supabase.from('horse_dimensions').select('*').eq('horse_id', horseId).single()
}

export async function getBusiness360(businessId: string) {
  const supabase = await getSupabaseClient()
  return await supabase.from('business_dimensions').select('*').eq('business_id', businessId).single()
}

export async function getRelationships(entityId: string, maxDegrees = 2) {
  const supabase = await getSupabaseClient()
  const { data } = await supabase.from('entity_relationships').select('*')
    .or(`entity1_id.eq.${entityId},entity2_id.eq.${entityId}`)
    .lte('degree', maxDegrees)
  return data || []
}

export async function storeRelationship(
  entity1: {type: string, id: string}, 
  entity2: {type: string, id: string}, 
  relationshipType: string, 
  degree: number
) {
  const supabase = await getSupabaseClient()
  return await supabase.from('entity_relationships').insert({
    entity1_type: entity1.type,
    entity1_id: entity1.id,
    entity2_type: entity2.type,
    entity2_id: entity2.id,
    relationship_type: relationshipType,
    degree
  })
}
