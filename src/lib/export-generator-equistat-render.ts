// export-generator-equistat-render.ts (35 lines) - Single responsibility: Main render functions
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { EquiStatRenderHelpers } from './export-generator-equistat-render-helpers'

export function addEquiStatHeader(doc: jsPDF, horse: any): void {
  doc.setFontSize(24)
  doc.text(horse.name, 20, 30)
  EquiStatRenderHelpers.addHorseBasicInfo(doc, horse)
}

export function addPerformanceHistory(doc: jsPDF, latest: any): void {
  if (!latest.earnings) return
  
  doc.setFontSize(14)
  doc.text('Performance History', 20, 100)
  
  const earningsData = EquiStatRenderHelpers.createEarningsData(latest)
  EquiStatRenderHelpers.addTable(doc, earningsData, 110)
}

export function addProgenyTable(doc: jsPDF, progeny: any): void {
  if (!progeny) return
  
  doc.setFontSize(14)
  doc.text('Progeny', 20, 200)
  
  const progenyData = EquiStatRenderHelpers.createProgenyData(progeny)
  EquiStatRenderHelpers.addTable(doc, progenyData, 210, 9)
}