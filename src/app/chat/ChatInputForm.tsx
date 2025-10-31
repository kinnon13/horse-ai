// ChatInputForm.tsx - Input form with voice support
'use client'
import React, { useEffect, useRef } from 'react'
import { initSpeechRecognition, handleRecordingResult, VoiceIcon } from './ChatInputFormHelpers'

interface ChatInputFormProps {
  isLoading: boolean
  sendMessage: (content: string) => void
  clearMessages: () => void
}

export function ChatInputForm({ isLoading, sendMessage, clearMessages }: ChatInputFormProps) {
  const [input, setInput] = React.useState('')
  const [isRecording, setIsRecording] = React.useState(false)
  const recognitionRef = useRef<any>(null)
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    recognitionRef.current = initSpeechRecognition(setInput, sendMessage)
    if (!recognitionRef.current) return
    recognitionRef.current.onresult = (e: any) => handleRecordingResult(e, setInput, sendMessage, setIsRecording, recognitionRef, pauseTimerRef)
    recognitionRef.current.onerror = () => setIsRecording(false)
    return () => { if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current); recognitionRef.current?.stop() }
  }, [sendMessage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) { sendMessage(input.trim()); setInput('') }
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) return
    if (isRecording) { recognitionRef.current.stop(); setIsRecording(false) } else { setInput(''); recognitionRef.current.start(); setIsRecording(true) }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex space-x-2 items-center">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or speak..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
        <button type="button" onClick={toggleRecording} disabled={isLoading || !recognitionRef.current} className={`p-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200 hover:bg-gray-300'} disabled:opacity-50 transition-colors min-w-[48px] min-h-[48px]`} aria-label="Record voice">
          <VoiceIcon />
        </button>
        <button type="submit" disabled={isLoading || !input.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Send</button>
        <button type="button" onClick={clearMessages} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Clear</button>
      </div>
    </form>
  )
}
