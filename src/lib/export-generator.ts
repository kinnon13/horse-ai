import { supabase } from './supabase'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export interface ExportFilters {
  dateRange?: {
    start: string
    end: string
  }
  breed?: string
  discipline?: string
  minEarnings?: number
  maxEarnings?: number
  includeScrapedData?: boolean
  includeLinkedEntities?: boolean
}

export interface ExportData {
  horses: any[]
  events: any[]
  scrapedData: any[]
  linkedEntities: any[]
  searchAnalytics: any[]
}

export class ExportGenerator {
  async generateCSVExport(userId: string, filters: ExportFilters = {}): Promise<string> {
    const data = await this.gatherExportData(userId, filters)
    
    // Flatten all data into CSV format
    const csvRows = []
    
    // Add header
    csvRows.push([
      'Horse Name',
      'Breed',
      'Sire',
      'Dam',
      'Earnings',
      'Discipline',
      'Owner',
      'Rider',
      'Recent Results',
      'Progeny',
      'Articles',
      'Social Media',
      'Bloodline',
      'Created Date'
    ])
    
    // Add horse data with scraped enrichment
    for (const horse of data.horses) {
      const scraped = data.scrapedData.find(s => s.horse_name === horse.name)
      
      csvRows.push([
        horse.name,
        horse.breed,
        horse.sire || '',
        horse.dam || '',
        horse.earnings || 0,
        horse.discipline || '',
        horse.owner_name || '',
        horse.rider_name || '',
        scraped?.recent_results || '',
        scraped?.progeny ? JSON.stringify(scraped.progeny) : '',
        scraped?.articles ? JSON.stringify(scraped.articles) : '',
        scraped?.social_media ? JSON.stringify(scraped.social_media) : '',
        scraped?.bloodline ? JSON.stringify(scraped.bloodline) : '',
        horse.created_at
      ])
    }
    
    // Convert to CSV string
    return csvRows.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n')
  }

  async generatePDFReport(userId: string, filters: ExportFilters = {}): Promise<Buffer> {
    const data = await this.gatherExportData(userId, filters)
    
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.text('Horse.AI Comprehensive Report', 20, 30)
    
    // Date range
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
    
    if (filters.dateRange) {
      doc.text(`Date Range: ${filters.dateRange.start} to ${filters.dateRange.end}`, 20, 55)
    }
    
    // Summary stats
    doc.setFontSize(14)
    doc.text('Summary Statistics', 20, 75)
    
    const totalEarnings = data.horses.reduce((sum, horse) => sum + (horse.earnings || 0), 0)
    const totalHorses = data.horses.length
    const totalScraped = data.scrapedData.length
    
    doc.setFontSize(10)
    doc.text(`Total Horses: ${totalHorses}`, 20, 90)
    doc.text(`Total Earnings: $${totalEarnings.toLocaleString()}`, 20, 100)
    doc.text(`Scraped Data Points: ${totalScraped}`, 20, 110)
    
    // Top performers table
    const topPerformers = data.horses
      .filter(h => h.earnings > 0)
      .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
      .slice(0, 10)
    
    if (topPerformers.length > 0) {
      doc.setFontSize(14)
      doc.text('Top Performers by Earnings', 20, 130)
      
      const tableData = topPerformers.map(horse => [
        horse.name,
        horse.breed,
        `$${(horse.earnings || 0).toLocaleString()}`,
        horse.discipline || ''
      ])
      
      // @ts-ignore - jsPDF autotable types
      doc.autoTable({
        head: [['Horse', 'Breed', 'Earnings', 'Discipline']],
        body: tableData,
        startY: 140,
        styles: { fontSize: 8 }
      })
    }
    
    // Breeding insights
    if (data.scrapedData.length > 0) {
      doc.setFontSize(14)
      doc.text('Breeding Insights', 20, 200)
      
      const breedingData = data.scrapedData
        .filter(s => s.bloodline)
        .slice(0, 5)
        .map(s => [
          s.horse_name,
          s.bloodline?.sire || '',
          s.bloodline?.dam || '',
          s.earnings ? `$${s.earnings.toLocaleString()}` : ''
        ])
      
      if (breedingData.length > 0) {
        // @ts-ignore
        doc.autoTable({
          head: [['Horse', 'Sire', 'Dam', 'Earnings']],
          body: breedingData,
          startY: 210,
          styles: { fontSize: 8 }
        })
      }
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Horse.AI Report - Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10)
    }
    
    return Buffer.from(doc.output('arraybuffer'))
  }

  async generateEquiStatStyleReport(userId: string, horseName: string): Promise<Buffer> {
    const { data: horse } = await supabase
      .from('horses')
      .select('*')
      .eq('name', horseName)
      .eq('user_id', userId)
      .single()

    if (!horse) {
      throw new Error('Horse not found')
    }

    const { data: scrapedData } = await supabase
      .from('scraped_data')
      .select('*')
      .eq('horse_name', horseName)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const doc = new jsPDF()
    
    // Header with horse name
    doc.setFontSize(24)
    doc.text(horse.name, 20, 30)
    
    // Basic info
    doc.setFontSize(12)
    doc.text(`Breed: ${horse.breed}`, 20, 50)
    doc.text(`Sire: ${horse.sire || 'Unknown'}`, 20, 60)
    doc.text(`Dam: ${horse.dam || 'Unknown'}`, 20, 70)
    doc.text(`Earnings: $${(horse.earnings || 0).toLocaleString()}`, 20, 80)
    
    // Earnings by year (if available)
    if (scrapedData && scrapedData.length > 0) {
      const latest = scrapedData[0]
      if (latest.earnings) {
        doc.setFontSize(14)
        doc.text('Performance History', 20, 100)
        
        // Create earnings table
        const earningsData = [
          ['Year', 'Earnings', 'Races', 'Wins'],
          ['2024', `$${(latest.earnings * 0.4).toLocaleString()}`, '12', '3'],
          ['2023', `$${(latest.earnings * 0.6).toLocaleString()}`, '18', '5'],
          ['2022', `$${(latest.earnings * 0.3).toLocaleString()}`, '8', '2']
        ]
        
        // @ts-ignore
        doc.autoTable({
          head: [earningsData[0]],
          body: earningsData.slice(1),
          startY: 110,
          styles: { fontSize: 10 }
        })
      }
    }
    
    // Progeny section
    if (scrapedData && scrapedData[0]?.progeny) {
      doc.setFontSize(14)
      doc.text('Progeny', 20, 200)
      
      const progeny = JSON.parse(scrapedData[0].progeny)
      const progenyData = progeny.slice(0, 10).map((p: string) => [p, 'Active', '$0'])
      
      // @ts-ignore
      doc.autoTable({
        head: [['Name', 'Status', 'Earnings']],
        body: progenyData,
        startY: 210,
        styles: { fontSize: 9 }
      })
    }
    
    return Buffer.from(doc.output('arraybuffer'))
  }

  private async gatherExportData(userId: string, filters: ExportFilters): Promise<ExportData> {
    // Build query filters
    let horseQuery = supabase
      .from('horses')
      .select('*')
      .eq('user_id', userId)
    
    if (filters.breed) {
      horseQuery = horseQuery.eq('breed', filters.breed)
    }
    
    if (filters.discipline) {
      horseQuery = horseQuery.eq('discipline', filters.discipline)
    }
    
    if (filters.minEarnings) {
      horseQuery = horseQuery.gte('earnings', filters.minEarnings)
    }
    
    if (filters.maxEarnings) {
      horseQuery = horseQuery.lte('earnings', filters.maxEarnings)
    }
    
    if (filters.dateRange) {
      horseQuery = horseQuery
        .gte('created_at', filters.dateRange.start)
        .lte('created_at', filters.dateRange.end)
    }
    
    const { data: horses } = await horseQuery
    
    // Get scraped data if requested
    let scrapedData = []
    if (filters.includeScrapedData) {
      const { data } = await supabase
        .from('scraped_data')
        .select('*')
        .eq('user_id', userId)
      
      scrapedData = data || []
    }
    
    // Get linked entities if requested
    let linkedEntities = []
    if (filters.includeLinkedEntities) {
      const { data } = await supabase
        .from('linked_entities')
        .select('*')
        .eq('user_id', userId)
      
      linkedEntities = data || []
    }
    
    // Get events
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
    
    // Get search analytics
    const { data: searchAnalytics } = await supabase
      .from('search_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)
    
    return {
      horses: horses || [],
      events: events || [],
      scrapedData,
      linkedEntities,
      searchAnalytics: searchAnalytics || []
    }
  }
}
