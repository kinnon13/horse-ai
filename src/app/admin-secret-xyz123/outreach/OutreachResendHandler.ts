import React from 'react'
import { OutreachData, ComposeData, OutreachMessage } from './OutreachData'

interface OutreachResendHandlerProps {
  outreachMessages: OutreachMessage[]
  setOutreachMessages: (messages: OutreachMessage[] | ((prev: OutreachMessage[]) => OutreachMessage[])) => void
  showComposeForm: boolean
  setShowComposeForm: (show: boolean) => void
  editingMessage: any
  setEditingMessage: (message: any) => void
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export class OutreachResendHandler {
  static createHandler(props: OutreachResendHandlerProps) {
    return (messageId: string) => {
      props.setOutreachMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, status: 'pending' } : m
      ))
      alert('Message queued for resend!')
    }
  }
}

