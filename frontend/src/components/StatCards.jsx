export default function StatCards({ stats }) {
  const cards = [
    {
      label: 'Total Transactions',
      value: stats?.total_transactions ?? 0,
      icon: '💳',
      color: '#185FA5',
      bg: '#0d2137'
    },
    {
      label: 'Frauds Detected',
      value: stats?.total_fraud ?? 0,
      icon: '🚨',
      color: '#D85A30',
      bg: '#1f0d08'
    },
    {
      label: 'Fraud Rate',
      value: `${stats?.fraud_rate ?? 0}%`,
      icon: '📊',
      color: '#BA7517',
      bg: '#1f1508'
    },
    {
      label: 'Model AUC-ROC',
      value: '0.9997',
      icon: '🎯',
      color: '#1D9E75',
      bg: '#071a13'
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: '#1a1d27',
          border: `1px solid ${card.color}33`,
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {card.label}
            </span>
            <span style={{
              background: card.bg,
              border: `1px solid ${card.color}44`,
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '16px'
            }}>{card.icon}</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: card.color }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  )
}