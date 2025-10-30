/**
 * SERVICE REQUEST PARSER
 * 
 * PURPOSE:
 * - Parses service request messages to extract structured data
 * - Handles various ways users might request services
 * 
 * SAFETY:
 * - Only extracts data that users explicitly provide
 * - Validates location data before processing
 */

import { ServiceRequestDataExtractors } from './ServiceRequestDataExtractors'

export interface ServiceRequestIntent {
  type: 'service_request'
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
  /**
   * PURPOSE:
   * - Parses service request messages to extract structured data
   * - Handles various ways users might request services
   * 
   * SAFETY:
   * - Only extracts data that users explicitly provide
   * - Validates location data before processing
   */
  static parseServiceRequest(message: string): ServiceRequestIntent {
    const lowerMessage = message.toLowerCase()
    
    const serviceType = ServiceRequestDataExtractors.extractServiceType(lowerMessage)
    const location = ServiceRequestDataExtractors.extractLocation(message)
    const urgency = ServiceRequestDataExtractors.extractUrgency(lowerMessage)
    const horseName = ServiceRequestDataExtractors.extractHorseName(message)
    
    return {
      type: 'service_request',
      serviceType,
      location,
      urgency,
      details: message,
      horseName
    }
  }
}

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ServiceRequestIntent(_props?: any): never { throw new Error("Stubbed component used: ./ServiceRequestParser.ServiceRequestIntent"); }
