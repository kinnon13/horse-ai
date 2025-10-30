import React from 'react'
import { OutreachData, ComposeData, OutreachMessage } from './OutreachData'

interface OutreachDeleteHandlerProps {
  outreachMessages: OutreachMessage[]
  setOutreachMessages: (messages: OutreachMessage[] | ((prev: OutreachMessage[]) => OutreachMessage[])) => void
  showComposeForm: boolean
  setShowComposeForm: (show: boolean) => void
  editingMessage: any
  setEditingMessage: (message: any) => void
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export class OutreachDeleteHandler {
  static createHandler(props: OutreachDeleteHandlerProps) {
    return (messageId: string) => {
      const confirmed = confirm('Are you sure you want to delete this outreach message?')
      if (!confirmed) return
      
      props.setOutreachMessages(prev => prev.filter(m => m.id !== messageId))
      alert('Outreach message deleted successfully!')
    }
  }
}

