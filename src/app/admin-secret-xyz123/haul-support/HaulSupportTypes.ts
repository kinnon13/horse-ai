// TEMP STUB
export interface HaulSupportPoint {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  rig_ok_length_ft?: number;
  overnight_ok: boolean;
  has_cameras: boolean;
  lit_at_night: boolean;
  has_hookups: boolean;
  stall_available: boolean;
  emergency_ok: boolean;
  notes?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  safety_score: number;
  is_approved: boolean;
  created_at?: string;
  updated_at?: string;
  // Add other properties as needed
}

export interface HaulSupportFormData {
  name: string;
  type: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  rig_ok_length_ft?: number;
  overnight_ok: boolean;
  has_cameras: boolean;
  lit_at_night: boolean;
  has_hookups: boolean;
  stall_available: boolean;
  emergency_ok: boolean;
  notes?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  // Add other properties as needed
}

export interface HaulSupportStats {
  totalPoints: number;
  approvedPoints: number;
  pendingApproval: number;
  avgSafetyScore: number;
  totalFeedback: number;
}
