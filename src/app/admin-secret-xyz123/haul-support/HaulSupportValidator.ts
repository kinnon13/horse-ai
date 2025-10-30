import { HaulSupportFormData } from './HaulSupportTypes'

export function validateHaulSupportPoint(data: any): HaulSupportFormData {
  if (!data.name?.trim()) {
    throw new Error('Name is required')
  }
  
  if (!data.type?.trim()) {
    throw new Error('Type is required')
  }
  
  if (!data.city?.trim()) {
    throw new Error('City is required')
  }
  
  if (!data.state?.trim()) {
    throw new Error('State is required')
  }
  
  if (typeof data.lat !== 'number' || data.lat < -90 || data.lat > 90) {
    throw new Error('Valid latitude is required')
  }
  
  if (typeof data.lng !== 'number' || data.lng < -180 || data.lng > 180) {
    throw new Error('Valid longitude is required')
  }

  return {
    name: data.name.trim(),
    type: data.type.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    lat: data.lat,
    lng: data.lng,
    rig_ok_length_ft: data.rig_ok_length_ft ? parseFloat(data.rig_ok_length_ft) : undefined,
    overnight_ok: Boolean(data.overnight_ok),
    has_cameras: Boolean(data.has_cameras),
    lit_at_night: Boolean(data.lit_at_night),
    has_hookups: Boolean(data.has_hookups),
    stall_available: Boolean(data.stall_available),
    emergency_ok: Boolean(data.emergency_ok),
    notes: data.notes?.trim(),
    contact_phone: data.contact_phone?.trim(),
    contact_email: data.contact_email?.trim(),
    website: data.website?.trim()
  }
}

