'use client'

import { useState } from 'react'
import Link from 'next/link'

interface VerifyViewProps {
  loading: boolean
  step: 'verify' | 'business' | 'subscribe' | 'complete'
  data: any
  horseVerified: boolean
  isBusinessOwner: boolean | null
  onVerifyHorse: (isCorrect: boolean, corrections?: any) => void
  onBusinessResponse: (ownsBusinessresponse: boolean, businessInfo?: any) => void
  onSubscribe: (tier: 'free' | 'basic' | 'pro') => void
}

export function VerifyView(props: VerifyViewProps) {
  if (props.loading && !props.data) {
    return <LoadingScreen />
  }

  if (props.data?.error) {
    return <ErrorScreen error={props.data.error} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-5xl">🐴</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-amber-500">
            Welcome to HorseGPT
          </h1>
          <p className="text-xl text-gray-600">Let's verify your information</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator active={props.step === 'verify'} complete={props.horseVerified} number={1} label="Verify Horse" />
            <div className={`h-1 w-16 ${props.horseVerified ? 'bg-purple-600' : 'bg-gray-300'}`} />
            <StepIndicator active={props.step === 'business'} complete={props.isBusinessOwner !== null} number={2} label="Business" />
            <div className={`h-1 w-16 ${props.isBusinessOwner !== null ? 'bg-purple-600' : 'bg-gray-300'}`} />
            <StepIndicator active={props.step === 'subscribe'} complete={props.step === 'complete'} number={3} label="Get Started" />
          </div>
        </div>

        {/* Content */}
        {props.step === 'verify' && (
          <HorseVerificationStep
            data={props.data}
            loading={props.loading}
            onVerify={props.onVerifyHorse}
          />
        )}

        {props.step === 'business' && (
          <BusinessDiscoveryStep
            loading={props.loading}
            onResponse={props.onBusinessResponse}
          />
        )}

        {props.step === 'subscribe' && (
          <SubscriptionStep
            loading={props.loading}
            isBusinessOwner={props.isBusinessOwner}
            onSubscribe={props.onSubscribe}
          />
        )}

        {props.step === 'complete' && (
          <CompleteStep />
        )}
      </div>
    </div>
  )
}

function StepIndicator({ active, complete, number, label }: { active: boolean; complete: boolean; number: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
        complete ? 'bg-cyan-600 text-white' : active ? 'bg-cyan-100 text-cyan-600 ring-4 ring-cyan-200' : 'bg-gray-200 text-gray-400'
      }`}>
        {complete ? '✓' : number}
      </div>
      <span className={`text-xs mt-2 font-medium ${active || complete ? 'text-cyan-600' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}

function HorseVerificationStep({ data, loading, onVerify }: any) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [corrections, setCorrections] = useState({ name: '', breed: '', age: '' })
  const [showCorrections, setShowCorrections] = useState(false)

  const handleSubmit = () => {
    if (isCorrect === true) {
      onVerify(true)
    } else if (isCorrect === false && showCorrections) {
      onVerify(false, corrections)
    } else if (isCorrect === false) {
      setShowCorrections(true)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Is this information correct?</h2>

        {/* Horse Info Card */}
        <div className="bg-gradient-to-r from-cyan-50 to-amber-50 rounded-xl p-8 mb-8 border-2 border-cyan-100">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🐎</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{data?.horseName || 'Your Horse'}</h3>
              <div className="space-y-2">
                {data?.horseBreed && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Breed:</span>
                    <span className="text-gray-900">{data.horseBreed}</span>
                  </div>
                )}
                {data?.horseAge && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Age:</span>
                    <span className="text-gray-900">{data.horseAge}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Response Buttons */}
        {!showCorrections && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => { setIsCorrect(true); setTimeout(handleSubmit, 100) }}
              disabled={loading}
              className="py-4 px-6 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              ✓ Yes, this is correct
            </button>
            <button
              onClick={() => setIsCorrect(false)}
              disabled={loading}
              className="py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              ✎ No, let me correct it
            </button>
          </div>
        )}

        {/* Corrections Form */}
        {showCorrections && (
          <div className="space-y-6 mb-6">
            <p className="text-gray-600 text-center mb-4">Please provide the correct information:</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horse Name</label>
              <input
                type="text"
                value={corrections.name}
                onChange={(e) => setCorrections({ ...corrections, name: e.target.value })}
                placeholder={data?.horseName || 'Enter horse name'}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 focus:ring-0 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
              <input
                type="text"
                value={corrections.breed}
                onChange={(e) => setCorrections({ ...corrections, breed: e.target.value })}
                placeholder={data?.horseBreed || 'Enter breed'}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 focus:ring-0 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="text"
                value={corrections.age}
                onChange={(e) => setCorrections({ ...corrections, age: e.target.value })}
                placeholder={data?.horseAge || 'Enter age'}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 focus:ring-0 outline-none transition"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !corrections.name}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Submit Corrections'}
            </button>
          </div>
        )}

        <p className="text-sm text-gray-500 text-center">
          Your information helps us build the most accurate equine database
        </p>
      </div>
    </div>
  )
}

function BusinessDiscoveryStep({ loading, onResponse }: any) {
  const [ownsBusinessresponse, setOwnsBusiness] = useState<boolean | null>(null)
  const [businessInfo, setBusinessInfo] = useState({ name: '', type: '', location: '' })
  const [showBusinessForm, setShowBusinessForm] = useState(false)

  const handleSubmit = () => {
    if (ownsBusinessresponse === true && showBusinessForm) {
      onResponse(true, businessInfo)
    } else if (ownsBusinessresponse === true) {
      setShowBusinessForm(true)
    } else if (ownsBusinessresponse === false) {
      onResponse(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏢</div>
          <h2 className="text-3xl font-bold mb-4">Do you own or operate an equine business?</h2>
          <p className="text-gray-600">Trainers, breeders, vets, farriers, transport services, etc.</p>
        </div>

        {!showBusinessForm && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setOwnsBusiness(true)}
              disabled={loading}
              className="py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              Yes, I do
            </button>
            <button
              onClick={() => { setOwnsBusiness(false); setTimeout(handleSubmit, 100) }}
              disabled={loading}
              className="py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              No, just a horse owner
            </button>
          </div>
        )}

        {showBusinessForm && (
          <div className="space-y-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Great! Let's get your business listed</h3>
              <p className="text-sm text-green-700">You'll show up when people search for your services</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
              <input
                type="text"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                placeholder="Enter your business name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-0 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
              <select
                value={businessInfo.type}
                onChange={(e) => setBusinessInfo({ ...businessInfo, type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-0 outline-none transition"
              >
                <option value="">Select type</option>
                <option value="trainer">Horse Trainer</option>
                <option value="breeder">Breeder / Stallion Service</option>
                <option value="veterinarian">Veterinarian</option>
                <option value="farrier">Farrier</option>
                <option value="transport">Transport Service</option>
                <option value="facility">Boarding / Facility</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                value={businessInfo.location}
                onChange={(e) => setBusinessInfo({ ...businessInfo, location: e.target.value })}
                placeholder="City, State"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-0 outline-none transition"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !businessInfo.name || !businessInfo.type || !businessInfo.location}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        )}

        {!showBusinessForm && ownsBusinessresponse === true && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  )
}

function SubscriptionStep({ loading, isBusinessOwner, onSubscribe }: any) {
  const [selectedTier, setSelectedTier] = useState<'free' | 'basic' | 'pro'>('free')

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-600">Start free, upgrade anytime</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Free Tier */}
          <div 
            onClick={() => setSelectedTier('free')}
            className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
              selectedTier === 'free' ? 'border-cyan-600 bg-cyan-50' : 'border-gray-200 hover:border-cyan-300'
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-2">$0</div>
              <p className="text-sm text-gray-600">per month</p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Basic AI chat</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>10 messages/day</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Horse profiles</span>
              </li>
            </ul>
          </div>

          {/* Basic Tier */}
          <div
            onClick={() => setSelectedTier('basic')}
            className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
              selectedTier === 'basic' ? 'border-cyan-600 bg-cyan-50' : 'border-gray-200 hover:border-cyan-300'
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <div className="text-3xl font-bold mb-2">$9</div>
              <p className="text-sm text-gray-600">per month</p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Unlimited messages</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Advanced AI models</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Training plans</span>
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div
            onClick={() => setSelectedTier('pro')}
            className={`cursor-pointer border-2 rounded-xl p-6 transition-all relative ${
              selectedTier === 'pro' ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-cyan-300'
            }`}
          >
            {isBusinessOwner && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </span>
              </div>
            )}
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-2">$29</div>
              <p className="text-sm text-gray-600">per month</p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Everything in Basic</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Business listing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Analytics dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>CRM upload</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>API access</span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => onSubscribe(selectedTier)}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? 'Processing...' : selectedTier === 'free' ? 'Start Free' : `Subscribe to ${selectedTier === 'basic' ? 'Basic' : 'Pro'}`}
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          {selectedTier !== 'free' && 'Cancel anytime. No long-term commitment.'}
        </p>
      </div>
    </div>
  )
}

function CompleteStep() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-amber-500">
          You're all set!
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to the HorseGPT community
        </p>

        <div className="bg-gradient-to-r from-cyan-50 to-amber-50 rounded-xl p-8 mb-8">
          <h3 className="font-bold text-lg mb-4">What's next?</h3>
          <ul className="text-left space-y-3 max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-cyan-600 text-xl">💬</span>
              <span>Start chatting with AI trained on equine expertise</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-600 text-xl">🐴</span>
              <span>Add more horses to your profile</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-600 text-xl">📊</span>
              <span>Track training progress and health records</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/chat"
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg"
          >
            Start Chatting →
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 border-2 border-cyan-600 text-cyan-600 rounded-xl font-semibold text-lg hover:bg-cyan-50 transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading verification...</p>
      </div>
    </div>
  )
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Verification Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-teal-700 transition-all"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  )
}

