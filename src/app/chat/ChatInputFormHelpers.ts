// ChatInputFormHelpers.ts - Voice recognition helper logic
export function initSpeechRecognition(setInput: (v: string) => void, sendMessage: (v: string) => void) {
  if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) return null
  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.onresult = (e: any) => {
    const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('')
    setInput(transcript)
  }
  recognition.onerror = () => { /* handled by caller */ }
  return recognition
}

export function handleRecordingResult(e: any, setInput: (v: string) => void, sendMessage: (v: string) => void, setIsRecording: (v: boolean) => void, recognitionRef: any, pauseTimerRef: any) {
  const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('')
  setInput(transcript)
  if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
  pauseTimerRef.current = setTimeout(() => {
    if (transcript.trim()) { sendMessage(transcript.trim()); setIsRecording(false); recognitionRef.current?.stop() }
  }, 2000)
}

export const VoiceIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" /><path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h- BMW.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" /></svg>
)
