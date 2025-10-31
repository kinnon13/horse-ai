// TEMP STUB
import { HaulSupportBaseData, HaulSupportStats } from './HaulSupportBaseTypes'

export interface HaulSupportPoint extends HaulSupportBaseData {
  id: string;
  safety_score: number;
  is_approved: boolean;
  created_at?: string;
  updated_at?: string;
  // Add other properties as needed
}

export interface HaulSupportFormData extends HaulSupportBaseData {
  // Add other properties as needed
}

export type { HaulSupportStats } from './HaulSupportBaseTypes'
