import { Building2 } from 'lucide-react'
import { CardTitle } from '@/components/ui/Card'

export function BusinessInfoHeader() {
  return (
    <CardTitle className="flex items-center">
      <Building2 className="h-6 w-6 mr-2 text-blue-600" />
      Business Information
    </CardTitle>
  )
}

