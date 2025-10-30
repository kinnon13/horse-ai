import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

interface Alert {id: string
  user_id: string
  topic: string
  description: string | null
  has_update: boolean
  created_at: string
}

export function useAlerts() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAlerts()
    } else {
      setAlerts([])
      setLoading(false)
    }
  }, [user])

  const fetchAlerts = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching alerts:', error)
        setAlerts([])
      } else {
        setAlerts(data || [])
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }

  const createAlert = async (topic: string, description?: string) => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert({user_id: user.id,
          topic,
          description: description || null,
          has_update: false
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating alert:', error)
        return false
      }

      setAlerts(prev => [data, ...prev])
      return true
    } catch (error) {
      console.error('Error creating alert:', error)
      return false
    }
  }

  const markAsRead = async (alertId: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('alerts')
        .update({ has_update: false })
        .eq('id', alertId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error marking alert as read:', error)
        return false
      }

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, has_update: false } : alert
      ))
      return true
    } catch (error) {
      console.error('Error marking alert as read:', error)
      return false
    }
  }

  return { alerts, loading, createAlert, markAsRead, refetch: fetchAlerts }
}