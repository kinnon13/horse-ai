import React from 'react'
import { User } from './UsersTypes'
import { UsersListItem } from './UsersListItem'

interface UsersListProps {
  users: User[]
  onViewDetails: (user: User) => void
}

export function UsersList({ users, onViewDetails }: UsersListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No users found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UsersListItem 
          key={user.id} 
          user={user} 
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}



