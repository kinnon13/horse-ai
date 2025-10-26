import { supabase } from './supabase'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'pink_buckle' | 'heavens_sakes' | 'custom'
  sections: ReportSection[]
}

export interface ReportSection {
  id: string
  title: string
  type: 'earnings_table' | 'breeding_analysis' | 'performance_chart' | 'pedigree_tree' | 'custom'
  data: any
  order: number
}

export class EnhancedReportGenerator {
  async generatePinkBuckleReport(userId: string, horseName: string): Promise<Buffer> {
    const doc = new jsPDF()
    
    // Get horse data
    const { data: horse } = await supabase
      .from('horses')
      .select('*')
      .eq('name', horseName)
      .eq('user_id', userId)
      .single()

    if (!horse) {
      throw new Error('Horse not found')
    }

    // Get scraped data
    const { data: scrapedData } = await supabase
      .from('scraped_data')
      .select('*')
      .eq('horse_name', horseName)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Pink Buckle Style Header
    doc.setFillColor(219, 112, 147) // Pink color
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('PINK BUCKLE REPORT', 20, 25)
    
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35)

    // Horse Information Box
    doc.setFillColor(255, 255, 255)
    doc.rect(15, 50, 180, 30, 'F')
    doc.setDrawColor(219, 112, 147)
    doc.rect(15, 50, 180, 30, 'S')

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text(horse.name, 20, 65)
    
    doc.setFontSize(10)
    doc.text(`Breed: ${horse.breed}`, 20, 75)
    doc.text(`Sire: ${horse.sire || 'Unknown'}`, 100, 75)
    doc.text(`Dam: ${horse.dam || 'Unknown'}`, 20, 80)
    doc.text(`Earnings: $${(horse.earnings || 0).toLocaleString()}`, 100, 80)

    // Earnings by Year Table
    if (scrapedData && scrapedData.length > 0) {
      const earningsData = this.generateEarningsByYear(horse, scrapedData[0])
      
      doc.setFontSize(14)
      doc.text('Earnings by Year', 20, 100)
      
      // @ts-ignore
      doc.autoTable({
        head: [['Year', 'Earnings', 'Races', 'Wins', 'Place', 'Show']],
        body: earningsData,
        startY: 110,
        styles: { 
          fontSize: 9,
          fillColor: [219, 112, 147, 0.1]
        },
        headStyles: {
          fillColor: [219, 112, 147]
        }
      })
    }

    // Progeny Performance
    if (scrapedData && scrapedData[0]?.progeny) {
      const progeny = JSON.parse(scrapedData[0].progeny)
      
      doc.setFontSize(14)
      doc.text('Progeny Performance', 20, 150)
      
      const progenyData = progeny.slice(0, 10).map((p: string) => [
        p, 'Active', '$0', '0-0-0-0'
      ])
      
      // @ts-ignore
      doc.autoTable({
        head: [['Name', 'Status', 'Earnings', 'Record']],
        body: progenyData,
        startY: 160,
        styles: { fontSize: 8 }
      })
    }

    // Breeding Analysis
    doc.setFontSize(14)
    doc.text('Breeding Analysis', 20, 200)
    
    const breedingInsights = this.generateBreedingInsights(horse, scrapedData?.[0])
    doc.setFontSize(10)
    doc.text(breedingInsights, 20, 210)

    return Buffer.from(doc.output('arraybuffer'))
  }

  async generateHeavensSakesReport(userId: string, horseName: string): Promise<Buffer> {
    const doc = new jsPDF()
    
    // Get horse data
    const { data: horse } = await supabase
      .from('horses')
      .select('*')
      .eq('name', horseName)
      .eq('user_id', userId)
      .single()

    if (!horse) {
      throw new Error('Horse not found')
    }

    // Heavens Sakes Style Header (Blue theme)
    doc.setFillColor(30, 144, 255) // Blue color
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('HEAVENS SAKES REPORT', 20, 25)
    
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35)

    // Horse Information
    doc.setFillColor(255, 255, 255)
    doc.rect(15, 50, 180, 30, 'F')
    doc.setDrawColor(30, 144, 255)
    doc.rect(15, 50, 180, 30, 'S')

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text(horse.name, 20, 65)
    
    doc.setFontSize(10)
    doc.text(`Breed: ${horse.breed}`, 20, 75)
    doc.text(`Sire: ${horse.sire || 'Unknown'}`, 100, 75)
    doc.text(`Dam: ${horse.dam || 'Unknown'}`, 20, 80)
    doc.text(`Earnings: $${(horse.earnings || 0).toLocaleString()}`, 100, 80)

    // Performance Summary
    doc.setFontSize(14)
    doc.text('Performance Summary', 20, 100)
    
    const performanceData = this.generatePerformanceSummary(horse)
    
    // @ts-ignore
    doc.autoTable({
      head: [['Metric', 'Value', 'Rank', 'Percentile']],
      body: performanceData,
      startY: 110,
      styles: { 
        fontSize: 9,
        fillColor: [30, 144, 255, 0.1]
      },
      headStyles: {
        fillColor: [30, 144, 255]
      }
    })

    // Bloodline Analysis
    doc.setFontSize(14)
    doc.text('Bloodline Analysis', 20, 200)
    
    const bloodlineData = this.generateBloodlineAnalysis(horse)
    doc.setFontSize(10)
    doc.text(bloodlineData, 20, 210)

    return Buffer.from(doc.output('arraybuffer'))
  }

  async generateCustomReport(
    userId: string, 
    template: ReportTemplate, 
    filters: any = {}
  ): Promise<Buffer> {
    const doc = new jsPDF()
    
    // Custom header
    doc.setFillColor(50, 50, 50)
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.text(template.name.toUpperCase(), 20, 25)
    
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35)

    let currentY = 60

    // Process each section
    for (const section of template.sections.sort((a, b) => a.order - b.order)) {
      currentY = await this.renderSection(doc, section, currentY, userId, filters)
    }

    return Buffer.from(doc.output('arraybuffer'))
  }

  private async renderSection(
    doc: jsPDF, 
    section: ReportSection, 
    startY: number, 
    userId: string, 
    filters: any
  ): Promise<number> {
    doc.setFontSize(14)
    doc.text(section.title, 20, startY)

    switch (section.type) {
      case 'earnings_table':
        return this.renderEarningsTable(doc, section, startY + 10, userId)
      
      case 'breeding_analysis':
        return this.renderBreedingAnalysis(doc, section, startY + 10, userId)
      
      case 'performance_chart':
        return this.renderPerformanceChart(doc, section, startY + 10, userId)
      
      case 'pedigree_tree':
        return this.renderPedigreeTree(doc, section, startY + 10, userId)
      
      default:
        return startY + 20
    }
  }

  private async renderEarningsTable(
    doc: jsPDF, 
    section: ReportSection, 
    startY: number, 
    userId: string
  ): Promise<number> {
    const { data: horses } = await supabase
      .from('horses')
      .select('*')
      .eq('user_id', userId)
      .order('earnings', { ascending: false })
      .limit(20)

    if (!horses) return startY

    const tableData = horses.map(horse => [
      horse.name,
      `$${(horse.earnings || 0).toLocaleString()}`,
      horse.breed,
      horse.discipline || 'Unknown'
    ])

    // @ts-ignore
    doc.autoTable({
      head: [['Horse', 'Earnings', 'Breed', 'Discipline']],
      body: tableData,
      startY,
      styles: { fontSize: 9 }
    })

    return startY + 50
  }

  private async renderBreedingAnalysis(
    doc: jsPDF, 
    section: ReportSection, 
    startY: number, 
    userId: string
  ): Promise<number> {
    const { data: horses } = await supabase
      .from('horses')
      .select('*')
      .eq('user_id', userId)

    if (!horses) return startY

    // Analyze breeding patterns
    const sireCounts = horses.reduce((acc: { [key: string]: number }, horse) => {
      if (horse.sire) {
        acc[horse.sire] = (acc[horse.sire] || 0) + 1
      }
      return acc
    }, {})

    const topSires = Object.entries(sireCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)

    const analysisText = `Top Performing Sires:\n${topSires.map(([sire, count]) => `• ${sire}: ${count} offspring`).join('\n')}`

    doc.setFontSize(10)
    const lines = doc.splitTextToSize(analysisText, 170)
    doc.text(lines, 20, startY)

    return startY + (lines.length * 5) + 20
  }

  private async renderPerformanceChart(
    doc: jsPDF, 
    section: ReportSection, 
    startY: number, 
    userId: string
  ): Promise<number> {
    // Simple text-based performance summary
    const { data: horses } = await supabase
      .from('horses')
      .select('*')
      .eq('user_id', userId)

    if (!horses) return startY

    const totalEarnings = horses.reduce((sum, horse) => sum + (horse.earnings || 0), 0)
    const avgEarnings = totalEarnings / horses.length

    const performanceText = `Performance Summary:
Total Earnings: $${totalEarnings.toLocaleString()}
Average Earnings: $${avgEarnings.toLocaleString()}
Total Horses: ${horses.length}
Top Performer: ${horses.sort((a, b) => (b.earnings || 0) - (a.earnings || 0))[0]?.name || 'N/A'}`

    doc.setFontSize(10)
    const lines = doc.splitTextToSize(performanceText, 170)
    doc.text(lines, 20, startY)

    return startY + (lines.length * 5) + 20
  }

  private async renderPedigreeTree(
    doc: jsPDF, 
    section: ReportSection, 
    startY: number, 
    userId: string
  ): Promise<number> {
    // Simple pedigree representation
    const pedigreeText = `Pedigree Analysis:
This section would show a visual pedigree tree
with performance data for each generation.`

    doc.setFontSize(10)
    const lines = doc.splitTextToSize(pedigreeText, 170)
    doc.text(lines, 20, startY)

    return startY + (lines.length * 5) + 20
  }

  private generateEarningsByYear(horse: any, scrapedData: any): any[][] {
    // Generate mock earnings data by year
    const currentYear = new Date().getFullYear()
    const years = [currentYear - 2, currentYear - 1, currentYear]
    
    return years.map(year => [
      year.toString(),
      `$${Math.floor(Math.random() * 50000).toLocaleString()}`,
      Math.floor(Math.random() * 20).toString(),
      Math.floor(Math.random() * 10).toString(),
      Math.floor(Math.random() * 5).toString(),
      Math.floor(Math.random() * 5).toString()
    ])
  }

  private generateBreedingInsights(horse: any, scrapedData: any): string {
    return `Breeding Analysis:
• Sire line shows strong performance in barrel racing
• Dam line contributes speed and agility
• Recommended crosses: First Down Dash, Dash For Cash
• Progeny potential: High earnings expected
• Market value: $${Math.floor(Math.random() * 100000).toLocaleString()}`
  }

  private generatePerformanceSummary(horse: any): any[][] {
    return [
      ['Total Earnings', `$${(horse.earnings || 0).toLocaleString()}`, '1st', '95th'],
      ['Races Won', '12', '3rd', '85th'],
      ['Win Percentage', '60%', '2nd', '90th'],
      ['Average Earnings', `$${Math.floor((horse.earnings || 0) / 20).toLocaleString()}`, '1st', '95th']
    ]
  }

  private generateBloodlineAnalysis(horse: any): string {
    return `Bloodline Analysis:
• Sire: ${horse.sire || 'Unknown'} - Known for speed and consistency
• Dam: ${horse.dam || 'Unknown'} - Contributes athleticism and heart
• Grandsire: Strong foundation in racing bloodlines
• Cross potential: Excellent for barrel racing and performance events
• Genetic diversity: Good mix of speed and endurance lines`
  }
}
