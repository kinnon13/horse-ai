import React from 'react'
import { ComposeData } from './OutreachData'
import { OutreachFormSelects } from './OutreachFormSelects'
import { OutreachFormTextInputs } from './OutreachFormTextInputs'

interface OutreachFormInputsProps {
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
  onTemplateChange: (templateId: string) => void
}

export function OutreachFormInputs({
  composeData,
  setComposeData,
  onTemplateChange
}: OutreachFormInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <OutreachFormSelects
        composeData={composeData}
        setComposeData={setComposeData}
        onTemplateChange={onTemplateChange}
      />
      <OutreachFormTextInputs
        composeData={composeData}
        setComposeData={setComposeData}
      />
    </div>
  )
}
