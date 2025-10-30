import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle, AlertCircle, Download, Database } from 'lucide-react'
import { UploadResults } from './types'

interface UploadResultsProps {results: UploadResults
  onDownloadErrors: () => void
}

export function UploadResultsComponent({ results, onDownloadErrors }: UploadResultsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Upload Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium">Records Processed</span>
              </div>
              <span className="text-lg font-semibold text-green-600">
                {results.processed}
              </span>
            </div>

            {results.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-medium text-red-600">Errors</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={onDownloadErrors}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="text-sm text-red-700">
                    {results.errors.slice(0, 3).map((error, index) => (
                      <div key={index} className="mb-1">• {error}</div>
                    ))}
                    {results.errors.length > 3 && (
                      <div className="text-xs text-red-600 mt-1">
                        ...and {results.errors.length - 3} more errors
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {results.warnings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-medium text-yellow-600">Warnings</span>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="text-sm text-yellow-700">
                    {results.warnings.slice(0, 3).map((warning, index) => (
                      <div key={index} className="mb-1">• {warning}</div>
                    ))}
                    {results.warnings.length > 3 && (
                      <div className="text-xs text-yellow-600 mt-1">
                        ...and {results.warnings.length - 3} more warnings
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

