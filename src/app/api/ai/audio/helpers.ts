// helpers.ts - Audio processing utilities for Whisper transcription
export interface AudioUpload {
  file?: File
  url?: string
  format?: string
}

export async function processAudioInput(upload: AudioUpload): Promise<File> {
  if (upload.file) return upload.file
  if (upload.url) {
    const response = await fetch(upload.url)
    if (!response.ok) throw new Error('Failed to fetch audio from URL')
    const blob = await response.blob()
    return new File([blob], 'audio.webm', { type: upload.format || 'audio/webm' })
  }
  throw new Error('Either file or url must be provided')
}

export async function transcribeWithWhisper(audioFile: File, apiKey: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', audioFile)
  formData.append('model', 'whisper-1')
  formData.append('language', 'en')

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Whisper API error: ${response.status} - ${error}`)
  }

  const result = await response.json()
  return result.text || ''
}

export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 25 * 1024 * 1024 // 25MB limit
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/m4a']
  
  if (file.size > maxSize) return { valid: false, error: 'File too large (max 25MB)' }
  if (!allowedTypes.includes(file.type)) return { valid: false, error: 'Unsupported audio format' }
  return { valid: true }
}
