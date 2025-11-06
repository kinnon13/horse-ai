'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ClaimView } from './ClaimView'

export default function ClaimPage() {
  const params = useParams()
  const router = useRouter()
  const entityId = params.entityId as string

  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState<any>(null)
  const [step, setStep] = useState<'view' | 'verify' | 'submit' | 'complete'>('view')
  const [claimData, setClaimData] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    proof: ''
  })

  useEffect(() => {
    loadEntity()
  }, [entityId])

  async function loadEntity() {
    try {
      const response = await fetch(`/api/entity/claim/${entityId}`)
      const data = await response.json()

      if (data.error) {
        setEntity({ error: data.error })
      } else {
        setEntity(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Entity load error:', error)
      setEntity({ error: 'Failed to load entity' })
      setLoading(false)
    }
  }

  async function handleStartClaim() {
    setStep('verify')
  }

  async function handleSubmitClaim() {
    setLoading(true)
    try {
      const response = await fetch('/api/entity/claim/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          entityType: entity.type,
          ...claimData
        })
      })

      const result = await response.json()
      if (result.success) {
        setStep('complete')
      }
    } catch (error) {
      console.error('Claim submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ClaimView
      loading={loading}
      step={step}
      entity={entity}
      claimData={claimData}
      setClaimData={setClaimData}
      onStartClaim={handleStartClaim}
      onSubmitClaim={handleSubmitClaim}
    />
  )
}


