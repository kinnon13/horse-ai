'use client'

import React from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { UsersPageContent } from './UsersPageContent'

export default function UsersPage() {
  return (
    <AdminGuard>
      <UsersPageContent />
    </AdminGuard>
  )
}