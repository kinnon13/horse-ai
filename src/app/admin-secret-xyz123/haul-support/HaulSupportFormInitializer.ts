import { HaulSupportFormData, HaulSupportPoint } from './HaulSupportTypes'

export class HaulSupportFormInitializer {
  static initializeFormData(initialData?: Partial<HaulSupportPoint>): HaulSupportFormData {
    return {
      name: initialData?.name || '',
      type: initialData?.type || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      lat: initialData?.lat || 0,
      lng: initialData?.lng || 0,
      rig_ok_length_ft: initialData?.rig_ok_length_ft || undefined,
      overnight_ok: initialData?.overnight_ok || false,
      has_cameras: initialData?.has_cameras || false,
      lit_at_night: initialData?.lit_at_night || false,
      has_hookups: initialData?.has_hookups || false,
      stall_available: initialData?.stall_available || false,
      emergency_ok: initialData?.emergency_ok || false,
      notes: initialData?.notes || '',
      contact_phone: initialData?.contact_phone || '',
      contact_email: initialData?.contact_email || '',
      website: initialData?.website || ''
    }
  }
}

