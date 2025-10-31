'use client'

import React from 'react'
import { OutreachStateManager } from './OutreachStateManager'
import { OutreachHandlers } from './OutreachHandlers'
import { OutreachComposeForm } from './OutreachComposeForm'
import { OutreachMessagesList } from './OutreachMessagesList'
import { OutreachStatsCards } from './OutreachStatsCards'

interface OutreachPageContentProps {
  stateManager: any
  handlers: any
}

export function OutreachPageContent({ stateManager, handlers }: OutreachPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Outreach Management</h1>
        <button
          onClick={() => stateManager.setShowComposeForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Compose Message
        </button>
      </div>

      <OutreachStatsCards stats={stateManager.outreachStats} />

      <div className="bg-white shadow rounded-lg">
        {stateManager.showComposeForm && (
          <OutreachComposeForm
            composeData={stateManager.composeData}
            setComposeData={stateManager.setComposeData}
            onSubmit={handlers.handleComposeSubmit}
            onCancel={() => stateManager.setShowComposeForm(false)}
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
