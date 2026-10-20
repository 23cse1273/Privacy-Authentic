# Privacy-Preserving Continuous User Authentication Using Multimodal Behavioral Biometrics

Bachelor of Technology in Computer Science & Engineering  
**CGC University, Mohali**

An end-to-end continuous authentication system that monitors ongoing web sessions using privacy-conscious behavioral biometrics (keystroke dynamics, mouse movement, and interaction cadence), dynamic risk scoring with **Isolation Forest**, Explainable AI (**XAI**) factor attribution, and adaptive **Step-Up TOTP MFA**.

---

## 🏛️ Project Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │          React.js Client Application         │
                      │  - Privacy-Conscious Telemetry Collectors    │
                      │  - Real-Time Recharts Security Dashboard     │
                      │  - Interactive Testing Sandbox & Simulator   │
                      └──────────────────────┬───────────────────────┘
                                             │  (WebSocket / HTTP JSON)
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │               FastAPI Gateway                │
                      │  - JWT Session & Lifecycle Manager           │
                      │  - Biometric Vector Deserializer             │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────▼───────────────────────┐
                      │    Feature Extraction & Multimodal Fusion    │
                      │  - Dwell/Flight Timing, Cadence (KPM)        │
                      │  - Mouse Speed, Acceleration, Curvature      │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────▼───────────────────────┐
                      │     Machine Learning Anomaly Detection       │
                      │  - Scikit-Learn Isolation Forest             │
                      │  - User-Calibrated Legitimate Baseline       │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────▼───────────────────────┐
                      │      Dynamic Risk Engine & Smoothing         │
                      │  - Exponential Moving Average (EMA)          │
                      │  - Threshold Policies (<45 / 45-74 / >=75)   │
                      └──────────────┬───────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│       Explainable AI (XAI)           │    │       Adaptive Action Layer          │
│ - Quantified Attribution Impacts     │    │ - Low Risk: CONTINUE                 │
│ - Top Biometric Deviation Drivers    │    │ - Medium Risk: STEP-UP MFA (TOTP)    │
│ - Full Compliance Audit Trail        │    │ - High Risk: RESTRICT / LOCKOUT      │
└──────────────────────────────────────┘    └──────────────────────────────────────┘
```

---

## 📁 Repository Directory Structure

```
c:\Projects\Privacy_authentication\
├── frontend/                        # React 18 + Vite + Tailwind + Recharts
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                # Login, Register, Adaptive MFA Challenge Modal
│   │   │   ├── common/              # Navbar, Privacy Pledge Banner
│   │   │   ├── dashboard/           # Risk Gauge, Timeline, Radar Chart, XAI Panel, Audit Table
│   │   │   └── playground/          # Testing Sandbox, Calibration Assistant, Imposter Simulator
│   │   ├── context/                 # AuthContext, RiskContext, TelemetryContext
│   │   ├── hooks/                   # useKeystrokeCollector, useMouseCollector (Zero Keylogging)
│   │   ├── pages/                   # DashboardPage, PlaygroundPage, PrivacyAuditPage, LoginPage
│   │   ├── services/                # api.js, websocketService.js, telemetryExtractor.js, standaloneSimulator.js
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
│
├── backend/                         # FastAPI + Scikit-Learn + SQLAlchemy + SQLite/Postgres
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes_auth.py       # User auth, JWT token, TOTP setup/verify
│   │   │   ├── routes_telemetry.py  # REST feature evaluation, calibration, baseline, audit
│   │   │   └── websocket_handler.py # Full-duplex WebSocket stream (/ws/continuous-auth)
│   │   ├── models/                  # User, BehavioralBaseline, ActiveSession, AuditLog
│   │   ├── schemas/                 # Pydantic request/response validation
│   │   ├── services/                # AuthService, AnomalyDetector (Isolation Forest), RiskEngine, XaiExplainer
│   │   ├── config.py                # Environment settings & threshold configuration
│   │   ├── database.py              # SQLAlchemy engine & session maker
│   │   └── main.py                  # FastAPI application entry & CORS
│   ├── run.py                       # Uvicorn launcher script
│   ├── test_pipeline.py             # Pipeline test script
│   ├── requirements.txt             # Documented dependencies
│   └── README.md
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Launch Backend (FastAPI)
In a terminal:
```powershell
cd c:\Projects\Privacy_authentication\backend
python run.py
```
* Server URL: `http://localhost:8000`
* Interactive API Documentation (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Launch Frontend (React + Vite)
In a second terminal:
```powershell
cd c:\Projects\Privacy_authentication\frontend
npm run dev
```
* Web Dashboard: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Demonstration & Testing Workflow

1. **Pre-configured Evaluator Account**:
   * **Email**: `manpreet@cgc.edu.in`
   * **Password**: `Password@123`
   *(Auto-created on launch or pre-filled on login screen)*

2. **Evaluate Normal Baseline**:
   * Navigate to the **Testing Sandbox** tab.
   * Type in the interactive notepad or use the **Calibration Assistant**.
   * Observe the **Continuous Risk Score** staying low (green, < 25%).

3. **Simulate Attacker Takeover**:
   * In the **Testing Sandbox**, toggle **Simulate Imposter** (or select a threat scenario like *Hesitant Intruder* or *Synthetic Bot*).
   * Notice the **Dynamic Risk Score** elevate in real time.
   * Review the **Explainable AI (XAI)** panel to see the exact signals that triggered the alert (e.g., flight time +220%, mouse curvature +140%).
   * When risk exceeds 45%, the **Adaptive Step-Up MFA Challenge** appears.
   * Enter the TOTP code (or click the testing tip code `123456`) to verify identity and observe the session restore to normal baseline.
