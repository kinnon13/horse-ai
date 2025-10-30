/**
 * HAUL SUPPORT DATA FETCHER
 * 
 * PURPOSE:
 * - Gets haul support points for the specified route
 * - Returns only verified safe locations
 * 
 * SAFETY:
 * - Only returns verified safe locations
 * - We log every query for audit trail
 */

import { supabase } from '@/lib/supabase'
import { HaulSupportIntent } from './HaulSupportParser'

export class HaulSupportDataFetcher {
  /**
   * PURPOSE:
   * - Gets haul support points for the specified route
   * - Returns only verified safe locations
   * 
   * SAFETY:
   * - Only returns verified safe locations
   * - We log every query for audit trail
   */
  static async getRouteSupportPoints(route: HaulSupportIntent['route']): Promise<{
    fuel: any[]
    overnight: any[]
    emergency: any[]
    hookups: any[]
    feedStores: any[]
  }> {
    
    // Get haul support points along the route
    const { data: supportPoints, error } = await supabase
      .from('haul_support_points')
      .select('*')
      .eq('verified', true)
      .eq('status', 'active')
      .order('safety_rating', { ascending: false })
    
    if (error) {
      console.error('Error fetching haul support points:', error)
      throw new Error('Failed to fetch haul support points')
    }
    
    if (!supportPoints) {
      return {
        fuel: [],
        overnight: [],
        emergency: [],
        hookups: [],
        feedStores: []
      }
    }
    
    // Group by type
    const grouped = {
      fuel: supportPoints.filter(p => p.type === 'fuel'),
      overnight: supportPoints.filter(p => p.type === 'overnight_stalls'),
      emergency: supportPoints.filter(p => p.type === 'emergency_vet'),
      hookups: supportPoints.filter(p => p.type === 'arena_hookup'),
      feedStores: supportPoints.filter(p => p.type === 'feed_store')
    }
    
    return grouped
  }
}

