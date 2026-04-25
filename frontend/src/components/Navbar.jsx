export default function Navbar() {
  return (
    <nav style={{
      background: '#1a1d27',
      borderBottom: '1px solid #2d3148',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #1D9E75, #185FA5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px'
        }}>🛡️</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>
            FraudGuard AI
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>
            XGBoost Fraud Detection System
          </div>
        </div>
      </div>
      <div style={{
        background: '#0f1117',
        border: '1px solid #1D9E75',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        color: '#1D9E75',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{
          width: '7px', height: '7px',
          borderRadius: '50%', background: '#1D9E75',
          display: 'inline-block',
          animation: 'pulse 2s infinite'
        }}></span>
        API Online
      </div>
    </nav>
  )
}