// ChatInputForm.tsx - Input form with voice support
'use client'
import React from 'react'
import { useVoiceRecorder } from './ChatVoiceRecorder'

interface ChatInputFormProps {
  isLoading: boolean
  sendMessage: (content: string) => void
  clearMessages: () => void
}

export function ChatInputForm({ isLoading, sendMessage, clearMessages }: ChatInputFormProps) {
  const [input, setInput] = React.useState('')
  const { isRecording, toggleRecording, recognitionRef } = useVoiceRecorder(sendMessage, setInput)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex space-x-2 items-center">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or speak..." className="flex-1 px-3 py-2 border border-gray-human rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
        <button type="button" onClick={toggleRecording} disabled={isLoading || !recognitionRef.current} className={`p-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200 hover:bg-gray-300'} disabled:opacity-50 transition-colors min-w-[48px] min-h-[48px]`} aria-label="Record voice">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" /><path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" /></svg>
        </button>
        <button type="submit" disabled={isLoading || !input.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Send</button>
        <button type="button" onClick={clearMessages} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Clear</button>
      </div>
    </form>
  )
}
