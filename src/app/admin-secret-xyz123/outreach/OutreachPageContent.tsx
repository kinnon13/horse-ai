'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { OutreachStatsCards } from './OutreachStatsCards'
import { OutreachComposeForm } from './OutreachComposeForm'
import { OutreachEditForm } from './OutreachEditForm'
import { OutreachMessagesList } from './OutreachMessagesList'
import { OutreachData } from './OutreachData'
import { OutreachUtils } from './OutreachUtils'
import { OutreachHeader } from './OutreachHeader'
import { OutreachHandlers } from './OutreachHandlers'
import { OutreachStateManager } from './OutreachStateManager'

export function OutreachPageContent() {
  const { user } = useAuth()
  const stateManager = OutreachStateManager.createStateManager()
  const handlers = OutreachHandlers.createHandlers(stateManager)

  const stats = OutreachUtils.calculateStats(stateManager.outreachMessages)

  return (
    <div className="min-h-screen bg-gray-50">
      <OutreachHeader onCompose={() => stateManager.setShowComposeForm(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OutreachStatsCards stats={stats} />

        {stateManager.showComposeForm && (
          <OutreachComposeForm
            composeData={stateManager.composeData}
            setComposeData={stateManager.setComposeData}
            onSubmit={handlers.handleComposeSubmit}
            onCancel={() => stateManager.setShowComposeForm(false)}
            onTemplateChange={handlers.handleTemplateChange}
          />
        )}

        {stateManager.editingMessage && (
          <OutreachEditForm
            composeData={stateManager.composeData}
            setComposeData={stateManager.setComposeData}
            onSubmit={handlers.handleUpdateMessage}
            onCancel={() => stateManager.setEditingMessage(null)}
            onTemplateChange={handlers.handleTemplateChange}
          />
        )}

        <OutreachMessagesList
          messages={stateManager.outreachMessages}
          onEdit={handlers.handleEditMessage}
          onDelete={handlers.handleDeleteMessage}
          onResend={handlers.handleResendMessage}
        />
      </div>
    </div>
  )
}