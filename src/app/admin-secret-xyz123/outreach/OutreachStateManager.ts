import React, { useState } from 'react'
import { OutreachData, ComposeData, OutreachMessage } from './OutreachData'

export class OutreachStateManager {
  static createStateManager() {
    const [outreachMessages, setOutreachMessages] = useState(OutreachData.getInitialMessages())
    const [showComposeForm, setShowComposeForm] = useState(false)
    const [editingMessage, setEditingMessage] = useState<any>(null)
    const [composeData, setComposeData] = useState(OutreachData.getInitialComposeData())

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

