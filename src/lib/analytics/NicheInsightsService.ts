import { supabase } from '../supabase'
import { GrokAPI } from '../grok'
import { NicheInsights } from './types'
import { SearchAnalyticsService } from './SearchAnalyticsService'

export class NicheInsightsService {
  private searchService: SearchAnalyticsService
  private grok: GrokAPI

  constructor() {
    this.searchService = new SearchAnalyticsService()
    this.grok = new GrokAPI()
  }

  async getNicheInsights(niche: string, userId?: string): Promise<NicheInsights> {
    try {
      const trendingSearches = await this.searchService.getTrendingSearches(niche)
      
      const [popularHorses, topOwners, topRiders, earningsTrends, breedingInsights] = await Promise.all([this.getPopularHorses(niche),
        this.getTopOwners(niche),
        this.getTopRiders(niche),
        this.getEarningsTrends(niche),
        this.getBreedingInsights(niche)])

      return {
        niche,
        trendingSearches,
        popularHorses,
        topOwners,
        topRiders,
        earningsTrends,
        breedingInsights
      }
    } catch (error) {
      console.error('Failed to get niche insights:', error)
      return this.getDefaultInsights(niche)
    }
  }

  private async getPopularHorses(niche: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('horse_profiles')
        .select('horse_name')
        .eq('niche', niche)
        .order('popularity_score', { ascending: false })
        .limit(10)

      if (error) throw error
      return data?.map(h => h.horse_name) || []
    } catch (error) {
      console.error('Failed to get popular horses:', error)
      return []
    }
  }

  private async getTopOwners(niche: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('horse_profiles')
        .select('owner_name')
        .eq('niche', niche)
        .not('owner_name', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      return data?.map(h => h.owner_name).filter(Boolean) || []
    } catch (error) {
      console.error('Failed to get top owners:', error)
      return []
    }
  }

  private async getTopRiders(niche: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('athlete_profiles')
        .select('athlete_name')
        .eq('primary_niche', niche)
        .order('earnings', { ascending: false })
        .limit(10)

      if (error) throw error
      return data?.map(a => a.athlete_name) || []
    } catch (error) {
      console.error('Failed to get top riders:', error)
      return []
    }
  }

  private async getEarningsTrends(niche: string) {
    try {
      const { data, error } = await supabase
        .from('earnings_data')
        .select('year, total_earnings, average_earnings')
        .eq('niche', niche)
        .order('year', { ascending: false })
        .limit(5)

      if (error) throw error
      return data?.map(item => ({year: item.year,
        total: item.total_earnings,
        average: item.average_earnings
      })) || []
    } catch (error) {
      console.error('Failed to get earnings trends:', error)
      return []
    }
  }

  private async getBreedingInsights(niche: string) {
    try {
      const [topSires, topDams, successfulCrosses] = await Promise.all([this.getTopSires(niche),
        this.getTopDams(niche),
        this.getSuccessfulCrosses(niche)])

      return {
        topSires,
        topDams,
        successfulCrosses
      }
    } catch (error) {
      console.error('Failed to get breeding insights:', error)
      return {topSires: [],
        topDams: [],
        successfulCrosses: []
      }
    }
  }

  private async getTopSires(niche: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('breeding_data')
        .select('sire_name')
        .eq('niche', niche)
        .not('sire_name', 'is', null)
        .order('offspring_count', { ascending: false })
        .limit(5)

      if (error) throw error
      return data?.map(b => b.sire_name).filter(Boolean) || []
    } catch (error) {
      console.error('Failed to get top sires:', error)
      return []
    }
  }

  private async getTopDams(niche: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('breeding_data')
        .select('dam_name')
        .eq('niche', niche)
        .not('dam_name', 'is', null)
        .order('offspring_count', { ascending: false })
        .limit(5)

      if (error) throw error
      return data?.map(b => b.dam_name).filter(Boolean) || []
    } catch (error) {
      console.error('Failed to get top dams:', error)
      return []
    }
  }

  private async getSuccessfulCrosses(niche: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('breeding_data')
        .select('sire_name, dam_name')
        .eq('niche', niche)
        .gte('success_rate', 0.8)
        .order('success_rate', { ascending: false })
        .limit(5)

      if (error) throw error
      return data?.map(b => `${b.sire_name} x ${b.dam_name}`).filter(Boolean) || []
    } catch (error) {
      console.error('Failed to get successful crosses:', error)
      return []
    }
  }

  private getDefaultInsights(niche: string): NicheInsights {
    return {
      niche,
      trendingSearches: [],
      popularHorses: [],
      topOwners: [],
      topRiders: [],
      earningsTrends: [],
      breedingInsights: {topSires: [],
        topDams: [],
        successfulCrosses: []
      }
    }
  }
}

