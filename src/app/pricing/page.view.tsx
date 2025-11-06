'use client'

export function PageView() {
  const handleCheckout = async (tier: string, priceId: string) => {
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, tier })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Checkout failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Get unlimited access to HorseGPT's AI expertise
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
            <p className="text-4xl font-bold text-gray-900 mb-6">
              $0<span className="text-lg font-normal text-gray-600">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">5 AI conversations/month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Basic horse profiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Competition calendar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Community access</span>
              </li>
            </ul>
            <button 
              onClick={() => window.location.href = '/auth/signup'}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300"
            >
              Get Started
            </button>
          </div>

          {/* Standard Tier */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-cyan-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Standard</h3>
            <p className="text-4xl font-bold text-cyan-600 mb-6">
              $9.99<span className="text-lg font-normal text-gray-600">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700"><strong>Unlimited</strong> AI conversations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Advanced analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Breeding recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Health tracking & reminders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Priority support</span>
              </li>
            </ul>
            <button 
              onClick={() => handleCheckout('standard', 'price_standard')}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700"
            >
              Subscribe Now
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-amber-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro</h3>
            <p className="text-4xl font-bold text-amber-600 mb-6">
              $19.99<span className="text-lg font-normal text-gray-600">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Everything in Standard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700"><strong>API access</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">White-label options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Business analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Export data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Custom reports</span>
              </li>
            </ul>
            <button 
              onClick={() => handleCheckout('pro', 'price_pro')}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:from-amber-600 hover:to-amber-700"
            >
              Subscribe Now
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 shadow">
              <summary className="font-semibold text-gray-800 cursor-pointer">Can I cancel anytime?</summary>
              <p className="mt-3 text-gray-600">Yes! Cancel anytime, no questions asked. Your subscription stays active until the end of your billing period.</p>
            </details>
            <details className="bg-white rounded-xl p-6 shadow">
              <summary className="font-semibold text-gray-800 cursor-pointer">What payment methods do you accept?</summary>
              <p className="mt-3 text-gray-600">We accept all major credit cards, debit cards, and digital wallets through Stripe.</p>
            </details>
            <details className="bg-white rounded-xl p-6 shadow">
              <summary className="font-semibold text-gray-800 cursor-pointer">Is there a free trial?</summary>
              <p className="mt-3 text-gray-600">Yes! The Free tier includes 5 AI conversations per month. Try it risk-free before upgrading.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}