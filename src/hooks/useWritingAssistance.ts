import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'

interface WritingContext {type: 'email' | 'contract' | 'proposal' | 'letter'
  subject?: string
  recipient?: string
  senderName?: string
  senderTitle?: string
  senderCompany?: string
  contactInfo?: string
  additionalInfo?: string
  party1?: string
  party2?: string
  scope?: string
  terms?: string
  payment?: string
  duration?: string
  termination?: string
  jurisdiction?: string
  objective?: string
  methodology?: string
  timeline?: string
  investment?: string
  benefits?: string
  nextSteps?: string
  senderAddress?: string
  senderCity?: string
  recipientName?: string
  recipientAddress?: string
  recipientCity?: string
  recipientTitle?: string
}

interface WritingResponse {success: boolean
  assistance: string
  type: string
  context: any
  error?: string
  upgradeRequired?: boolean
}

export function useWritingAssistance() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const generateWriting = async (type: string, context: WritingContext, prompt: string): Promise<WritingResponse | null> => {
    if (!user) {
      setError('You must be logged in to use writing assistance')
      return null
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/writing-assistance', {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          context,
          user_id: user.id,
          prompt
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.upgradeRequired) {
          setError('Writing assistance requires Plus tier subscription')
        } else {
          setError(data.error || 'Writing assistance failed')
        }
        return data
      }

      setResult(data.assistance)
      return data

    } catch (err) {
      const errorMessage = 'Network error during writing assistance'
      setError(errorMessage)
      return { success: false, error: errorMessage, assistance: '', type, context }
    } finally {
      setLoading(false)
    }
  }

  const generateEmail = async (context: WritingContext, prompt: string) => {
    return generateWriting('email', context, prompt)
  }

  const generateContract = async (context: WritingContext, prompt: string) => {
    return generateWriting('contract', context, prompt)
  }

  const generateProposal = async (context: WritingContext, prompt: string) => {
    return generateWriting('proposal', context, prompt)
  }

  const generateLetter = async (context: WritingContext, prompt: string) => {
    return generateWriting('letter', context, prompt)
  }

  return {
    generateWriting,
    generateEmail,
    generateContract,
    generateProposal,
    generateLetter,
    loading,
    error,
    result,
    clearError: () => setError(null),
    clearResult: () => setResult(null)
  }
}


