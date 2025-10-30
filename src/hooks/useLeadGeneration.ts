import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'

interface LeadCriteria {
  serviceType?: string
  location?: string
  budget?: number
  breed?: string
  age?: number
  gender?: string
  experience?: string
  discipline?: string
}

interface LeadRequest {id: string
  user_id: string
  type: string
  criteria: LeadCriteria
  message?: string
  matches_found: number
  status: string
  created_at: string
}

interface Lead {id: string
  name?: string
  email?: string
  phone?: string
  location?: string
  service_type?: string
  description?: string
  price?: number
  rating?: number
  user?: {id: string
    email: string
    name?: string
  }
}

interface LeadResponse {success: boolean
  leads: Lead[]
  leadRequest: LeadRequest
  type: string
  error?: string
  upgradeRequired?: boolean
}

export function useLeadGeneration() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadRequests, setLeadRequests] = useState<LeadRequest[]>([])

  const generateLeads = async (type: string, criteria: LeadCriteria, message?: string): Promise<LeadResponse | null> => {
    if (!user) {
      setError('You must be logged in to generate leads')
      return null
    }

    setLoading(true)
    setError(null)
    setLeads([])

    try {
      const response = await fetch('/api/lead-generation', {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          user_id: user.id,
          criteria,
          message
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.upgradeRequired) {
          setError('Lead generation requires Plus tier subscription')
        } else {
          setError(data.error || 'Lead generation failed')
        }
        return data
      }

      setLeads(data.leads)
      return data

    } catch (err) {
      const errorMessage = 'Network error during lead generation'
      setError(errorMessage)
      return { success: false, error: errorMessage, leads: [], leadRequest: {} as LeadRequest, type }
    } finally {
      setLoading(false)
    }
  }

  const fetchLeadRequests = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/lead-generation?user_id=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setLeadRequests(data.leadRequests)
      }
    } catch (err) {
      console.error('Failed to fetch lead requests:', err)
    }
  }

  const findBuyers = async (criteria: LeadCriteria, message?: string) => {
    return generateLeads('buyer', criteria, message)
  }

  const findSellers = async (criteria: LeadCriteria, message?: string) => {
    return generateLeads('seller', criteria, message)
  }

  const findBreedingOpportunities = async (criteria: LeadCriteria, message?: string) => {
    return generateLeads('breeder', criteria, message)
  }

  const findServiceProviders = async (criteria: LeadCriteria, message?: string) => {
    return generateLeads('service', criteria, message)
  }

  return {
    generateLeads,
    findBuyers,
    findSellers,
    findBreedingOpportunities,
    findServiceProviders,
    fetchLeadRequests,
    loading,
    error,
    leads,
    leadRequests,
    clearError: () => setError(null),
    clearLeads: () => setLeads([])
  }
}


