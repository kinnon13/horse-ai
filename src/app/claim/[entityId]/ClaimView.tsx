'use client'

import Link from 'next/link'

interface ClaimViewProps {
  loading: boolean
  step: 'view' | 'verify' | 'submit' | 'complete'
  entity: any
  claimData: any
  setClaimData: (data: any) => void
  onStartClaim: () => void
  onSubmitClaim: () => void
}

export function ClaimView(props: ClaimViewProps) {
  if (props.loading && !props.entity) {
    return <LoadingScreen />
  }

  if (props.entity?.error) {
    return <ErrorScreen error={props.entity.error} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-amber-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-5xl">{props.entity?.type === 'business' ? '🏢' : '🐴'}</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-amber-500">
            Claim Your {props.entity?.type === 'business' ? 'Business' : 'Horse'} Listing
          </h1>
          <p className="text-xl text-gray-600">Get verified and take control of your profile</p>
        </div>

        {/* Content */}
        {props.step === 'view' && (
          <EntityViewStep entity={props.entity} onStartClaim={props.onStartClaim} />
        )}

        {props.step === 'verify' && (
          <VerifyOwnershipStep
            entity={props.entity}
            claimData={props.claimData}
            setClaimData={props.setClaimData}
            onSubmit={props.onSubmitClaim}
            loading={props.loading}
          />
        )}

        {props.step === 'complete' && (
          <ClaimCompleteStep entity={props.entity} />
        )}
      </div>
    </div>
  )
}

function EntityViewStep({ entity, onStartClaim }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Entity Info Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{entity.name}</h2>
          {entity.type === 'business' && (
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Type:</span>
                <span>{entity.businessType || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Location:</span>
                <span>{entity.location || 'N/A'}</span>
              </div>
              {entity.website && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Website:</span>
                  <a href={entity.website} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
                    {entity.website}
                  </a>
                </div>
              )}
            </div>
          )}
          {entity.type === 'horse' && (
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Breed:</span>
                <span>{entity.breed || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Color:</span>
                <span>{entity.color || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Owner:</span>
                <span>{entity.owner || 'Unclaimed'}</span>
              </div>
            </div>
          )}
        </div>

        {entity.description && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 text-sm">{entity.description}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <div className={`px-3 py-1 rounded-full ${entity.claimed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {entity.claimed ? '✓ Claimed' : '○ Unclaimed'}
          </div>
          {entity.verified && (
            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">
              ✓ Verified
            </div>
          )}
        </div>
      </div>

      {/* Benefits Card */}
      <div className="bg-gradient-to-br from-cyan-50 to-amber-50 rounded-2xl shadow-xl p-8 border-2 border-cyan-100">
        <h2 className="text-2xl font-bold mb-6">Why claim this listing?</h2>
        
        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
              ✓
            </div>
            <div>
              <div className="font-semibold mb-1">Get Verified</div>
              <div className="text-sm text-gray-600">Official verification badge builds trust</div>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
              ✓
            </div>
            <div>
              <div className="font-semibold mb-1">Control Your Profile</div>
              <div className="text-sm text-gray-600">Update information and add photos</div>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
              ✓
            </div>
            <div>
              <div className="font-semibold mb-1">Get Found</div>
              <div className="text-sm text-gray-600">Rank higher in search results</div>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
              ✓
            </div>
            <div>
              <div className="font-semibold mb-1">See Analytics</div>
              <div className="text-sm text-gray-600">Track views, clicks, and engagement</div>
            </div>
          </li>
        </ul>

        <button
          onClick={onStartClaim}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg"
        >
          {entity.claimed ? 'Request Access' : 'Claim This Listing'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Free to claim • Takes 2 minutes • Verified in 24 hours
        </p>
      </div>
    </div>
  )
}

function VerifyOwnershipStep({ entity, claimData, setClaimData, onSubmit, loading }: any) {
  const canSubmit = claimData.name && claimData.email && claimData.relationship && claimData.proof

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Verify Your Ownership</h2>
        
        <p className="text-gray-600 mb-8 text-center">
          We need to verify that you own or represent <strong>{entity.name}</strong>
        </p>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={claimData.name}
              onChange={(e) => setClaimData({ ...claimData, name: e.target.value })}
              placeholder="Your full name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 focus:ring-0 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={claimData.email}
              onChange={(e) => setClaimData({ ...claimData, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 focus:ring-0 outline-none transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={claimData.phone}
              onChange={(e) => setClaimData({ ...claimData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 focus:ring-0 outline-none transition"
            />
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Relationship to {entity.type === 'business' ? 'This Business' : 'This Horse'} *
            </label>
            <select
              value={claimData.relationship}
              onChange={(e) => setClaimData({ ...claimData, relationship: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 focus:ring-0 outline-none transition"
            >
              <option value="">Select relationship</option>
              {entity.type === 'business' ? (
                <>
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Authorized Employee</option>
                  <option value="representative">Authorized Representative</option>
                </>
              ) : (
                <>
                  <option value="owner">Owner</option>
                  <option value="trainer">Trainer</option>
                  <option value="breeder">Breeder</option>
                  <option value="agent">Agent/Representative</option>
                </>
              )}
            </select>
          </div>

          {/* Proof of Ownership */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proof of Ownership *
            </label>
            <textarea
              value={claimData.proof}
              onChange={(e) => setClaimData({ ...claimData, proof: e.target.value })}
              placeholder={
                entity.type === 'business'
                  ? 'Describe how you can prove ownership (e.g., business license, tax ID, domain ownership, etc.)'
                  : 'Describe how you can prove ownership (e.g., registration papers, vet records, purchase documents, etc.)'
              }
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-600 focus:ring-0 outline-none transition resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Our team will review and may request documentation
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={!canSubmit || loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Claim Request'}
          </button>

          <p className="text-sm text-gray-500 text-center">
            By submitting, you agree to our <a href="/legal/terms" className="text-cyan-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  )
}

function ClaimCompleteStep({ entity }: any) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-amber-500">
          Claim Submitted!
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          We're reviewing your claim for <strong>{entity.name}</strong>
        </p>

        <div className="bg-gradient-to-r from-cyan-50 to-amber-50 rounded-xl p-8 mb-8">
          <h3 className="font-bold text-lg mb-4">What happens next?</h3>
          <ul className="text-left space-y-3 max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-cyan-600 text-xl">📧</span>
              <span>We'll email you within 24 hours to verify your identity</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-600 text-xl">📄</span>
              <span>You may need to provide proof of ownership documents</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-600 text-xl">✅</span>
              <span>Once approved, you'll get full access to manage your listing</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-8 py-4 border-2 border-cyan-600 text-cyan-600 rounded-xl font-semibold text-lg hover:bg-cyan-50 transition-all"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Questions? Contact us at <a href="mailto:support@horsegpt.ai" className="text-cyan-600 hover:underline">support@horsegpt.ai</a>
        </p>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading entity...</p>
      </div>
    </div>
  )
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Entity Not Found</h2>
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


