'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { VerifyView } from './VerifyView'

export default function VerifyPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'verify' | 'business' | 'subscribe' | 'complete'>('verify')
  const [data, setData] = useState<any>(null)
  const [horseVerified, setHorseVerified] = useState(false)
  const [isBusinessOwner, setIsBusinessOwner] = useState<boolean | null>(null)

  useEffect(() => {
    loadVerificationData()
  }, [token])

  async function loadVerificationData() {
    try {
      // Verify token and get data
      const response = await fetch(`/api/verify/validate?token=${token}`)
      const result = await response.json()

      if (!result.valid) {
        setData({ error: 'Invalid or expired verification link' })
        setLoading(false)
        return
      }

      setData(result.data)
      setLoading(false)
    } catch (error) {
      console.error('Verification load error:', error)
      setData({ error: 'Failed to load verification data' })
      setLoading(false)
    }
  }

  async function handleVerifyHorse(isCorrect: boolean, corrections?: any) {
    setLoading(true)
    try {
      const response = await fetch('/api/verify/horse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, isCorrect, corrections })
      })

      const result = await response.json()
      if (result.success) {
        setHorseVerified(true)
        setStep('business')
      }
    } catch (error) {
      console.error('Horse verification error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleBusinessResponse(ownsBusinessresponse: boolean, businessInfo?: any) {
    setIsBusinessOwner(ownsBusinessresponse)
    setLoading(true)

    try {
      if (ownsBusinessresponse && businessInfo) {
        await fetch('/api/verify/business-owner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, businessInfo })
        })
      }

      setStep('subscribe')
    } catch (error) {
      console.error('Business response error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubscribe(tier: 'free' | 'basic' | 'pro') {
    setLoading(true)
    try {
      if (tier !== 'free') {
        // Redirect to checkout
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier, token })
        })
        const { url } = await response.json()
        window.location.href = url
      } else {
        // Mark as complete
        setStep('complete')
      }
    } catch (error) {
      console.error('Subscribe error:', error)
      setLoading(false)
    }
  }

  return (
    <VerifyView
      loading={loading}
      step={step}
      data={data}
      horseVerified={horseVerified}
      isBusinessOwner={isBusinessOwner}
      onVerifyHorse={handleVerifyHorse}
      onBusinessResponse={handleBusinessResponse}
      onSubscribe={handleSubscribe}
    />
  )
}


