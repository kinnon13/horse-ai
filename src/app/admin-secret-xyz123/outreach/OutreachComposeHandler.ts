import React from 'react'
import { ComposeData, OutreachMessage } from './OutreachData'
import { OutreachUtils } from './OutreachUtils'

interface OutreachComposeHandlerProps {
  outreachMessages: OutreachMessage[]
  setOutreachMessages: (messages: OutreachMessage[] | ((prev: OutreachMessage[]) => OutreachMessage[])) => void
  showComposeForm: boolean
  setShowComposeForm: (show: boolean) => void
  editingMessage: any
  setEditingMessage: (message: any) => void
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export class OutreachComposeHandler {
  static createHandler(props: OutreachComposeHandlerProps) {
    return (e: React.FormEvent) => {
      e.preventDefault()
      const newMessage = OutreachUtils.createNewMessage(props.composeData)
      props.setOutreachMessages(prev => [newMessage, ...prev])
      props.setShowComposeForm(false)
      props.setComposeData(OutreachUtils.getInitialComposeData())
      alert('Outreach message created successfully!')
    }
  }
}