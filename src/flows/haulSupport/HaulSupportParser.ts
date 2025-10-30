/**
 * HAUL SUPPORT PARSER
 * 
 * PURPOSE:
 * - Parses haul support messages to extract structured data
 * - Handles various ways users might request haul support
 * 
 * SAFETY:
 * - Only extracts data that users explicitly provide
 * - Validates route data before processing
 */

import { HaulSupportDataExtractors } from './HaulSupportDataExtractors'

export interface HaulSupportIntent {
  type: 'haul_support'
  route: {
    origin: {
      city: string
      state: string
    }
    destination: {
      city: string
      state: string
    }
  }
  urgency: 'low' | 'normal' | 'high' | 'urgent'
  supportTypes: string[]
}

export class HaulSupportParser {
  /**
   * PURPOSE:
   * - Parses haul support messages to extract structured data
   * - Handles various ways users might request haul support
   * 
   * SAFETY:
   * - Only extracts data that users explicitly provide
   * - Validates route data before processing
   */
  static parseHaulSupportRequest(message: string): HaulSupportIntent {
    const route = HaulSupportDataExtractors.extractRoute(message)
    const urgency = HaulSupportDataExtractors.extractUrgency(message)
    const supportTypes = HaulSupportDataExtractors.extractSupportTypes(message)
    
    return {
      type: 'haul_support',
      route,
      urgency,
      supportTypes
    }
  }
}
