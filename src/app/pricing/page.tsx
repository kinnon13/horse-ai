'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Check, 
  X, 
  Zap, 
  Target, 
  Crown,
  Star,
  ArrowRight
} from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      'Basic horse profiles',
      '10 messages every 2 hours',
      'Unlimited CSV uploads',
      'Create horse profiles',
      'Basic analytics'
    ],
    limitations: [
      'Limited messages',
      'Basic support'
    ],
    buttonText: 'Get Started Free',
    popular: false,
    color: 'gray'
  },
  {
    name: 'Mid',
    price: 9.99,
    period: 'month',
    description: 'Most popular for power users',
    features: [
      'Everything in Free',
      '50 messages per 2 hours',
      'Unlimited CSV uploads',
      'VERIFIED badge',
      'Advanced analytics',
      'Priority support',
      'Breeding recommendations',
      'Performance insights',
      'Custom reports',
      'API access'
    ],
    limitations: [],
    buttonText: 'Start Free Trial',
    popular: true,
    color: 'blue'
  },
  {
    name: 'Pro',
    price: 19.99,
    period: 'month',
    description: 'For professionals and teams',
    features: [
      'Everything in Mid',
      'Unlimited messages',
      'Unlimited CSV uploads',
      'Custom reports',
      'API access',
      'First access to leads',
      'Featured placement',
      'Dedicated support'
    ],
    limitations: [],
    buttonText: 'Upgrade to Pro',
    popular: false,
    color: 'purple'
  }
]

export default function PricingPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleUpgrade = async (planName: string) => {
    if (!user) {
      // Redirect to sign up
      window.location.href = '/auth/signup'
      return
    }

    setIsLoading(planName)
    
    try {
      // In a real app, this would call your Stripe API
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: planName === 'Mid' ? 'price_mid' : 'price_pro',
          userId: user.id,
          userEmail: user.email,
          userName: user.user_metadata?.full_name
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-primary-500">HorseGPT</span> Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get unlimited access to the world's most advanced horse AI. 
            Ask anything about horses, breeding, training, and more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${
                plan.popular 
                  ? 'border-2 border-primary-500 shadow-lg scale-105' 
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-3 py-0.5 rounded text-xs font-medium tracking-wide">
                    POPULAR
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {plan.name === 'Free' && <Zap className="w-6 h-6 text-gray-500 mr-2" />}
                  {plan.name === 'Intro' && <Target className="w-6 h-6 text-primary-500 mr-2" />}
                  {plan.name === 'Pro' && <Crown className="w-6 h-6 text-purple-500 mr-2" />}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center">
                        <X className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <div className="pt-4">
                  <Button
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary-600 hover:bg-primary-700' 
                        : plan.name === 'Free'
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={isLoading === plan.name}
                  >
                    {isLoading === plan.name ? (
                      'Processing...'
                    ) : (
                      <>
                        {plan.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. 
                Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What happens to my data?</h3>
              <p className="text-gray-600">
                Your data is always safe with us. Even if you downgrade, 
                your data remains accessible.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. 
                No questions asked.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a 14-day free trial. 
                No credit card required to start.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of breeders, owners, and trainers using Horse.AI
          </p>
          <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
            Start Free Trial
          </Button>
        </div>
      </div>
    </div>
  )
}
