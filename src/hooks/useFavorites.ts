'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

export interface Favorite {id: string
  topic: string
  description?: string
  has_update: boolean
  user_id: string
  created_at: string
}

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load favorites
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setFavorites(data || [])
      }
    } catch (err) {
      setError('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  // Add a new favorite
  const addFavorite = async (topic: string, description?: string) => {
    if (!user) {
      setError('You must be logged in to create favorites')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          topic,
          description,
          has_update: false,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        setError(error.message)
        return false
      }

      setFavorites(prev => [data, ...prev])
      return true
    } catch (err) {
      setError('Failed to add favorite')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Remove a favorite
  const removeFavorite = async (favoriteId: string) => {
    if (!user) return false

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user.id)

      if (error) {
        setError(error.message)
        return false
      }

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
      return true
    } catch (err) {
      setError('Failed to remove favorite')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Mark favorite as read (remove update badge)
  const markAsRead = async (favoriteId: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('favorites')
        .update({ has_update: false })
        .eq('id', favoriteId)
        .eq('user_id', user.id)

      if (error) {
        setError(error.message)
        return false
      }

      setFavorites(prev => prev.map(fav => 
        fav.id === favoriteId ? { ...fav, has_update: false } : fav
      ))
      return true
    } catch (err) {
      setError('Failed to mark as read')
      return false
    }
  }

  // Check if topic is already favorited
  const isFavorited = (topic: string): boolean => {
    return favorites.some(fav => fav.topic.toLowerCase() === topic.toLowerCase())
  }

  // Get favorites with updates
  const getFavoritesWithUpdates = (): Favorite[] => {
    return favorites.filter(fav => fav.has_update)
  }

  // Load favorites on mount and when user changes
  useEffect(() => {
    loadFavorites()
  }, [user])

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    markAsRead,
    isFavorited,
    getFavoritesWithUpdates,
    loadFavorites
  }
}
