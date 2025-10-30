import React from 'react'
import { ComposeData } from './OutreachData'
import { OutreachFormFields } from './OutreachFormFields'
import { OutreachFormActions } from './OutreachFormActions'

interface OutreachComposeFormProps {
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  onTemplateChange: (templateId: string) => void
}

export function OutreachComposeForm({
  composeData,
  setComposeData,
  onSubmit,
  onCancel,
  onTemplateChange
}: OutreachComposeFormProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Compose New Message</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <OutreachFormFields
          composeData={composeData}
          setComposeData={setComposeData}
          onTemplateChange={onTemplateChange}
        />
        <OutreachFormActions onCancel={onCancel} />
      </form>
    </div>
  )
}