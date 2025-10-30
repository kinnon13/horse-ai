'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { UsersStatsCards } from './UsersStatsCards'
import { UsersList } from './UsersList'
import { getInitialUsers, calculateUserStats } from './UsersData'
import { User } from './UsersTypes'

export function UsersPageContent() {
  const { user } = useAuth()
  const [users] = useState(getInitialUsers())
  const [showUserDetails, setShowUserDetails] = useState<User | null>(null)

  const stats = calculateUserStats(users)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Users</h1>
        
        <UsersStatsCards stats={stats} />
        
        <UsersList 
          users={users} 
          onViewDetails={setShowUserDetails}
        />
      </div>
    </div>
  )
}

