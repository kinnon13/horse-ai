import React from 'react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
          <div className="prose max-w-none">
            <p className="text-sm text-gray-600 mb-6">Last Updated: December 2024</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By using HorseGPT, you agree to these Terms of Use. If you don't agree, please don't use our services.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Description of Service</h2>
            <p className="text-gray-700 mb-4">HorseGPT provides logistics, concierge, and safety services for horse haulers and riders, including:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Route planning and safety recommendations</li>
              <li>Service provider connections (farriers, vets, stall barns)</li>
              <li>Emergency assistance and aftercare follow-up</li>
              <li>Safety scoring and provider verification</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">User Responsibilities</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Accurate Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Provide accurate information about yourself and your horses</li>
              <li>Update information when it changes</li>
              <li>Don't share false or misleading information</li>
            </ul>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Safe Use</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Use services responsibly and safely</li>
              <li>Follow all applicable laws and regulations</li>
              <li>Don't use services for illegal activities</li>
            </ul>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Account Security</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Keep your login credentials secure</li>
              <li>Notify us immediately of any security breaches</li>
              <li>Don't share your account with others</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Service Limitations</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Informational Only</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>HorseGPT provides informational recommendations only</li>
              <li>We are not veterinary, legal, or professional advisors</li>
              <li>Always consult qualified professionals for medical or legal advice</li>
            </ul>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Third-Party Services</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>We connect you with third-party service providers</li>
              <li>We don't control or guarantee their services</li>
              <li>You're responsible for vetting providers and their services</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Payment Terms</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Subscriptions</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>HorseGPT+ subscriptions are billed monthly</li>
              <li>Free trial periods are clearly disclosed</li>
              <li>You can cancel anytime through your account settings</li>
            </ul>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Service Fees</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Booking and concierge fees are clearly disclosed</li>
              <li>Payment processing handled by Stripe</li>
              <li>Refunds subject to our refund policy</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">HorseGPT is not liable for:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Injuries to persons or horses</li>
              <li>Property damage</li>
              <li>Service provider actions or omissions</li>
              <li>Indirect or consequential damages</li>
            </ul>
            <p className="text-gray-700 mb-4">Our total liability is limited to the amount you paid for services in the 12 months preceding the claim.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">For questions about these terms:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Email: legal@horsegpt.com</li>
              <li>Address: HorseGPT Legal Team, [Your Address]</li>
            </ul>
            
            <div className="mt-8 p-4 bg-teal-50 rounded-lg">
              <p className="text-teal-800 font-medium">
                By using HorseGPT, you're joining a community committed to keeping horses and riders safe on the road.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


