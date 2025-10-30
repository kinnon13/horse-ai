'use client'

import React from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { OutreachPageContent } from './OutreachPageContent'

export default function OutreachPage() {
  return (
    <AdminGuard>
      <OutreachPageContent />
    </AdminGuard>
  )
}