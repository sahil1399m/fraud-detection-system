export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div style={{
        background: '#1a1d27', border: '1px solid #2d3148',
        borderRadius: '12px', padding: '2rem', textAlign: 'center',
        color: '#6b7280', fontSize: '14px', marginBottom: '1.5rem'
      }}>
        No transactions yet — use the predictor below to test transactions!
      </div>
    )
  }

  return (
    <div style={{
      background: '#1a1d27', border: '1px solid #2d3148',
      borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem'
    }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #2d3148' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
          📋 Recent Transactions
        </h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#0f1117' }}>
              {['Timestamp', 'Amount', 'Fraud Prob', 'Risk', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: 'left',
                  color: '#6b7280', fontWeight: 500,
                  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i} style={{
                borderTop: '1px solid #2d3148',
                background: i % 2 === 0 ? 'transparent' : '#ffffff05'
              }}>
                <td style={{ padding: '10px 16px', color: '#9ca3af' }}>
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </td>
                <td style={{ padding: '10px 16px', color: '#fff', fontWeight: 500 }}>
                  ${tx.amount.toFixed(2)}
                </td>
                <td style={{ padding: '10px 16px', color: tx.is_fraud ? '#D85A30' : '#1D9E75', fontWeight: 600 }}>
                  {(tx.fraud_probability * 100).toFixed(2)}%
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    background: tx.risk_level === 'HIGH' ? '#1f0d08' : tx.risk_level === 'MEDIUM' ? '#1f1508' : tx.risk_level === 'LOW' ? '#07131a' : '#071a13',
                    color: tx.risk_level === 'HIGH' ? '#D85A30' : tx.risk_level === 'MEDIUM' ? '#BA7517' : tx.risk_level === 'LOW' ? '#185FA5' : '#1D9E75',
                    border: `1px solid ${tx.risk_level === 'HIGH' ? '#D85A30' : tx.risk_level === 'MEDIUM' ? '#BA7517' : tx.risk_level === 'LOW' ? '#185FA5' : '#1D9E75'}44`
                  }}>
                    {tx.risk_level}
                  </span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    background: tx.is_fraud ? '#1f0d08' : '#071a13',
                    color: tx.is_fraud ? '#D85A30' : '#1D9E75',
                    border: `1px solid ${tx.is_fraud ? '#D85A30' : '#1D9E75'}44`
                  }}>
                    {tx.is_fraud ? '🚨 FRAUD' : '✅ LEGIT'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}