'use client'

import React from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { RequestsPageContent } from './RequestsPageContent'

export default function RequestsPage() {
  return (
    <AdminGuard>
      <RequestsPageContent />
    </AdminGuard>
  )
}