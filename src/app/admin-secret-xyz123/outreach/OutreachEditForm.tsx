import React from 'react'
import { ComposeData } from './OutreachData'
import { OutreachFormFields } from './OutreachFormFields'
import { OutreachEditFormActions } from './OutreachEditFormActions'

interface OutreachEditFormProps {
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  onTemplateChange: (templateId: string) => void
}

export function OutreachEditForm({
  composeData,
  setComposeData,
  onSubmit,
  onCancel,
  onTemplateChange
}: OutreachEditFormProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Message</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <OutreachFormFields
          composeData={composeData}
          setComposeData={setComposeData}
          onTemplateChange={onTemplateChange}
        />
        <OutreachEditFormActions onCancel={onCancel} />
      </form>
    </div>
  )
}
