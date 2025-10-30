import React from 'react'
import { OutreachData, ComposeData, OutreachMessage } from './OutreachData'

interface OutreachTemplateHandlerProps {
  outreachMessages: OutreachMessage[]
  setOutreachMessages: (messages: OutreachMessage[] | ((prev: OutreachMessage[]) => OutreachMessage[])) => void
  showComposeForm: boolean
  setShowComposeForm: (show: boolean) => void
  editingMessage: any
  setEditingMessage: (message: any) => void
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export class OutreachTemplateHandler {
  static createHandler(props: OutreachTemplateHandlerProps) {
    return (templateId: string) => {
      const template = OutreachData.getTemplate(templateId)
      if (template) {
        props.setComposeData(prev => ({
          ...prev,
          template: templateId,
          subject: template.subject,
          content: template.content
        }))
      }
    }
  }
}

