// TEMP STUB
export function handleCreatePoint(params: any) { return; }
export function handleUpdatePoint(params: any) { return; }
export function handleDeletePoint(params: any) { return; }
export function handleToggleApproval(params: any) { return; }

// Type exports
export interface CreatePointParams {
  point: any;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export interface UpdatePointParams {
  id: string;
  updates: any;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export interface DeletePointParams {
  id: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export interface ToggleApprovalParams {
  id: string;
  approved: boolean;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}