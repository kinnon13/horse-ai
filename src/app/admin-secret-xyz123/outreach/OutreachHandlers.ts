import React from 'react'
import { OutreachData, ComposeData, OutreachMessage } from './OutreachData'
import { OutreachComposeHandler } from './OutreachComposeHandler'
import { OutreachTemplateHandler } from './OutreachTemplateHandler'
import { OutreachDeleteHandler } from './OutreachDeleteHandler'
import { OutreachResendHandler } from './OutreachResendHandler'
import { OutreachEditHandler } from './OutreachEditHandler'
import { OutreachUpdateHandler } from './OutreachUpdateHandler'

interface OutreachHandlersProps {
  outreachMessages: OutreachMessage[]
  setOutreachMessages: (messages: OutreachMessage[] | ((prev: OutreachMessage[]) => OutreachMessage[])) => void
  showComposeForm: boolean
  setShowComposeForm: (show: boolean) => void
  editingMessage: any
  setEditingMessage: (message: any) => void
  composeData: ComposeData
  setComposeData: (data: ComposeData | ((prev: ComposeData) => ComposeData)) => void
}

export class OutreachHandlers {
  static createHandlers(props: OutreachHandlersProps) {
    return {
      handleComposeSubmit: OutreachComposeHandler.createHandler(props),
      handleTemplateChange: OutreachTemplateHandler.createHandler(props),
      handleDeleteMessage: OutreachDeleteHandler.createHandler(props),
      handleResendMessage: OutreachResendHandler.createHandler(props),
      handleEditMessage: OutreachEditHandler.createHandler(props),
      handleUpdateMessage: OutreachUpdateHandler.createHandler(props)
    }
  }
}
