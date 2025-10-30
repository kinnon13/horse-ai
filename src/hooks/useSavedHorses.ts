'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

export interface SavedHorse {id: string
  name: string
  type: 'mare' | 'stud' | 'gelding' | 'colt' | 'filly'
  year?: number
  breed?: string
  notes?: string
  user_id: string
  created_at: string
}

export function useSavedHorses() {
  const { user } = useAuth()
  const [horses, setHorses] = useState<SavedHorse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved horses
  const loadHorses = async () => {
    if (!user) {
      setHorses([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('saved_horses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setHorses(data || [])
      }
    } catch (err) {
      setError('Failed to load horses')
    } finally {
      setLoading(false)
    }
  }

  // Save a new horse
  const saveHorse = async (horseData: Omit<SavedHorse, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      setError('You must be logged in to save horses')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('saved_horses')
        .insert({
          ...horseData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        setError(error.message)
        return false
      }

      setHorses(prev => [data, ...prev])
      return true
    } catch (err) {
      setError('Failed to save horse')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete a horse
  const deleteHorse = async (horseId: string) => {
    if (!user) return false

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('saved_horses')
        .delete()
        .eq('id', horseId)
        .eq('user_id', user.id)

      if (error) {
        setError(error.message)
        return false
      }

      setHorses(prev => prev.filter(horse => horse.id !== horseId))
      return true
    } catch (err) {
      setError('Failed to delete horse')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update a horse
  const updateHorse = async (horseId: string, updates: Partial<SavedHorse>) => {
    if (!user) return false

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('saved_horses')
        .update(updates)
        .eq('id', horseId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        setError(error.message)
        return false
      }

      setHorses(prev => prev.map(horse => horse.id === horseId ? data : horse))
      return true
    } catch (err) {
      setError('Failed to update horse')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Load horses on mount and when user changes
  useEffect(() => {
    loadHorses()
  }, [user])

  return {
    horses,
    loading,
    error,
    saveHorse,
    deleteHorse,
    updateHorse,
    loadHorses
  }
}
