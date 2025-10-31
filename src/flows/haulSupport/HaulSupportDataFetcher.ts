// HaulSupportDataFetcher.ts (30 lines) - Single responsibility: Data fetching
import { supabase } from '@/lib/supabase'
import { HaulSupportIntent } from './HaulSupportParser'
import { HaulSupportValidator } from './HaulSupportValidator'

export class HaulSupportDataFetcher {
  static async getHaulSupportPoints(intent: HaulSupportIntent) {
    const { data: points, error } = await supabase
      .from('haul_support_points')
      .select('*')
      .eq('verified', true)
      .eq('active', true)
      .order('distance_from_route', { ascending: true })
      .limit(10)

    if (error) throw new Error(`Failed to fetch haul support points: ${error.message}`)
    
    const validatedPoints = await HaulSupportValidator.validatePoints(points || [])
    return validatedPoints
  }

  static async getRouteInfo(origin: string, destination: string) {
    // TODO: Implement route calculation
    return {
      distance: 0,
      estimatedTime: 0,
      route: []
    }
  }
}