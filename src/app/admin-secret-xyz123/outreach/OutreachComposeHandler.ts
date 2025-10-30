import React from 'react'
import { OutreachData, ComposeData, OutreachMessage } from './OutreachData'

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
      const newMessage = OutreachData.createNewMessage(props.composeData)
      props.setOutreachMessages(prev => [newMessage, ...prev])
      props.setShowComposeForm(false)
      props.setComposeData(OutreachData.getInitialComposeData())
      alert('Outreach message created successfully!')
    }
  }
}

