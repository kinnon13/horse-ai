// Breaking down useHorseClaims.ts (196 lines → <50 per file)

export interface HorseClaim {
  id: string
  horse_id: string
  user_id: string | null
  claim_type: string | null
  status: string
  proof_doc_url: string | null
  auto_verified: boolean
  created_at: string
  updated_at: string
  horses?: {
    id: string
    name: string
    breed: string
    reg_number: string | null
    sire: string | null
    dam: string | null
  }
  users?: {
    id: string
    email: string
    full_name: string | null
    phone: string | null
  }
}

export interface ClaimFilters {
  user_id?: string
  horse_id?: string
  status?: string
  limit?: number
}


