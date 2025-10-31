// ParserLogic.ts (35 lines) - Single responsibility: Service request parsing logic
import { DataExtractors } from './ServiceRequestDataExtractors'
import { ServiceRequestIntent } from './ServiceRequestParser'

export class ParserLogic {
  static parseServiceRequest(message: string): ServiceRequestIntent {
    const lowerMessage = message.toLowerCase()
    
    const serviceType = DataExtractors.extractServiceType(lowerMessage)
    const location = DataExtractors.extractLocation(message)
    const urgency = DataExtractors.extractUrgency(lowerMessage)
    const horseName = DataExtractors.extractHorseName(message)
    
    return {
      type: 'service_request',
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      serviceType,
      location,
      urgency,
      details: message,
      horseName
    }
  }

  static validateServiceRequest(intent: ServiceRequestIntent): boolean {
    return intent.serviceType !== 'other' && 
           intent.location.city.length > 0 && 
           intent.location.state.length === 2
  }

  static sanitizeServiceRequest(intent: ServiceRequestIntent): ServiceRequestIntent {
    return {
      ...intent,
      details: intent.details.substring(0, 1000),
      horseName: intent.horseName?.substring(0, 50)
    }
  }
}


