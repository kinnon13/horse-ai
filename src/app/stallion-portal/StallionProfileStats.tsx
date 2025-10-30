import { Users, Heart, Zap, Award } from 'lucide-react'
import { StallionProfileStatsProps } from './StallionProfileTypes'

export function StallionProfileStats({ station }: StallionProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Total Stallions</p>
            <p className="text-lg font-semibold">{station.total_stallions}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Heart className="h-5 w-5 text-green-600 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Annual Breedings</p>
            <p className="text-lg font-semibold">{station.annual_breedings}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Zap className="h-5 w-5 text-purple-600 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Years in Business</p>
            <p className="text-lg font-semibold">{station.years_in_business || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-yellow-600 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-semibold">{station.verified ? 'Verified' : 'Pending'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

