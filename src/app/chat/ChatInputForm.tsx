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
    <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200 bg-white">
      <div className="flex space-x-3 items-center">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything about horses..." className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-base" disabled={isLoading} />
        <button type="button" onClick={toggleRecording} disabled={isLoading || !recognitionRef.current} className={`p-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-100 hover:bg-gray-200'} disabled:opacity-50 transition-all min-w-[48px] min-h-[48px] shadow-sm`} aria-label="Record voice">
          <VoiceIcon />
        </button>
        <button type="submit" disabled={isLoading || !input.trim()} className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50 font-semibold shadow-lg transition-all">Send</button>
      </div>
    </form>
  )
}
