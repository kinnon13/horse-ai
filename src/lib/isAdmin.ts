// Admin check utility
export function isAdmin(user: any): boolean {
  // TODO: Implement actual admin check logic
  // This should check user roles, permissions, etc.
  return user?.email === 'admin@horse.ai' || user?.role === 'admin'
}

export function requireAdmin(user: any): boolean {
  if (!isAdmin(user)) {
    throw new Error('Admin access required')
  }
  return true
}
