// ServiceRequestMutatorHelpers.ts (15 lines) - Main service request mutator coordinator
import { ServiceRequestCreateHelpers } from './ServiceRequestCreateHelpers'
import { ServiceRequestDeleteHelpers } from './ServiceRequestDeleteHelpers'

export class ServiceRequestMutatorHelpers {
  static createServiceRequest = ServiceRequestCreateHelpers.createServiceRequest
  static updateServiceRequest = ServiceRequestCreateHelpers.updateServiceRequest
  static deleteServiceRequest = ServiceRequestDeleteHelpers.deleteServiceRequest
}