import { supabase } from '@/lib/supabase'
import { ProducerProfile, ProducerHorse, ProducerEvent } from './types'

export async function loadProducerData(producerId: string) {
  const [profile, horses, events] = await Promise.all([
    loadProducerProfile(producerId),
    loadProducerHorses(producerId),
    loadProducerEvents(producerId)
  ])

  return { profile, horses, events }
}

async function loadProducerProfile(producerId: string): Promise<ProducerProfile | null> {
  const { data, error } = await supabase
    .from('producer_profiles')
    .select('*')
    .eq('id', producerId)
    .single()

  if (error) {
    console.error('Error loading producer profile:', error)
    return null
  }
  return data
}

async function loadProducerHorses(producerId: string): Promise<ProducerHorse[]> {
  const { data, error } = await supabase
    .from('producer_horses')
    .select('*')
    .eq('producer_id', producerId)
    .order('horse_name')

  if (error) {
    console.error('Error loading producer horses:', error)
    return []
  }
  return data || []
}

async function loadProducerEvents(producerId: string): Promise<ProducerEvent[]> {
  const { data, error } = await supabase
    .from('producer_events')
    .select('*')
    .eq('producer_id', producerId)
    .order('event_date', { ascending: false })

  if (error) {
    console.error('Error loading producer events:', error)
    return []
  }
  return data || []
}

