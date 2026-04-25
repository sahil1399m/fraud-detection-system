from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os
from datetime import datetime
from models import TransactionInput, PredictionOutput

# ── App setup ──────────────────────────────────────────────
app = FastAPI(
    title="Fraud Detection API",
    description="AI-powered credit card fraud detection system",
    version="1.0.0"
)

# ── CORS — allows React frontend to call this API ──────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model and scaler on startup ───────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH  = os.path.join(BASE_DIR, "models", "xgb_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

model  = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# ── In-memory store for recent predictions ─────────────────
recent_transactions = []

# ── Helper: get risk level from probability ────────────────
def get_risk_level(prob: float) -> str:
    if prob >= 0.80:
        return "HIGH"
    elif prob >= 0.50:
        return "MEDIUM"
    elif prob >= 0.30:
        return "LOW"
    else:
        return "SAFE"

# ══════════════════════════════════════════════════════════
#  ENDPOINTS
# ══════════════════════════════════════════════════════════

# 1. Health check
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "model": "XGBoost Fraud Detector v1.0",
        "timestamp": datetime.now().isoformat()
    }

# 2. Predict fraud
@app.post("/predict", response_model=PredictionOutput)
def predict(transaction: TransactionInput):
    # Convert to numpy array in correct order
    features = np.array([[
        transaction.Time,
        transaction.V1,  transaction.V2,  transaction.V3,
        transaction.V4,  transaction.V5,  transaction.V6,
        transaction.V7,  transaction.V8,  transaction.V9,
        transaction.V10, transaction.V11, transaction.V12,
        transaction.V13, transaction.V14, transaction.V15,
        transaction.V16, transaction.V17, transaction.V18,
        transaction.V19, transaction.V20, transaction.V21,
        transaction.V22, transaction.V23, transaction.V24,
        transaction.V25, transaction.V26, transaction.V27,
        transaction.V28, transaction.Amount
    ]])

    # Scale features
    features_scaled = scaler.transform(features)

    # Predict
    fraud_prob = float(model.predict_proba(features_scaled)[0][1])
    is_fraud   = fraud_prob >= 0.50
    risk_level = get_risk_level(fraud_prob)

    # Build message
    if is_fraud:
        message = f"⚠️ FRAUD DETECTED — {fraud_prob*100:.1f}% probability"
    else:
        message = f"✅ Transaction appears legitimate — {fraud_prob*100:.1f}% fraud probability"

    # Store in recent transactions
    recent_transactions.append({
        "timestamp"        : datetime.now().isoformat(),
        "amount"           : transaction.Amount,
        "fraud_probability": round(fraud_prob, 4),
        "is_fraud"         : is_fraud,
        "risk_level"       : risk_level
    })

    # Keep only last 50
    if len(recent_transactions) > 50:
        recent_transactions.pop(0)

    return PredictionOutput(
        fraud_probability=round(fraud_prob, 4),
        is_fraud=is_fraud,
        risk_level=risk_level,
        message=message
    )

# 3. Get recent transactions
@app.get("/transactions")
def get_transactions():
    return {
        "total"       : len(recent_transactions),
        "transactions": list(reversed(recent_transactions))
    }

# 4. Get summary stats
@app.get("/stats")
def get_stats():
    if not recent_transactions:
        return {
            "total_transactions": 0,
            "total_fraud"       : 0,
            "fraud_rate"        : 0,
            "avg_fraud_prob"    : 0
        }

    total = len(recent_transactions)
    frauds = sum(1 for t in recent_transactions if t["is_fraud"])
    avg_prob = sum(t["fraud_probability"] for t in recent_transactions) / total

    return {
        "total_transactions": total,
        "total_fraud"       : frauds,
        "fraud_rate"        : round(frauds / total * 100, 2),
        "avg_fraud_prob"    : round(avg_prob, 4)
    }