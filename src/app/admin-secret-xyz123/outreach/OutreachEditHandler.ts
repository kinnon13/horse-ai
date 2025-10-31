import React from 'react'
import { ComposeData, OutreachMessage, OutreachUtils } from './OutreachData'

interface OutreachEditHandlerProps {
  outreachMessages: OutreachMessage[]
  setOutreachMessages: (messages: OutreachMessage[] | ((prev: OutreachMessage[]) => OutreachMessage[])) => void
  showComposeForm: boolean
  setShowComposeForm: (show: boolean) => void
  editingMessage: any
  setEditingMessage: (message: any) => void
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export class OutreachEditHandler {
  static createHandler(props: OutreachEditHandlerProps) {
    return (message: any) => {
      props.setEditingMessage(message)
      const editData = OutreachUtils.getEditData(message)
      if (editData) {
        props.setComposeData(editData as ComposeData)
      }
    }
  }
}



