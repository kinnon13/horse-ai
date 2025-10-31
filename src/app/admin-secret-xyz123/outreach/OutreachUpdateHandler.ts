import React from 'react'
import { OutreachData, ComposeData, OutreachMessage } from './OutreachData'
import { OutreachUtils } from './OutreachUtils'

interface OutreachUpdateHandlerProps {
  outreachMessages: OutreachMessage[]
  setOutreachMessages: (messages: OutreachMessage[] | ((prev: OutreachMessage[]) => OutreachMessage[])) => void
  showComposeForm: boolean
  setShowComposeForm: (show: boolean) => void
  editingMessage: any
  setEditingMessage: (message: any) => void
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export class OutreachUpdateHandler {
  static createHandler(props: OutreachUpdateHandlerProps) {
    return (e: React.FormEvent) => {
      e.preventDefault()
      props.setOutreachMessages(prev => prev.map(m => 
        m.id === props.editingMessage.id ? { ...m, ...props.composeData } : m
      ))
      props.setEditingMessage(null)
      props.setComposeData(OutreachUtils.getInitialComposeData())
      alert('Outreach message updated successfully!')
    }
  }
}



