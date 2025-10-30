import { CardHeader, CardTitle } from '@/components/ui/Card'
import { Building2 } from 'lucide-react'

export function BusinessFormHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center">
        <Building2 className="h-6 w-6 mr-2 text-blue-600" />
        List Your Business
      </CardTitle>
      <p className="text-gray-600">Add your business to our directory</p>
    </CardHeader>
  )
}



