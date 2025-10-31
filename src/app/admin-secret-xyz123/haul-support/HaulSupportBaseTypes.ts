// HaulSupportBaseTypes.ts - Base type definitions for haul support
export interface HaulSupportBaseData {
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
}

export interface HaulSupportStats {
  totalPoints: number;
  approvedPoints: number;
  pendingApproval: number;
  avgSafetyScore: number;
  totalFeedback: number;
}


