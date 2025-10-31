import type { ServiceRequestType } from './ProviderLoginTypes'

interface ServiceRequestCardProps {
  request: ServiceRequestType
  onClaim: (requestId: string) => void
  onViewDetails: (requestId: string) => void
}

export function ServiceRequestCard({ request, onClaim, onViewDetails }: ServiceRequestCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{request.title}</h3>
          <p className="text-gray-600 text-sm">{request.service_type}</p>
        </div>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
          {request.status}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4">{request.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p><strong>Location:</strong> {request.city}, {request.state}</p>
          <p><strong>Budget:</strong> ${request.budget_min} - ${request.budget_max}</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(request.id)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            View Details
          </button>
          <button
            onClick={() => onClaim(request.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Claim Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceRequestCard