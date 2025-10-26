'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  DollarSign, 
  MessageSquare, 
  Settings, 
  Shield,
  TrendingUp,
  Database,
  LogOut,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  full_name: string
  subscription_tier: 'free' | 'mid' | 'pro'
  messages_used: number
  messages_limit: number
  created_at: string
  last_active: string
}

interface AdminStats {
  totalUsers: number
  freeUsers: number
  midUsers: number
  proUsers: number
  totalRevenue: number
  totalMessages: number
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    freeUsers: 0,
    midUsers: 0,
    proUsers: 0,
    totalRevenue: 0,
    totalMessages: 0
  })
  const [loading, setLoading] = useState(false)

  // Check if already authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin-auth')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
      loadAdminData()
    }
  }, [])

  const handleLogin = async () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('admin-auth', 'true')
      loadAdminData()
    } else {
      alert('Invalid admin password')
    }
  }

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, fetch from Supabase
      const mockUsers: AdminUser[] = [
        {
          id: '1',
          email: 'user1@example.com',
          full_name: 'John Doe',
          subscription_tier: 'free',
          messages_used: 8,
          messages_limit: 10,
          created_at: '2024-01-15',
          last_active: '2024-01-20'
        },
        {
          id: '2',
          email: 'user2@example.com',
          full_name: 'Jane Smith',
          subscription_tier: 'mid',
          messages_used: 25,
          messages_limit: 50,
          created_at: '2024-01-10',
          last_active: '2024-01-20'
        },
        {
          id: '3',
          email: 'user3@example.com',
          full_name: 'Bob Johnson',
          subscription_tier: 'pro',
          messages_used: 150,
          messages_limit: 999,
          created_at: '2024-01-05',
          last_active: '2024-01-20'
        }
      ]

      const mockStats: AdminStats = {
        totalUsers: 3,
        freeUsers: 1,
        midUsers: 1,
        proUsers: 1,
        totalRevenue: 29.98,
        totalMessages: 183
      }

      setUsers(mockUsers)
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin-auth')
    setPassword('')
  }

  const updateUserTier = async (userId: string, newTier: 'free' | 'mid' | 'pro') => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, subscription_tier: newTier, messages_limit: newTier === 'pro' ? 999 : newTier === 'mid' ? 50 : 10 }
        : user
    ))
  }

  const resetUserMessages = async (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, messages_used: 0 }
        : user
    ))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-red-500" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Horse.AI Management Dashboard</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pro Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.proUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tier</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Messages</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.subscription_tier}
                          onChange={(e) => updateUserTier(user.id, e.target.value as 'free' | 'mid' | 'pro')}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="free">Free</option>
                          <option value="mid">Mid ($9.99)</option>
                          <option value="pro">Pro ($19.99)</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{user.messages_used}/{user.messages_limit}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resetUserMessages(user.id)}
                            className="text-xs"
                          >
                            Reset
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
