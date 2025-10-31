// ServiceRequestParser.ts (40 lines) - Single responsibility: Main service request parser
import { ParserLogic } from './ParserLogic'

export interface ServiceRequestIntent {
  type: 'service_request'
  requestId: string
  serviceType: string
  location: {
    city: string
    state: string
  }
  urgency: 'low' | 'normal' | 'high' | 'urgent'
  details: string
  horseName?: string
}

export class ServiceRequestParser {
  static parseServiceRequest(message: string): ServiceRequestIntent {
    const intent = ParserLogic.parseServiceRequest(message)
    
    if (!ParserLogic.validateServiceRequest(intent)) {
      throw new Error('Invalid service request: missing required fields')
    }
    
    return ParserLogic.sanitizeServiceRequest(intent)
  }

  static isValidServiceRequest(message: string): boolean {
    try {
      const intent = ParserLogic.parseServiceRequest(message)
      return ParserLogic.validateServiceRequest(intent)
    } catch {
      return false
    }
  }
}