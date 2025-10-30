import { useState } from 'react'

interface HorseSearchParams {
  name?: string
  registrationNumber?: string
  sire?: string
  dam?: string
  breed?: string
  foalYear?: number
}

interface HorseData {name: string
  registrationNumber?: string
  sire?: string
  dam?: string
  breed?: string
  foalYear?: number
  color?: string
  gender?: string
  owner?: string
  breeder?: string
  pedigree?: {sire: string
    dam: string
    maternalGrandsire?: string
    paternalGrandsire?: string
  }
  performance?: {
    earnings?: number
    starts?: number
    wins?: number
    places?: number
    shows?: number
  }
  breeding?: {
    offspring?: number
    stakesWinners?: number
    studFee?: number
  }
}

interface HorseSearchResponse {success: boolean
  horseData: HorseData
  sources: string[]
  error?: string
}

export function useHorseDatabase() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<HorseData | null>(null)

  const searchHorse = async (params: HorseSearchParams): Promise<HorseSearchResponse | null> => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/horse-database/search', {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Search failed')
        return data
      }

      setResults(data.horseData)
      return data

    } catch (err) {
      const errorMessage = 'Network error during horse search'
      setError(errorMessage)
      return { success: false, error: errorMessage, horseData: {} as HorseData, sources: [] }
    } finally {
      setLoading(false)
    }
  }

  const searchByName = async (name: string) => {
    return searchHorse({ name })
  }

  const searchByRegistration = async (registrationNumber: string) => {
    return searchHorse({ registrationNumber })
  }

  const searchByPedigree = async (sire: string, dam: string) => {
    return searchHorse({ sire, dam })
  }

  return {
    searchHorse,
    searchByName,
    searchByRegistration,
    searchByPedigree,
    loading,
    error,
    results,
    clearError: () => setError(null),
    clearResults: () => setResults(null)
  }
}


