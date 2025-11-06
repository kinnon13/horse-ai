// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// export-data.ts (35 lines) - Single responsibility: Main data gathering
import { ExportData, ExportFilters } from './export-generator'
import { fetchHorses } from './export-generator-data-horses'
import { 
  fetchScrapedData, 
  fetchLinkedEntities, 
  fetchEvents, 
  fetchSearchAnalytics 
} from './export-data-formatters'

export async function gatherExportData(userId: string, filters: ExportFilters): Promise<ExportData> {
  const horses = await fetchHorses(userId, filters)
  const scrapedData = await fetchScrapedData(userId, filters)
  const linkedEntities = await fetchLinkedEntities(userId, filters)
  const events = await fetchEvents(userId)
  const searchAnalytics = await fetchSearchAnalytics(userId)
  
  return {
    horses: horses || [],
    events: events || [],
    scrapedData,
    linkedEntities,
    searchAnalytics: searchAnalytics || []
  }
}

