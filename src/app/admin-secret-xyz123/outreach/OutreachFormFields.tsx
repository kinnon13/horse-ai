import React from 'react'
import { ComposeData } from './OutreachData'
import { OutreachFormInputs } from './OutreachFormInputs'
import { OutreachFormTextarea } from './OutreachFormTextarea'

interface OutreachFormFieldsProps {
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
  onTemplateChange: (templateId: string) => void
}

export function OutreachFormFields({
  composeData,
  setComposeData,
  onTemplateChange
}: OutreachFormFieldsProps) {
  return (
    <>
      <OutreachFormInputs
        composeData={composeData}
        setComposeData={setComposeData}
        onTemplateChange={onTemplateChange}
      />
      <OutreachFormTextarea
        composeData={composeData}
        setComposeData={setComposeData}
      />
    </>
  )
}
