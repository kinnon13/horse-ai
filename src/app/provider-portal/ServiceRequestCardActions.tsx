import { ServiceRequestCardActionsProps } from './ServiceRequestCardTypes'

export function ServiceRequestCardActions({ request, onClaim, onViewDetails }: ServiceRequestCardActionsProps) {
  return (
    <div className="flex gap-2 pt-3 border-t">
      {request.status === 'open' && (
        <button
          onClick={() => onClaim(request.id)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Claim Job
        </button>
      )}
      
      <button
        onClick={() => onViewDetails(request.id)}
        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
      >
        View Details
      </button>
    </div>
  )
}



