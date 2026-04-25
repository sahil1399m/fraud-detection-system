import { useState } from 'react'
import axios from 'axios'

const API = 'http://127.0.0.1:8000'

const FRAUD_SAMPLE = {
  Time: 406, V1: -2.3122265, V2: 1.9519834, V3: -1.6098867,
  V4: 3.9979055, V5: -0.5220083, V6: -1.4265453, V7: -2.5373073,
  V8: 1.3919746, V9: -2.7700006, V10: -2.7722739, V11: 3.2020348,
  V12: -2.8996530, V13: -0.5952194, V14: -4.2894259, V15: 0.3897489,
  V16: -1.1402713, V17: -2.8300108, V18: -0.0167928, V19: 0.4169865,
  V20: 0.1269798, V21: 0.5173756, V22: -0.0350493, V23: -0.4659641,
  V24: 0.3200395, V25: 0.0445192, V26: 0.1774480, V27: 0.2613956,
  V28: -0.1436280, Amount: 149.62
}

const LEGIT_SAMPLE = {
  Time: 10000, V1: 1.191857, V2: 0.266151, V3: 0.166480, V4: 0.448154,
  V5: 0.060018, V6: -0.082361, V7: -0.078803, V8: 0.085102, V9: -0.255425,
  V10: -0.166974, V11: 1.612727, V12: 1.065235, V13: 0.489095, V14: -0.143772,
  V15: 0.635558, V16: 0.463917, V17: -0.114805, V18: -0.183361, V19: -0.145783,
  V20: -0.069083, V21: -0.225775, V22: -0.638672, V23: 0.101288, V24: -0.339846,
  V25: 0.167170, V26: 0.125895, V27: -0.008983, V28: 0.014724, Amount: 2.69
}

export default function PredictForm({ onNewPrediction }) {
  const [amount, setAmount]   = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const predict = async (sampleData) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload = sampleData || { ...LEGIT_SAMPLE, Amount: parseFloat(amount) || 100 }
      const res = await axios.post(`${API}/predict`, payload)
      setResult(res.data)
      onNewPrediction()
    } catch (e) {
      setError('API Error — make sure your FastAPI server is running on port 8000!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#1a1d27', border: '1px solid #2d3148',
      borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem'
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
        🔍 What-If Fraud Simulator
      </h3>
      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '1.25rem' }}>
        Test transactions against the live XGBoost model
      </p>

      {/* Quick test buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button onClick={() => predict(FRAUD_SAMPLE)} disabled={loading}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #D85A30',
            background: '#1f0d08', color: '#D85A30', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500
          }}>
          🚨 Test Fraud Transaction
        </button>
        <button onClick={() => predict(LEGIT_SAMPLE)} disabled={loading}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #1D9E75',
            background: '#071a13', color: '#1D9E75', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500
          }}>
          ✅ Test Legit Transaction
        </button>
      </div>

      {/* Custom amount */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="number"
          placeholder="Enter custom amount ($)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{
            flex: 1, padding: '8px 12px', borderRadius: '8px',
            border: '1px solid #2d3148', background: '#0f1117',
            color: '#fff', fontSize: '13px', outline: 'none'
          }}
        />
        <button onClick={() => predict(null)} disabled={loading || !amount}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #185FA5',
            background: '#0d2137', color: '#185FA5', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500,
            opacity: (!amount || loading) ? 0.5 : 1
          }}>
          Predict
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '13px' }}>
          ⏳ Analyzing transaction...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '1rem', padding: '12px', borderRadius: '8px',
          background: '#1f0d08', border: '1px solid #D85A3044',
          color: '#D85A30', fontSize: '13px'
        }}>{error}</div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          marginTop: '1rem', padding: '1.25rem', borderRadius: '10px',
          background: result.is_fraud ? '#1f0d08' : '#071a13',
          border: `1px solid ${result.is_fraud ? '#D85A30' : '#1D9E75'}44`
        }}>
          <div style={{
            fontSize: '20px', fontWeight: 700, marginBottom: '8px',
            color: result.is_fraud ? '#D85A30' : '#1D9E75'
          }}>
            {result.message}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '8px' }}>
            {[
              { label: 'Fraud Probability', value: `${(result.fraud_probability * 100).toFixed(2)}%` },
              { label: 'Risk Level', value: result.risk_level },
              { label: 'Decision', value: result.is_fraud ? 'BLOCK' : 'ALLOW' }
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: result.is_fraud ? '#D85A30' : '#1D9E75' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}