// Parser.ts (35 lines) - Single responsibility: Main parser logic
import { ParserHelpers } from './ParserHelpers'

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

export class Parser {
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
    const route = ParserHelpers.extractRouteFromMessage(message)
    const urgency = ParserHelpers.extractUrgencyFromMessage(message)
    const supportTypes = ParserHelpers.extractSupportTypesFromMessage(message)
    
    return ParserHelpers.buildHaulSupportIntent(route, urgency, supportTypes)
  }
}


