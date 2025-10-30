import { ServiceRequestCardHeaderProps } from './ServiceRequestCardTypes'

export function ServiceRequestCardHeader({ request, onViewDetails }: ServiceRequestCardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">{request.title}</h3>
        <p className="text-sm text-gray-600">#{request.id.slice(0, 8)}</p>
      </div>
      <button
        onClick={() => onViewDetails(request.id)}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        View Details
      </button>
    </div>
  )
}



