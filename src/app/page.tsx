import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Database, 
  Brain, 
  Upload, 
  TrendingUp, 
  Users, 
  Shield,
  Zap,
  Target
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            The Global Performance Horse Ledger
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Track runs, payouts, bloodlines, and ownership across barrel racing, roping, 
            reining, cutting, and more. Ask Horse.AI anything about horses. 
            Get instant answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Join Now for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Answer to Everything</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, powerful tools for tracking performance, bloodlines, and ownership
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant CSV Upload</h3>
              <p className="text-gray-600">
                Upload your data instantly with AI-powered validation and mapping. 
                Unlimited rows, automatic verification.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Breeding Recommendations</h3>
              <p className="text-gray-600">
                Get intelligent breeding suggestions powered by advanced AI analysis 
                of bloodlines, performance, and market trends.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Data Import</h3>
              <p className="text-gray-600">
                Import your event results, pedigrees, and performance data. 
                Earn points for verified uploads.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-gray-600">
                Advanced analytics and trend analysis to optimize your breeding 
                and training decisions.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Horse Profiles</h3>
              <p className="text-gray-600">
                Build your personal database of horses. Upload pedigrees, 
                track performance, save everything.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Chat Interface</h3>
              <p className="text-gray-600">
                Ask anything about horses. Get instant answers about bloodlines, 
                breeding, performance, and more.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <Card className="relative h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-4">$0<span className="text-lg text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500 mr-2" />
                    Basic horse profiles
                  </li>
                  <li className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500 mr-2" />
                    10 messages every 2 hours
                  </li>
                  <li className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500 mr-2" />
                    Unlimited CSV uploads
                  </li>
                  <li className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500 mr-2" />
                    Create horse profiles
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link href="/auth/signup">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Mid Tier */}
            <Card className="relative border-2 border-primary-500 h-full flex flex-col">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-3 py-0.5 rounded text-xs font-medium tracking-wide">
                  POPULAR
                </span>
              </div>
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Mid</h3>
                <div className="text-4xl font-bold mb-4">$9.99<span className="text-lg text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary-500 mr-2" />
                    Everything in Free
                  </li>
                  <li className="flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary-500 mr-2" />
                    50 messages per 2 hours
                  </li>
                  <li className="flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary-500 mr-2" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary-500 mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary-500 mr-2" />
                    Custom reports
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link href="/auth/signup">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Pro Tier */}
            <Card className="relative h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">$19.99<span className="text-lg text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500 mr-2" />
                    Everything in Mid
                  </li>
                  <li className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500 mr-2" />
                    Unlimited messages
                  </li>
                  <li className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500 mr-2" />
                    First access to leads
                  </li>
                  <li className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500 mr-2" />
                    Featured placement
                  </li>
                  <li className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500 mr-2" />
                    Dedicated support
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link href="/auth/signup">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade to Pro</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start free. Ask questions. Upload data. See everything in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Join Now for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
