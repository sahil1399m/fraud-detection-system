import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import StatCards from './components/StatCards'
import RocChart from './components/RocChart'
import TransactionTable from './components/TransactionTable'
import PredictForm from './components/PredictForm'

const API = 'http://127.0.0.1:8000'

export default function App() {
  const [stats, setStats]               = useState(null)
  const [transactions, setTransactions] = useState([])

  const fetchData = async () => {
    try {
      const [statsRes, txRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/transactions`)
      ])
      setStats(statsRes.data)
      setTransactions(txRes.data.transactions)
    } catch (e) {
      console.log('API not reachable yet')
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // refresh every 5s
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>
            Fraud Detection Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            Real-time credit card fraud detection powered by XGBoost · 284,807 transactions trained · AUC-ROC 0.9997
          </p>
        </div>

        {/* Stats */}
        <StatCards stats={stats} />

        {/* ROC Curve */}
        <RocChart />

        {/* Predictor */}
        <PredictForm onNewPrediction={fetchData} />

        {/* Recent Transactions */}
        <TransactionTable transactions={transactions} />

        {/* Footer */}
        <div style={{
          textAlign: 'center', padding: '1.5rem 0',
          fontSize: '12px', color: '#374151',
          borderTop: '1px solid #1a1d27', marginTop: '0.5rem'
        }}>
          FraudGuard AI · Built with XGBoost + FastAPI + React · VJTI Final Year Project
        </div>
      </main>
    </div>
  )
}