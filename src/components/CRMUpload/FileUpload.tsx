import React, { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Upload, FileText } from 'lucide-react'
import { BUSINESS_TYPE_LABELS } from './types'

interface FileUploadProps {businessType: 'producer' | 'stallion_station' | 'athlete' | 'horse_owner'
  onFileSelect: (file: File) => void
  uploading: boolean
}

export function FileUpload({ businessType, onFileSelect, uploading }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload {BUSINESS_TYPE_LABELS[businessType]} Data
        </h3>
        <p className="text-gray-600 mb-4">
          Upload a CSV file with your {businessType.replace('_', ' ')} information
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop your CSV file here, or click to browse
          </p>
          <Button onClick={handleUploadClick} disabled={uploading}>
            {uploading ? 'Processing...' : 'Choose File'}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="text-xs text-gray-500">
        <p className="font-medium mb-1">Supported formats:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>CSV files (.csv)</li>
          <li>Maximum file size: 10MB</li>
          <li>First row should contain column headers</li>
        </ul>
      </div>
    </div>
  )
}

