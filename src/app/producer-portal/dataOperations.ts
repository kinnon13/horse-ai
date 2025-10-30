import { supabase } from '@/lib/supabase'
import { ProducerProfile, ProducerHorse, ProducerEvent } from './types'

export async function saveProducerProfile(profile: Partial<ProducerProfile>): Promise<ProducerProfile | null> {
  const { data, error } = await supabase
    .from('producer_profiles')
    .upsert(profile)
    .select()
    .single()

  if (error) {
    console.error('Error saving producer profile:', error)
    return null
  }
  return data
}

export async function saveProducerHorse(horse: Omit<ProducerHorse, 'id' | 'created_at' | 'updated_at'>): Promise<ProducerHorse | null> {
  const { data, error } = await supabase
    .from('producer_horses')
    .insert([horse])
    .select()
    .single()

  if (error) {
    console.error('Error saving producer horse:', error)
    return null
  }
  return data
}

export async function updateProducerHorse(horseId: string, updates: Partial<ProducerHorse>): Promise<ProducerHorse | null> {
  const { data, error } = await supabase
    .from('producer_horses')
    .update(updates)
    .eq('id', horseId)
    .select()
    .single()

  if (error) {
    console.error('Error updating producer horse:', error)
    return null
  }
  return data
}

export async function deleteProducerHorse(horseId: string): Promise<boolean> {
  const { error } = await supabase
    .from('producer_horses')
    .delete()
    .eq('id', horseId)

  if (error) {
    console.error('Error deleting producer horse:', error)
    return false
  }
  return true
}

export async function saveProducerEvent(event: Omit<ProducerEvent, 'id' | 'created_at' | 'updated_at'>): Promise<ProducerEvent | null> {
  const { data, error } = await supabase
    .from('producer_events')
    .insert([event])
    .select()
    .single()

  if (error) {
    console.error('Error saving producer event:', error)
    return null
  }
  return data
}

export async function deleteProducerEvent(eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from('producer_events')
    .delete()
    .eq('id', eventId)

  if (error) {
    console.error('Error deleting producer event:', error)
    return false
  }
  return true
}

