import { ServiceRequestCardDetailsProps } from './ServiceRequestCardTypes'
import { formatServiceRequestDate, getServiceRequestStatusColor, getServiceRequestPriorityColor } from './ServiceRequestCardUtils'

export function ServiceRequestCardDetails({ request }: ServiceRequestCardDetailsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getServiceRequestStatusColor(request.status)}`}>
          {request.status.toUpperCase()}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getServiceRequestPriorityColor(request.priority)}`}>
          {request.priority.toUpperCase()}
        </span>
      </div>
      
      <p className="text-gray-700">{request.description}</p>
      
      <div className="text-sm text-gray-600">
        <p><strong>Location:</strong> {request.location_city}, {request.location_state}</p>
        <p><strong>Requested:</strong> {formatServiceRequestDate(request.created_at)}</p>
        {request.preferred_date && (
          <p><strong>Preferred Date:</strong> {formatServiceRequestDate(request.preferred_date)}</p>
        )}
        {request.budget_range && (
          <p><strong>Budget Range:</strong> {request.budget_range}</p>
        )}
      </div>
    </div>
  )
}