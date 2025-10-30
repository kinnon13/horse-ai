import React, { useState } from 'react'
import { OutreachData, ComposeData, OutreachMessage } from './OutreachData'
import { OutreachUtils } from './OutreachUtils'

export class OutreachStateManager {
  static createStateManager() {
    const [outreachMessages, setOutreachMessages] = useState(OutreachUtils.getInitialMessages())
    const [showComposeForm, setShowComposeForm] = useState(false)
    const [editingMessage, setEditingMessage] = useState<any>(null)
    const [composeData, setComposeData] = useState(OutreachUtils.getInitialComposeData())

    return {
      outreachMessages,
      setOutreachMessages,
      showComposeForm,
      setShowComposeForm,
      editingMessage,
      setEditingMessage,
      composeData,
      setComposeData
    }
  }
}



