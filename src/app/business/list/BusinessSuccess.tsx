'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle, ArrowLeft } from 'lucide-react'

interface BusinessSuccessProps {
  onBack: () => void
}

export function BusinessSuccess({ onBack }: BusinessSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Business Listed Successfully!</CardTitle>
          <p className="text-gray-600">Your business has been added to our directory</p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <p className="text-gray-700">
              Thank you for listing your business! It will be reviewed and published within 24 hours.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">What's next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your business will be reviewed by our team</li>
                <li>• You'll receive an email confirmation</li>
                <li>• Your listing will appear in our directory</li>
                <li>• Customers can find and contact you</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onBack}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2 inline" />
              Back to Directory
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

