'use client'

import React from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { ProvidersPageContent } from './ProvidersPageContent'

export default function ProvidersPage() {
  return (
    <AdminGuard>
      <ProvidersPageContent />
    </AdminGuard>
  )
}