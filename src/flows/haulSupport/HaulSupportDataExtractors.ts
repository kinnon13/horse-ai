// HaulSupportDataExtractors.ts (25 lines) - Single responsibility: Main data extractor coordinator
import { RouteExtractor } from './RouteExtractor'
import { SupportTypeExtractor } from './SupportTypeExtractor'

export class HaulSupportDataExtractors {
  static extractRoute(message: string) {
    return RouteExtractor.extractRoute(message)
  }

  static parseLocation(text: string) {
    return RouteExtractor.parseLocation(text)
  }

  static extractUrgency(message: string) {
    return SupportTypeExtractor.extractUrgency(message)
  }

  static extractSupportTypes(message: string) {
    return SupportTypeExtractor.extractSupportTypes(message)
  }
}