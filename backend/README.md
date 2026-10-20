# Privacy-Preserving Continuous User Authentication — Backend API

FastAPI backend providing real-time behavioral biometric anomaly detection, dynamic risk scoring, Explainable AI (XAI) feature attribution, and adaptive TOTP-based Step-Up MFA.

---

## 📁 Directory Architecture

```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes_auth.py       # Login, registration, token issue, MFA verify/setup
│   │   ├── routes_telemetry.py  # REST batch evaluation, calibration, baseline profile, audit logs
│   │   └── websocket_handler.py # Real-time full-duplex WebSocket stream (/ws/continuous-auth)
│   ├── models/                  # SQLAlchemy ORM Database Models
│   │   ├── __init__.py
│   │   ├── user.py              # User credentials, MFA secret & calibration flag
│   │   ├── baseline.py          # Calibrated legitimate biometric vectors
│   │   ├── session.py           # Active sessions & continuous risk status
│   │   └── audit.py             # Security audit logs with XAI attribution records
│   ├── schemas/                 # Pydantic Request/Response Validation Schemas
│   │   ├── __init__.py
│   │   ├── auth.py              # UserRegister, UserLogin, TokenResponse, MfaVerifyRequest
│   │   ├── telemetry.py         # BiometricFeaturesSchema (zero-character privacy model)
│   │   └── risk.py              # RiskEvaluationResponse, XaiExplanationItem, BaselineResponse
│   ├── services/                # Core Business Logic & Machine Learning Engines
│   │   ├── __init__.py
│   │   ├── auth_service.py      # Bcrypt hashing, JWT generation/validation, TOTP MFA
│   │   ├── ml_detector.py       # Scikit-Learn Isolation Forest anomaly baseline model
│   │   ├── risk_engine.py       # Exponential moving average (EMA) smoothing & adaptive actions
│   │   └── xai_explainer.py     # Explainable AI feature attribution & deviation ranking
│   ├── config.py                # Environment configuration, database URL, and thresholds
│   ├── database.py              # SQLAlchemy engine, session maker, and table initializers
│   └── main.py                  # FastAPI app factory, CORS, and lifecycle setup
├── requirements.txt             # Documented Python dependencies
├── run.py                       # Easy launch script (starts Uvicorn on port 8000)
└── README.md
```

---

## 🔬 Machine Learning & Explainable AI (XAI) Pipeline

1. **Multimodal Fusion Vector**:
   Receives privacy-conscious statistical features:
   * Key dwell time mean & variance ($\text{ms}$)
   * Inter-key flight time mean & variance ($\text{ms}$)
   * Typing cadence ($\text{KPM}$)
   * Mouse velocity mean & peak ($\text{px/ms}$)
   * Mouse acceleration ($\text{px/ms}^2$)
   * Trajectory curvature ratio
   * Click duration & idle rest ratios
2. **Isolation Forest Anomaly Baseline**:
   Trained on the genuine user's calibrated behavioral distribution. Deviations produce a normalized anomaly score $s \in [0.0, 1.0]$.
3. **Dynamic Risk Smoothing**:
   $$Risk_t = \alpha \cdot InstantRisk + (1 - \alpha) \cdot Risk_{t-1} \quad (\alpha = 0.35)$$
   Prevents erratic reactions to single noisy movements.
4. **Adaptive Response Policy**:
   * $Risk < 45\%$: `CONTINUE` (benign session)
   * $45\% \le Risk < 75\%$: `STEP_UP_MFA` (triggers adaptive 6-digit TOTP challenge)
   * $Risk \ge 75\%$: `RESTRICT` (session locked)
5. **XAI Attribution**:
   Provides quantified SHAP-style percentage shifts and impact scores identifying the exact behavioral signals that caused risk elevation.

---

## 🚀 Running the Backend

### 1. Launch with Python
```powershell
cd c:\Projects\Privacy_authentication\backend
python run.py
```
Or directly with Uvicorn:
```powershell
uvicorn app.main:app --reload --port 8000
```

### 2. Interactive Swagger / OpenAPI Documentation
Once the server is running, open:
* **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🗄️ Database Configuration

By default, the backend runs seamlessly out-of-the-box with **SQLite** (`pca_database.db`).

To switch to **PostgreSQL** (as described in the synopsis), set the environment variable:
```powershell
$env:DATABASE_URL = "postgresql://username:password@localhost:5432/pca_db"
```
Tables and initial seed records are automatically generated on first launch.
