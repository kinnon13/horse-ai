import MissionControl from '../components/MissionControl'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#0f0' }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '2px solid #0f0', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '15px' }}>🚀 HORSEGPT COMMAND CENTER</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <Link href="/oracle" style={{ color: '#0ff', textDecoration: 'none', fontSize: '16px', padding: '10px', background: '#111', border: '1px solid #0ff', borderRadius: '8px' }}>
            🔮 Oracle AI
          </Link>
          <Link href="/research" style={{ color: '#0f0', textDecoration: 'none', fontSize: '16px', padding: '10px', background: '#111', border: '1px solid #0f0', borderRadius: '8px' }}>
            🔬 Research Control
          </Link>
          <Link href="/users" style={{ color: '#ff0', textDecoration: 'none', fontSize: '16px', padding: '10px', background: '#111', border: '1px solid #ff0', borderRadius: '8px' }}>
            👥 User Monitoring
          </Link>
          <Link href="/theme" style={{ color: '#f0f', textDecoration: 'none', fontSize: '16px', padding: '10px', background: '#111', border: '1px solid #f0f', borderRadius: '8px' }}>
            🎨 Theme Editor
          </Link>
          <Link href="/features" style={{ color: '#0f0', textDecoration: 'none', fontSize: '16px', padding: '10px', background: '#111', border: '1px solid #0f0', borderRadius: '8px' }}>
            🚩 Feature Flags
          </Link>
          <Link href="/emails" style={{ color: '#0ff', textDecoration: 'none', fontSize: '16px', padding: '10px', background: '#111', border: '1px solid #0ff', borderRadius: '8px' }}>
            📧 Email Templates
          </Link>
          <Link href="/content" style={{ color: '#ff0', textDecoration: 'none', fontSize: '16px', padding: '10px', background: '#111', border: '1px solid #ff0', borderRadius: '8px' }}>
            📝 Content Manager
          </Link>
          <Link href="/kill-switch" style={{ color: '#f00', textDecoration: 'none', fontSize: '16px', padding: '10px', background: '#111', border: '2px solid #f00', borderRadius: '8px' }}>
            ⚠️ KILL SWITCH
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div style={{ padding: '20px', border: '2px solid #0f0', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>1,247</div>
            <div style={{ color: '#888' }}>Total Users</div>
          </div>
          <div style={{ padding: '20px', border: '2px solid #0f0', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f0' }}>892</div>
            <div style={{ color: '#888' }}>Active Today</div>
          </div>
          <div style={{ padding: '20px', border: '2px solid #ff0', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff0' }}>$18.4K</div>
            <div style={{ color: '#888' }}>MRR</div>
          </div>
          <div style={{ padding: '20px', border: '2px solid #0ff', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0ff' }}>94%</div>
            <div style={{ color: '#888' }}>AI Accuracy</div>
          </div>
        </div>
      </div>

      <MissionControl />
    </div>
  )
}