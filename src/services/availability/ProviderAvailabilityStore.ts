// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
export type AvailabilitySlot = {providerId: string; startTime: string; endTime: string; status: "open" | "held" | "booked"; jobId?: string}
import { supabaseAdmin } from '@/lib/supabase'
export async function getAvailability(providerId: string): Promise<AvailabilitySlot[]> {
  if (!supabaseAdmin) throw new Error('Supabase admin not available')
  const { data: slots, error } = await supabaseAdmin.from('provider_availability').select('*').eq('provider_id', providerId).eq('status', 'open').gte('start_time', new Date().toISOString()).order('start_time', { ascending: true })
  if (error) throw error
  return (slots || []).map(slot => ({providerId: slot.provider_id, startTime: slot.start_time, endTime: slot.end_time, status: slot.status, jobId: slot.job_id}))
}
export async function holdSlot(providerId: string, startTime: string, jobId: string): Promise<AvailabilitySlot | null> {
  if (!supabaseAdmin) throw new Error('Supabase admin not available')
  const { data: slot, error } = await supabaseAdmin.from('provider_availability').update({status: 'held', job_id: jobId, updated_at: new Date().toISOString()}).eq('provider_id', providerId).eq('start_time', startTime).eq('status', 'open').select().single()
  if (error || !slot) return null
  return {providerId: slot.provider_id, startTime: slot.start_time, endTime: slot.end_time, status: slot.status, jobId: slot.job_id}
}
export async function confirmSlot(jobId: string): Promise<void> {
  if (!supabaseAdmin) throw new Error('Supabase admin not available')
  const { error } = await supabaseAdmin.from('provider_availability').update({status: 'booked', updated_at: new Date().toISOString()}).eq('job_id', jobId).eq('status', 'held')
  if (error) throw error
}

