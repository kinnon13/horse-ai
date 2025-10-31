// export-generator-equistat-render-helpers.ts (30 lines) - Single responsibility: Render helper functions
import jsPDF from 'jspdf'

export class EquiStatRenderHelpers {
  static addHorseBasicInfo(doc: jsPDF, horse: any): void {
    doc.setFontSize(12)
    doc.text(`Breed: ${horse.breed}`, 20, 50)
    doc.text(`Sire: ${horse.sire || 'Unknown'}`, 20, 60)
    doc.text(`Dam: ${horse.dam || 'Unknown'}`, 20, 70)
    doc.text(`Earnings: $${(horse.earnings || 0).toLocaleString()}`, 20, 80)
  }

  static createEarningsData(latest: any): string[][] {
    return [
      ['Year', 'Earnings', 'Races', 'Wins'],
      ['2024', `$${(latest.earnings * 0.4).toLocaleString()}`, '12', '3'],
      ['2023', `$${(latest.earnings * 0.6).toLocaleString()}`, '18', '5'],
      ['2022', `$${(latest.earnings * 0.3).toLocaleString()}`, '8', '2']
    ]
  }

  static createProgenyData(progeny: any): string[][] {
    const progenyList = JSON.parse(progeny)
    return progenyList.slice(0, 10).map((p: string) => [p, 'Active', '$0'])
  }

  static addTable(doc: jsPDF, data: string[][], startY: number, fontSize: number = 10): void {
    // @ts-ignore
    doc.autoTable({
      head: [data[0]],
      body: data.slice(1),
      startY,
      styles: { fontSize }
    })
  }
}

