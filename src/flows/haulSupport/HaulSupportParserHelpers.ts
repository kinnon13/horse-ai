// HaulSupportParserHelpers.ts (30 lines)
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
