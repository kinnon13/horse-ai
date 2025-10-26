'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Brain, 
  Target,
  ArrowRight,
  ArrowLeft,
  FileText,
  Database,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ReactNode
}

export default function OnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [onboardingData, setOnboardingData] = useState<{
    importedData?: any
    verifiedData?: any
    scrubbingConfig?: any
    preferences?: any
  }>({})

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Horse.AI!',
      description: 'Let\'s get your equine database set up with some initial data.',
      component: <WelcomeStep onNext={() => setCurrentStep(1)} />
    },
    {
      id: 'data-import',
      title: 'Import Your Data',
      description: 'Upload your existing horse data or let us help you find it.',
      component: <DataImportStep 
        onDataImported={(data) => {
          setOnboardingData(prev => ({ ...prev, importedData: data }))
          setCompletedSteps(prev => [...prev, 'data-import'])
        }}
      />
    },
    {
      id: 'ai-verification',
      title: 'AI Data Verification',
      description: 'Our AI will verify and enrich your data automatically.',
      component: <AIVerificationStep 
        data={onboardingData.importedData}
        onVerified={(verifiedData) => {
          setOnboardingData(prev => ({ ...prev, verifiedData }))
          setCompletedSteps(prev => [...prev, 'ai-verification'])
        }}
      />
    },
    {
      id: 'scrubbing-setup',
      title: 'Enable Auto-Scrubbing',
      description: 'Set up automatic data enrichment from public sources.',
      component: <ScrubbingSetupStep 
        onSetup={(scrubbingConfig) => {
          setOnboardingData(prev => ({ ...prev, scrubbingConfig }))
          setCompletedSteps(prev => [...prev, 'scrubbing-setup'])
        }}
      />
    },
    {
      id: 'preferences',
      title: 'Set Your Preferences',
      description: 'Configure your notification and data sharing preferences.',
      component: <PreferencesStep 
        onSave={(preferences) => {
          setOnboardingData(prev => ({ ...prev, preferences }))
          setCompletedSteps(prev => [...prev, 'preferences'])
        }}
      />
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Your Horse.AI database is ready to go.',
      component: <CompleteStep 
        data={onboardingData}
        onComplete={() => router.push('/dashboard')}
      />
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/signin')
    return null
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {currentStepData.title}
              {completedSteps.includes(currentStepData.id) && (
                <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
              )}
            </CardTitle>
            <p className="text-gray-600">{currentStepData.description}</p>
          </CardHeader>
          <CardContent>
            {currentStepData.component}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary-600'
                    : completedSteps.includes(steps[index].id)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 && (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!completedSteps.includes(currentStepData.id)}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Step Components
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
        <Database className="w-8 h-8 text-primary-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-4">Welcome to Horse.AI!</h3>
        <p className="text-gray-600 mb-6">
          We're going to help you build the most comprehensive equine database possible. 
          Our AI will automatically find and verify data from multiple sources.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-left">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h4 className="font-medium">Automatic Data Enrichment</h4>
            <p className="text-sm text-gray-600">AI finds missing information</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h4 className="font-medium">Cross-Source Verification</h4>
            <p className="text-sm text-gray-600">Validates data accuracy</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h4 className="font-medium">Earn Points for Contributions</h4>
            <p className="text-sm text-gray-600">Get rewarded for quality data</p>
          </div>
        </div>
      </div>

      <Button onClick={onNext} size="lg">
        Let's Get Started
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}

function DataImportStep({ onDataImported }: { onDataImported: (data: any) => void }) {
  const [importMethod, setImportMethod] = useState<'csv' | 'api' | 'manual'>('csv')
  const [isImporting, setIsImporting] = useState(false)

  const handleCSVUpload = async (file: File) => {
    setIsImporting(true)
    try {
      // Simulate CSV processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      onDataImported({ method: 'csv', file: file.name, records: 25 })
    } finally {
      setIsImporting(false)
    }
  }

  const handleAPIPull = async () => {
    setIsImporting(true)
    try {
      // Simulate API data pull
      await new Promise(resolve => setTimeout(resolve, 3000))
      onDataImported({ method: 'api', source: 'Equibase', records: 15 })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => setImportMethod('csv')}
          className={`p-4 border rounded-lg text-left transition-colors ${
            importMethod === 'csv' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
        >
          <FileText className="w-6 h-6 mb-2" />
          <h4 className="font-medium">Upload CSV</h4>
          <p className="text-sm text-gray-600">Import from QData, EquiStat, or custom format</p>
        </button>

        <button
          onClick={() => setImportMethod('api')}
          className={`p-4 border rounded-lg text-left transition-colors ${
            importMethod === 'api' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
        >
          <Database className="w-6 h-6 mb-2" />
          <h4 className="font-medium">API Pull</h4>
          <p className="text-sm text-gray-600">Connect to Equibase, AQHA, or other sources</p>
        </button>

        <button
          onClick={() => setImportMethod('manual')}
          className={`p-4 border rounded-lg text-left transition-colors ${
            importMethod === 'manual' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
        >
          <Target className="w-6 h-6 mb-2" />
          <h4 className="font-medium">Manual Entry</h4>
          <p className="text-sm text-gray-600">Add horses one by one</p>
        </button>
      </div>

      {importMethod === 'csv' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
          <p className="text-gray-600 mb-4">Supports QData, EquiStat, and custom formats</p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && handleCSVUpload(e.target.files[0])}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload">
            <Button disabled={isImporting}>
              {isImporting ? 'Processing...' : 'Choose File'}
            </Button>
          </label>
        </div>
      )}

      {importMethod === 'api' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Available Data Sources</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Equibase - Race results and earnings</li>
              <li>• AQHA - Registration and bloodline data</li>
              <li>• Social media - Recent activity and mentions</li>
            </ul>
          </div>
          <Button onClick={handleAPIPull} disabled={isImporting} className="w-full">
            {isImporting ? 'Pulling Data...' : 'Pull from Public Sources'}
          </Button>
        </div>
      )}

      {importMethod === 'manual' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            You can add horses manually after completing setup. 
            Our AI will automatically find and enrich their data.
          </p>
          <Button onClick={() => onDataImported({ method: 'manual', records: 0 })}>
            Skip for Now
          </Button>
        </div>
      )}
    </div>
  )
}

function AIVerificationStep({ data, onVerified }: { data: any, onVerified: (data: any) => void }) {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'processing' | 'completed'>('pending')
  const [verificationResults, setVerificationResults] = useState<any>(null)

  useEffect(() => {
    if (data && verificationStatus === 'pending') {
      setVerificationStatus('processing')
      
      // Simulate AI verification
      setTimeout(() => {
        setVerificationResults({
          verified: 18,
          flagged: 2,
          enriched: 5,
          newData: 3
        })
        setVerificationStatus('completed')
        onVerified(verificationResults)
      }, 3000)
    }
  }, [data, verificationStatus, onVerified])

  return (
    <div className="space-y-6">
      {verificationStatus === 'processing' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">AI is verifying your data...</p>
          <p className="text-gray-600">This may take a few moments</p>
        </div>
      )}

      {verificationStatus === 'completed' && verificationResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{verificationResults.verified}</div>
              <div className="text-sm text-green-700">Verified</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{verificationResults.flagged}</div>
              <div className="text-sm text-yellow-700">Flagged</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{verificationResults.enriched}</div>
              <div className="text-sm text-blue-700">Enriched</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{verificationResults.newData}</div>
              <div className="text-sm text-purple-700">New Data</div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium text-green-900">Verification Complete!</span>
            </div>
            <p className="text-sm text-green-700">
              Your data has been verified and enriched with information from multiple sources.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ScrubbingSetupStep({ onSetup }: { onSetup: (config: any) => void }) {
  const [scrubbingEnabled, setScrubbingEnabled] = useState(true)
  const [sources, setSources] = useState({
    equibase: true,
    aqha: true,
    social: true,
    news: true
  })

  const handleSave = () => {
    onSetup({
      enabled: scrubbingEnabled,
      sources,
      frequency: 'daily'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Enable Auto-Scrubbing</h4>
          <p className="text-sm text-gray-600">Automatically find and update data from public sources</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={scrubbingEnabled}
            onChange={(e) => setScrubbingEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {scrubbingEnabled && (
        <div className="space-y-4">
          <h4 className="font-medium">Data Sources</h4>
          <div className="space-y-3">
            {Object.entries(sources).map(([key, enabled]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setSources(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="mr-3"
                />
                <span className="capitalize">{key}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {key === 'equibase' && 'Race results and earnings'}
                  {key === 'aqha' && 'Registration and bloodline data'}
                  {key === 'social' && 'Social media mentions and activity'}
                  {key === 'news' && 'News articles and press releases'}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleSave} className="w-full">
        Save Scrubbing Configuration
      </Button>
    </div>
  )
}

function PreferencesStep({ onSave }: { onSave: (preferences: any) => void }) {
  const [preferences, setPreferences] = useState({
    notifications: true,
    dataSharing: false,
    marketing: false,
    analytics: true
  })

  const handleSave = () => {
    onSave(preferences)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Push Notifications</h4>
            <p className="text-sm text-gray-600">Get notified about new data and updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Data Sharing</h4>
            <p className="text-sm text-gray-600">Allow your data to be used for research and improvements</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.dataSharing}
              onChange={(e) => setPreferences(prev => ({ ...prev, dataSharing: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Marketing Communications</h4>
            <p className="text-sm text-gray-600">Receive updates about new features and tips</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Preferences
      </Button>
    </div>
  )
}

function CompleteStep({ data, onComplete }: { data: any, onComplete: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-4">Setup Complete!</h3>
        <p className="text-gray-600 mb-6">
          Your Horse.AI database is ready. Our AI agents will continue to find and enrich your data automatically.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-left">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• AI agents will continue scrubbing data</li>
            <li>• You'll earn points for quality contributions</li>
            <li>• Get notified about new findings</li>
          </ul>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Your Setup</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• {data.importedData?.records || 0} horses imported</li>
            <li>• Auto-scrubbing {data.scrubbingConfig?.enabled ? 'enabled' : 'disabled'}</li>
            <li>• Notifications {data.preferences?.notifications ? 'on' : 'off'}</li>
          </ul>
        </div>
      </div>

      <Button onClick={onComplete} size="lg">
        Go to Dashboard
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
