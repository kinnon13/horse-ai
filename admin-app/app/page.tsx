import MissionControl from '../components/MissionControl'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#0f0' }}>
      <div style={{ padding: '20px', borderBottom: '2px solid #0f0' }}>
        <h1>🚀 HORSEGPT COMMAND CENTER</h1>
        <Link href="/kill-switch" style={{ color: '#f00', marginLeft: '20px' }}>
          ⚠️ KILL SWITCH
        </Link>
        <Link href="/oracle" style={{ color: '#0ff', marginLeft: '20px' }}>
          🔮 ORACLE AI
        </Link>
      </div>
      <MissionControl />
    </div>
  )
}