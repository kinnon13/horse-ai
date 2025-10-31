import React from 'react'
import { User } from './UsersTypes'

interface UsersListItemProps {
  user: User
  onViewDetails: (user: User) => void
}

export function UsersListItem({ user, onViewDetails }: UsersListItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {user.email}
          </h3>
          <p className="text-sm text-gray-600">Tier: {user.tier}</p>
          <p className="text-sm text-gray-500">
            Horses: {user.horses_claimed} • Requests: {user.service_requests}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            user.churn_risk === 'low'
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {user.churn_risk === 'low' ? 'Low Risk' : 'High Risk'}
          </span>
          <button
            onClick={() => onViewDetails(user)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}