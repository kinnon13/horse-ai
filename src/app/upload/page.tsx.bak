'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Brain,
  Target
} from 'lucide-react'
import { CSVParser, ParsedHorseData } from '@/lib/csv-parser'
import { formatCurrency, calculatePoints } from '@/lib/utils'

interface UploadResult {
  success: boolean
  message: string
  data: ParsedHorseData[]
  errors: string[]
  pointsEarned: number
}

export default function UploadPage() {
  const { user, loading } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      const text = await file.text()
      const parsedData = CSVParser.parseCSV(text)
      const validation = CSVParser.validateRequiredFields(parsedData)

      if (!validation.valid) {
        setUploadResult({
          success: false,
          message: 'Validation failed',
          data: parsedData,
          errors: validation.errors,
          pointsEarned: 0
        })
        return
      }

      // Simulate AI verification (in real app, this would call Grok API)
      const verified = Math.random() > 0.2 // 80% verification rate
      const pointsEarned = calculatePoints(parsedData.length, verified)

      setUploadResult({
        success: true,
        message: `Successfully processed ${parsedData.length} horses`,
        data: parsedData,
        errors: [],
        pointsEarned
      })

    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Failed to process CSV file',
        data: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        pointsEarned: 0
      })
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = CSVParser.generateTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'horse-ai-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to upload data</h1>
        <p className="text-gray-600 mb-4">You need to be signed in to upload and manage your horse data.</p>
        <Button>Sign In</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload CSV Data</h1>
        <p className="text-gray-600">
          Import unlimited horse data from QData, EquiStat, or other sources. 
          Get instant AI validation and earn points for verified uploads - no limits!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Your Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  Drop your CSV file here, or click to browse
                </p>
                <p className="text-gray-600 mb-4">
                  Supports QData, EquiStat, and custom formats
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Processing...' : 'Choose File'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Need a Template?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Download our CSV template to ensure your data is formatted correctly. 
                Compatible with QData and EquiStat exports.
              </p>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {uploadResult.success ? (
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  )}
                  Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    uploadResult.success ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <p className={`font-medium ${
                      uploadResult.success ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {uploadResult.message}
                    </p>
                  </div>

                  {uploadResult.success && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-900">Points Earned</span>
                        <span className="text-2xl font-bold text-blue-600">
                          +{uploadResult.pointsEarned}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        Redeem points for free months and premium features
                      </p>
                    </div>
                  )}

                  {uploadResult.errors.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="font-medium text-red-900 mb-2">Errors Found:</p>
                      <ul className="text-sm text-red-700 space-y-1">
                        {uploadResult.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {uploadResult.data.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">Preview Data:</p>
                      <div className="max-h-48 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-1">Name</th>
                              <th className="text-left py-1">Breed</th>
                              <th className="text-left py-1">Earnings</th>
                            </tr>
                          </thead>
                          <tbody>
                            {uploadResult.data.slice(0, 5).map((horse, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-1">{horse.name}</td>
                                <td className="py-1">{horse.breed}</td>
                                <td className="py-1">
                                  {horse.earnings ? formatCurrency(horse.earnings) : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {uploadResult.data.length > 5 && (
                          <p className="text-xs text-gray-500 mt-2">
                            ... and {uploadResult.data.length - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Cross-reference with public databases</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Validate pedigree information</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Verify earnings and performance data</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Auto-correct common formatting issues</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Earn Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">CSV Upload (per row)</span>
                  <span className="text-sm font-medium">10 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Verified Data Bonus</span>
                  <span className="text-sm font-medium">+50% points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Large Upload Bonus</span>
                  <span className="text-sm font-medium">+100 points</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Points per row</span>
                    <span>10 points (verified) / 5 points (unverified)</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Unlimited rows = unlimited points!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
