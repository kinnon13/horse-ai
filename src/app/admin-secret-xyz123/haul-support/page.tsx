'use client'

import React from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { HaulSupportPageContent } from './HaulSupportPageContent'

export default function HaulSupportPage() {
  return (
    <AdminGuard>
      <HaulSupportPageContent />
    </AdminGuard>
  )
}