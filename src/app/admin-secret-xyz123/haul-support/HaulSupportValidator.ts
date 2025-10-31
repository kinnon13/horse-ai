import { HaulSupportFormData } from './HaulSupportTypes'
import { 
  validateRequiredString, 
  validateCoordinates, 
  sanitizeOptionalString, 
  sanitizeOptionalNumber 
} from './HaulSupportValidationHelpers'

export function validateHaulSupportPoint(data: any): HaulSupportFormData {
  const name = validateRequiredString(data.name, 'Name')
  const type = validateRequiredString(data.type, 'Type')
  const city = validateRequiredString(data.city, 'City')
  const state = validateRequiredString(data.state, 'State')
  
  validateCoordinates(data.lat, data.lng)

  return {
    name,
    type,
    city,
    state,
    lat: data.lat,
    lng: data.lng,
    rig_ok_length_ft: sanitizeOptionalNumber(data.rig_ok_length_ft),
    overnight_ok: Boolean(data.overnight_ok),
    has_cameras: Boolean(data.has_cameras),
    lit_at_night: Boolean(data.lit_at_night),
    has_hookups: Boolean(data.has_hookups),
    stall_available: Boolean(data.stall_available),
    emergency_ok: Boolean(data.emergency_ok),
    notes: sanitizeOptionalString(data.notes),
    contact_phone: sanitizeOptionalString(data.contact_phone),
    contact_email: sanitizeOptionalString(data.contact_email),
    website: sanitizeOptionalString(data.website)
  }
}




