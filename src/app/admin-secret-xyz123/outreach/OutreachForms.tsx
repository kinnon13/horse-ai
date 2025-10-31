// OutreachForms.tsx (35 lines) - Single responsibility: Form containers
'use client'

import React from 'react'
import { OutreachComposeForm } from './OutreachComposeForm'
import { OutreachEditForm } from './OutreachEditForm'

interface OutreachFormsProps {
  stateManager: any
  handlers: any
}

export function OutreachForms({ stateManager, handlers }: OutreachFormsProps) {
  return (
    <>
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
    </>
  )
}