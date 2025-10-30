import React from 'react'
import { ComposeData } from './OutreachData'
import { OutreachFormRequiredInputs } from './OutreachFormRequiredInputs'
import { OutreachFormOptionalInputs } from './OutreachFormOptionalInputs'

interface OutreachFormTextInputsProps {
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export function OutreachFormTextInputs({
  composeData,
  setComposeData
}: OutreachFormTextInputsProps) {
  return (
    <>
      <OutreachFormRequiredInputs
        composeData={composeData}
        setComposeData={setComposeData}
      />
      <OutreachFormOptionalInputs
        composeData={composeData}
        setComposeData={setComposeData}
      />
    </>
  )
}
