'use client'

import React from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { CalendarPageContent } from './CalendarPageContent'

export default function CalendarPage() {
  return (
    <AdminGuard>
      <CalendarPageContent />
    </AdminGuard>
  )
}
