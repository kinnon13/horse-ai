export interface HaulSupportPoint {id: string
  name: string
  type: string
  city: string
  state: string
  lat: number
  lng: number
  rig_ok_length_ft: number | null
  overnight_ok: boolean
  has_cameras: boolean
  lit_at_night: boolean
  has_hookups: boolean
  stall_available: boolean
  emergency_ok: boolean
  safety_score: number
  would_use_again_percentage: number
  last_verified_at: string | null
  verified_by_user_id: string | null
  notes: string | null
  contact_phone: string | null
  contact_email: string | null
  website: string | null
  is_approved: boolean
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface HaulSupportStats {totalPoints: number
  approvedPoints: number
  pendingApproval: number
  avgSafetyScore: number
  totalFeedback: number
}

export interface HaulSupportFormData {name: string
  type: string
  city: string
  state: string
  lat: number
  lng: number
  rig_ok_length_ft?: number
  overnight_ok: boolean
  has_cameras: boolean
  lit_at_night: boolean
  has_hookups: boolean
  stall_available: boolean
  emergency_ok: boolean
  notes?: string
  contact_phone?: string
  contact_email?: string
  website?: string
}

