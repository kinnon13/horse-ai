// ChatVoiceRecorder.tsx - Voice recording hook
'use client'
import { useEffect, useRef, useState } from 'react'

export function useVoiceRecorder(sendMessage: (content: string) => void, setInput: (value: string) => void) {
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) return
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('')
      setInput(transcript)
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
      pauseTimerRef.current = setTimeout(() => {
        if (transcript.trim()) sendMessage(transcript.trim())
        setIsRecording(false)
        recognitionRef.current?.stop()
      }, 2000)
    }
    recognitionRef.current.onerror = () => setIsRecording(false)
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
      recognitionRef.current?.stop()
    }
  }, [sendMessage, setInput])

  const toggleRecording = () => {
    if (!recognitionRef.current) return
    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      setInput('')
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  return { isRecording, toggleRecording, recognitionRef }
}
