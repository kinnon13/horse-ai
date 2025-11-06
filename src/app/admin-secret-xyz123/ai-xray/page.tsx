'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function AIXrayDashboard() {
  const [interactions, setInteractions] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInteractions()
    const interval = setInterval(loadInteractions, 5000)
    return () => clearInterval(interval)
  }, [])

  async function loadInteractions() {
    try {
      const { data, error } = await supabase
        .from('ai_interaction_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50)
      
      if (error) {
        console.error('Error loading interactions:', error)
        setInteractions([])
        setLoading(false)
        return
      }
      
      if (data) {
        setInteractions(data)
        setLoading(false)
      }
    } catch (err) {
      console.error('Failed to load interactions:', err)
      setInteractions([])
      setLoading(false)
    }
  }

  const stats = calculateStats(interactions)
  const needsSetup = !loading && interactions.length === 0

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🔍 AI X-Ray Dashboard</h1>
        <p className="text-gray-600">Real-time AI intelligence & tool usage</p>
      </div>

      {needsSetup && <SetupInstructions />}

      {interactions.length > 0 && (
        <>
          <StatsOverview stats={stats} />
          <InteractionsList interactions={interactions} selected={selected} setSelected={setSelected} />
        </>
      )}
    </div>
  )
}

function SetupInstructions() {
  return (
    <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
      <h2 className="text-xl font-bold text-yellow-800 mb-2">⚠️ Setup Required</h2>
      <p className="text-yellow-700 mb-4">
        The AI diagnostics table hasn't been created yet. Follow these steps:
      </p>
      
      <div className="bg-white p-4 rounded space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
            1
          </div>
          <div>
            <div className="font-semibold">Go to Supabase Dashboard</div>
            <div className="text-sm text-gray-600">
              Visit: <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">https://supabase.com/dashboard</a>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
            2
          </div>
          <div>
            <div className="font-semibold">Open SQL Editor</div>
            <div className="text-sm text-gray-600">
              Navigate to: SQL Editor → New Query
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
            3
          </div>
          <div>
            <div className="font-semibold">Copy & Run This SQL</div>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto mt-2">
              {`CREATE TABLE IF NOT EXISTS ai_interaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT, query TEXT NOT NULL,
  context_built JSONB, tools_used TEXT[],
  emotion_detected TEXT, strategy_used TEXT,
  response_provider TEXT, response_source TEXT,
  final_response TEXT, error_occurred BOOLEAN DEFAULT false,
  error_message TEXT, personalized_score INTEGER,
  missed_opportunities TEXT[], execution_time_ms INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_logs_user ON ai_interaction_logs(user_id);
CREATE INDEX idx_ai_logs_timestamp ON ai_interaction_logs(timestamp DESC);
GRANT ALL ON ai_interaction_logs TO authenticated, anon;`}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
            4
          </div>
          <div>
            <div className="font-semibold">Test Your Chat</div>
            <div className="text-sm text-gray-600">
              Send a message at <a href="/chat" className="text-cyan-600 hover:underline">/chat</a> then refresh this page
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsOverview({ stats }: any) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-cyan-600">{stats.avgPersonalization}%</div>
        <div className="text-sm text-gray-600">Avg Personalization</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-green-600">{stats.contextUsageRate}%</div>
        <div className="text-sm text-gray-600">Context Usage Rate</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-purple-600">{stats.emotionDetectionRate}%</div>
        <div className="text-sm text-gray-600">Emotion Detection</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-red-600">{stats.errorRate}%</div>
        <div className="text-sm text-gray-600">Error Rate</div>
      </div>
    </div>
  )
}

function InteractionsList({ interactions, selected, setSelected }: any) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-4 bg-white rounded-lg shadow p-4 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Recent ({interactions.length})</h2>
        {interactions.map((interaction: any) => (
          <div
            key={interaction.id}
            onClick={() => setSelected(interaction)}
            className={`border p-3 mb-2 cursor-pointer hover:bg-blue-50 rounded ${
              selected?.id === interaction.id ? 'bg-blue-100 border-blue-500' : ''
            }`}
          >
            <div className="font-medium text-sm">
              {interaction.user_id === 'anonymous' ? '👤 Anonymous' : `👤 ${interaction.user_id.slice(0, 8)}`}
            </div>
            <div className="text-sm text-gray-600 truncate">Q: {interaction.query}</div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {interaction.tools_used?.includes('context') && <Badge text="Context" color="green" />}
              {interaction.tools_used?.includes('emotion') && <Badge text="Emotion" color="purple" />}
              {interaction.tools_used?.includes('horses') && <Badge text="Horses" color="blue" />}
              {interaction.error_occurred && <Badge text="Error" color="red" />}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Score: {interaction.personalized_score}/100 • {interaction.execution_time_ms}ms
            </div>
          </div>
        ))}
      </div>

      <div className="col-span-8 bg-white rounded-lg shadow p-6 max-h-screen overflow-y-auto">
        {selected ? <DetailedView interaction={selected} /> : <EmptyState />}
      </div>
    </div>
  )
}

function Badge({ text, color }: { text: string; color: string }) {
  const colors: any = {
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800'
  }
  return <span className={`${colors[color]} px-2 py-0.5 text-xs rounded`}>{text}</span>
}

function DetailedView({ interaction }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">AI Decision Breakdown</h2>
      
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h3 className="font-bold text-gray-700">Query:</h3>
        <p className="mt-2">{interaction.query}</p>
      </div>

      {interaction.error_occurred && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded">
          <h3 className="font-bold text-red-700">🚨 ERROR:</h3>
          <p className="text-red-600 mt-2">{interaction.error_message}</p>
        </div>
      )}

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <h3 className="font-bold text-blue-700">Context Built:</h3>
        {interaction.context_built ? (
          <div className="mt-2 space-y-1 text-sm">
            <div>User: {interaction.context_built.userName || 'N/A'}</div>
            <div>Horses: {interaction.context_built.horses?.length || 0}</div>
            <div>Churn Risk: {((interaction.context_built.churnRisk || 0) * 100).toFixed(0)}%</div>
          </div>
        ) : (
          <p className="text-red-600 mt-2">❌ No context built</p>
        )}
      </div>

      <div className="mb-4 p-4 bg-green-50 rounded">
        <h3 className="font-bold text-green-700">Tools Used:</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {interaction.tools_used?.map((tool: string) => (
            <span key={tool} className="bg-green-200 px-3 py-1 rounded">✅ {tool}</span>
          ))}
          {!interaction.tools_used?.length && <span className="text-red-600">❌ No tools used</span>}
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-cyan-50 to-amber-50 rounded">
        <h3 className="font-bold">Quality Score:</h3>
        <div className="flex items-center gap-4 mt-2">
          <div className="text-4xl font-bold">{interaction.personalized_score}/100</div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-teal-600"
                style={{ width: `${interaction.personalized_score}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-gray-500">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl">Select an interaction to see details</p>
      </div>
    </div>
  )
}

function calculateStats(interactions: any[]) {
  if (interactions.length === 0) {
    return {
      avgPersonalization: 0,
      contextUsageRate: 0,
      emotionDetectionRate: 0,
      errorRate: 0
    }
  }

  return {
    avgPersonalization: Math.round(
      interactions.reduce((sum, i) => sum + (i.personalized_score || 0), 0) / interactions.length
    ),
    contextUsageRate: Math.round(
      (interactions.filter(i => i.tools_used?.includes('context')).length / interactions.length) * 100
    ),
    emotionDetectionRate: Math.round(
      (interactions.filter(i => i.emotion_detected).length / interactions.length) * 100
    ),
    errorRate: Math.round(
      (interactions.filter(i => i.error_occurred).length / interactions.length) * 100
    )
  }
}
