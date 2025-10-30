import React from 'react'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">HorseGPT Support</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              HorseGPT is your road manager for safe horse hauling. We keep you and your horses safe on the road with verified stops, emergency contacts, and concierge services.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Getting Started</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">How does HorseGPT work?</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Tell us where you're hauling</strong> - "Headed from Stephenville to OKC tonight"</li>
              <li><strong>We find safe stops</strong> - Fuel, overnight stalls, emergency vets along your route</li>
              <li><strong>We line it up</strong> - Book stalls, notify vets, get gate codes</li>
              <li><strong>We check on you</strong> - Aftercare follow-up to keep the network safe</li>
            </ol>
            
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">How do I claim my horse?</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li>Open HorseGPT and go to "Claim Horse"</li>
              <li>Enter your horse's name and registration details</li>
              <li>Upload registration papers or photos</li>
              <li>We'll verify and connect you to your horse's profile</li>
            </ol>
            
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">How do I get verified as a provider?</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li>Go to "Become a Provider"</li>
              <li>Submit your business information and credentials</li>
              <li>Complete our verification process</li>
              <li>Start receiving service requests in your area</li>
            </ol>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Subscription & Billing</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">How do I cancel HorseGPT+?</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li>Go to your account settings</li>
              <li>Click "Manage Subscription"</li>
              <li>Select "Cancel Subscription"</li>
              <li>Your access continues until the end of your billing period</li>
            </ol>
            
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">What's included in HorseGPT+?</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Unlimited chat and concierge requests</li>
              <li>Priority service dispatch</li>
              <li>Advanced safety recommendations</li>
              <li>Emergency contact coordination</li>
              <li>Route planning and haul support</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Safety & Emergency</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">What if I have an emergency while hauling?</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li>Use the emergency contact feature in the app</li>
              <li>We'll connect you with the nearest verified vet</li>
              <li>We can coordinate emergency stalls or transport</li>
              <li>We'll follow up to ensure you're safe</li>
            </ol>
            
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">How do you verify safety scores?</h3>
            <p className="text-gray-700 mb-4">Safety scores come from real user feedback after visits:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Users rate locations 1-5 for safety</li>
              <li>We track "would use again" responses</li>
              <li>Scores update continuously based on new feedback</li>
              <li>Only verified, recent feedback counts toward scores</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-medium text-gray-900">Is HorseGPT just an AI chatbot?</h4>
                <p className="text-gray-700 mt-1">No. We're a logistics and safety network. We connect you with real, verified service providers and coordinate actual services.</p>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-medium text-gray-900">How do you make money?</h4>
                <p className="text-gray-700 mt-1">We charge subscription fees for HorseGPT+ and small booking fees for services we coordinate. We also offer sponsored placement for top-rated providers.</p>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-medium text-gray-900">What if a provider doesn't show up?</h4>
                <p className="text-gray-700 mt-1">We have backup providers and will work to find alternatives. We also track provider reliability and remove consistently unreliable providers.</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">General Support</h3>
                <p className="text-sm text-gray-600 mb-2">Email: support@horsegpt.com</p>
                <p className="text-sm text-gray-600">Response time: Within 24 hours</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Emergency Support</h3>
                <p className="text-sm text-gray-600 mb-2">Text: [Emergency Number]</p>
                <p className="text-sm text-gray-600">Available: 24/7 for active service requests</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Business Inquiries</h3>
                <p className="text-sm text-gray-600 mb-2">Email: business@horsegpt.com</p>
                <p className="text-sm text-gray-600">For providers, partnerships, and media</p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Need help right now?</h3>
              <p className="text-gray-700 mb-4">Contact us at support@horsegpt.com</p>
              <p className="text-teal-800 font-medium italic">
                HorseGPT: Keeping you and your horses safe on the road.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


