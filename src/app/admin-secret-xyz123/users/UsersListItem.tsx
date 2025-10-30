import React from 'react'
import { User } from './UsersTypes'

interface UsersListItemProps {
  user: User
  onViewDetails: (user: User) => void
}

export function UsersListItem({ user, onViewDetails }: UsersListItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{user.email}</h3>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.tier === 'plus' ? 'bg-purple-100 text-purple-800' :
            user.tier === 'basic' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {user.tier}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.churn_risk === 'high' ? 'bg-red-100 text-red-800' :
            user.churn_risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {user.churn_risk} risk
          </span>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Last Activity:</strong> {new Date(user.last_activity).toLocaleDateString()}</p>
        <p><strong>Horses Claimed:</strong> {user.horses_claimed}</p>
        <p><strong>Service Requests:</strong> {user.service_requests}</p>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onViewDetails(user)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

