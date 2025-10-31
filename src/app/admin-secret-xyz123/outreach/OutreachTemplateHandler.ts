import React from 'react'
import { OutreachData, ComposeData, OutreachMessage } from './OutreachData'
import { OutreachUtils } from './OutreachUtils'

interface OutreachTemplateHandlerProps {
  outreachMessages: OutreachMessage[]
  setOutreachMessages: (messages: OutreachMessage[] | ((prev: OutreachMessage[]) => OutreachMessage[])) => void
  showComposeForm: boolean
  setShowComposeForm: (show: boolean) => void
  editingMessage: any
  setEditingMessage: (message: any) => void
  composeData: ComposeData
  setComposeData: (data: ComposeData | ((prev: ComposeData) => ComposeData)) => void
}

export class OutreachTemplateHandler {
  static createHandler(props: OutreachTemplateHandlerProps) {
    return (templateId: string) => {
      const template = OutreachUtils.getTemplate(templateId)
      if (template) {
        props.setComposeData((prev: ComposeData) => ({
          ...prev,
          template: templateId,
          subject: '',
          content: template
        }))
      }
    }
  }
}



