import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  MessageSquare,
  Brain,
  TrendingUp,
  Users,
  Database,
  BarChart3
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ChatGPT-style Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐴</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">HorseGPT</h1>
          </div>
        </div>

        {/* Main Input Field - ChatGPT Style */}
        <div className="w-full max-w-3xl mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask HorseGPT anything about horses..."
              className="w-full px-6 py-4 pr-16 bg-white border-2 border-gray-300 rounded-2xl text-lg focus:outline-none focus:border-gray-400 transition-colors shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="w-full max-w-3xl mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Try asking:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">"What are the best breeding combinations for barrel racing?"</span>
              </div>
            </button>
            <button className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">"How do I improve my horse's barrel racing time?"</span>
              </div>
            </button>
            <button className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">"Explain horse nutrition for performance horses"</span>
              </div>
            </button>
            <button className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">"What's the bloodline of Dash Ta Fame?"</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sign In Prompt */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            <Link href="/auth/signin" className="text-blue-600 hover:underline">Sign in</Link> to save your conversations
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Link href="/auth/signup" className="hover:text-gray-700">Sign up</Link>
            <span>•</span>
            <Link href="/pricing" className="hover:text-gray-700">Pricing</Link>
            <span>•</span>
            <Link href="/chat" className="hover:text-gray-700">Start Chatting</Link>
          </div>
        </div>
      </div>

      {/* Capabilities Section - ChatGPT Style */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Horse Knowledge</h3>
              </div>
              <p className="text-gray-600">
                Comprehensive knowledge about horse breeds, bloodlines, training methods, 
                health care, and performance optimization.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Performance Analysis</h3>
              </div>
              <p className="text-gray-600">
                Analyze race times, breeding patterns, and performance data to help you 
                make informed decisions about your horses.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Breeding Guidance</h3>
              </div>
              <p className="text-gray-600">
                Get expert advice on breeding combinations, bloodline analysis, 
                and genetic considerations for your breeding program.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Data Insights</h3>
              </div>
              <p className="text-gray-600">
                Upload your horse data and get personalized insights, 
                trend analysis, and performance recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Limitations Section - ChatGPT Style */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Limitations</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">May occasionally generate incorrect information</h3>
                <p className="text-gray-600 text-sm">
                  HorseGPT can make mistakes. Consider checking important information about horse health, 
                  breeding, or performance data.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Limited knowledge of events after 2024</h3>
                <p className="text-gray-600 text-sm">
                  HorseGPT's knowledge is current up to 2024. For the latest race results, 
                  breeding news, or industry updates, verify with current sources.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">May occasionally produce harmful instructions</h3>
                <p className="text-gray-600 text-sm">
                  While HorseGPT is designed to be helpful, always consult with veterinarians 
                  and equine professionals for health and safety decisions.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Limited knowledge of specific horse records</h3>
                <p className="text-gray-600 text-sm">
                  While HorseGPT has extensive knowledge, it may not have access to all 
                  individual horse records or private breeding data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐴</span>
              </div>
              <span className="font-semibold text-gray-900">HorseGPT</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
              <Link href="/legal/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <Link href="/legal/terms" className="hover:text-gray-900">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}