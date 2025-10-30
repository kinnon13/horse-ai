import { HaulSupportPoint } from './HaulSupportTypes'

export interface CreatePointParams {
  formData: any
  setPoints: (points: HaulSupportPoint[]) => void
  setShowAddForm: (show: boolean) => void
  loadData: () => Promise<void>
}

export interface UpdatePointParams {
  pointId: string
  updates: any
  setPoints: (points: HaulSupportPoint[]) => void
  setEditingPoint: (point: HaulSupportPoint | null) => void
  loadData: () => Promise<void>
}

export interface DeletePointParams {
  pointId: string
  setPoints: (points: HaulSupportPoint[]) => void
  loadData: () => Promise<void>
}

export interface ToggleApprovalParams {
  pointId: string
  approved: boolean
  setPoints: (points: HaulSupportPoint[]) => void
  loadData: () => Promise<void>
}



