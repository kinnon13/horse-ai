import React from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { ClaimsPageContent } from './ClaimsPageContent'

export default function ClaimsPage() {
  return (
    <AdminGuard>
      <ClaimsPageContent />
    </AdminGuard>
  )
}