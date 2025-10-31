// ParserHelpers.ts (35 lines) - Single responsibility: Parser helper functions
import { HaulSupportDataExtractors } from './HaulSupportDataExtractors'
import { HaulSupportIntent } from './Parser'

export class ParserHelpers {
  /**
   * PURPOSE:
   * - Extracts route information from haul support messages
   * - Handles various ways users might specify routes
   * 
   * SAFETY:
   * - Only extracts data that users explicitly provide
   * - Validates route data before processing
   */
  static extractRouteFromMessage(message: string) {
    return HaulSupportDataExtractors.extractRoute(message)
  }

  static extractUrgencyFromMessage(message: string) {
    return HaulSupportDataExtractors.extractUrgency(message)
  }

  static extractSupportTypesFromMessage(message: string) {
    return HaulSupportDataExtractors.extractSupportTypes(message)
  }

  static buildHaulSupportIntent(
    route: any,
    urgency: 'low' | 'normal' | 'high' | 'urgent',
    supportTypes: string[]
  ): HaulSupportIntent {
    return {
      type: 'haul_support',
      route,
      urgency,
      supportTypes
    }
  }
}


