'use client'

import React from 'react'
import { AdminGuard } from '@/components/AdminGuard'
import { OutreachPageContent } from './OutreachPageContent'
import { OutreachStateManager } from './OutreachStateManager'
import { OutreachHandlers } from './OutreachHandlers'

export default function OutreachPage() {
  const stateManager = OutreachStateManager.createStateManager()
  const handlers = OutreachHandlers.createHandlers(stateManager)

  return (
    <AdminGuard>
      <OutreachPageContent stateManager={stateManager} handlers={handlers} />
    </AdminGuard>
  )
}