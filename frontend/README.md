# Privacy-Preserving Continuous User Authentication — Frontend

A modern React.js web client for continuous biometric session monitoring, dynamic risk evaluation, and Explainable AI (XAI) security dashboards.

Compliant with **NIST SP 800-63B-4** continuous session monitoring guidelines.

---

## 📁 Directory Structure & Architecture

```
frontend/
├── public/                 # Static web assets
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication & Step-Up MFA Dialogs
│   │   │   ├── LoginForm.jsx         # Sign in with JWT flow
│   │   │   ├── RegisterForm.jsx      # New user registration
│   │   │   └── MfaModal.jsx          # Adaptive TOTP 6-digit challenge
│   │   ├── common/         # Layout & Reusable Shell Elements
│   │   │   ├── Navbar.jsx            # Header, tab navigation, live risk pill
│   │   │   └── PrivacyPledgeBanner.jsx # NIST compliance assurance banner
│   │   ├── dashboard/      # Security Monitoring & Visualization (Recharts)
│   │   │   ├── RiskScoreCard.jsx     # Real-time circular risk gauge (0-100%)
│   │   │   ├── RiskTimelineChart.jsx # Time-series trend with MFA/Lock thresholds
│   │   │   ├── FeatureRadarChart.jsx # Multimodal radar (Baseline vs Active session)
│   │   │   ├── XaiExplanationPanel.jsx # SHAP-style anomaly contribution factors
│   │   │   └── AuditLogTable.jsx     # Event ledger of evaluation decisions
│   │   └── playground/     # Interactive Testing & Evaluation Sandbox
│   │       ├── InteractivePlayground.jsx # Mock banking/workspace app for natural typing
│   │       ├── CalibrationAssistant.jsx  # Guided baseline profile calibration
│   │       └── ImposterSimulator.jsx     # Attacker anomaly injection suite
│   ├── context/            # React Global State Providers
│   │   ├── AuthContext.jsx      # Session JWT, user profiles, MFA state
│   │   ├── RiskContext.jsx      # Dynamic risk score, history, XAI explanations
│   │   └── TelemetryContext.jsx # Global listeners, windowed aggregation & dispatch
│   ├── hooks/              # Custom Telemetry Collectors
│   │   ├── useKeystrokeCollector.js # Dwell & flight time capture (NO character logging)
│   │   └── useMouseCollector.js     # Speed, acceleration, & curvature metrics
│   ├── pages/              # Primary Application Views
│   │   ├── DashboardPage.jsx    # Real-time monitoring command center
│   │   ├── PlaygroundPage.jsx   # Testing lab with imposter simulation
│   │   ├── PrivacyAuditPage.jsx # Full compliance transparency report
│   │   └── LoginPage.jsx        # Login & user registration page
│   ├── services/           # Backend Communication & Processing Engines
│   │   ├── api.js                   # Axios HTTP client with JWT interceptor
│   │   ├── websocketService.js      # Full-duplex WebSocket stream
│   │   ├── telemetryExtractor.js    # Statistical feature extractor
│   │   └── standaloneSimulator.js   # In-browser statistical ML engine fallback
│   ├── App.jsx             # Root application assembly & provider hierarchy
│   ├── index.css           # Tailwind CSS directives & theme rules
│   └── main.jsx            # React 18 DOM mount point
├── package.json            # Dependencies & build scripts
├── tailwind.config.js      # Custom security styling palette
├── vite.config.js          # Vite build configuration
└── README.md
```

---

## 🔒 Privacy-Preserving Guarantee (Zero Keylogging)

This frontend strictly adheres to privacy safeguards:
1. **No Raw Keystrokes**: `event.key` and typed text are **never** stored, transmitted, or logged.
2. **Timing Signals Only**: Only relative millisecond intervals (dwell time and flight latency) are processed.
3. **Relative Cursor Dynamics**: Only cursor velocity, acceleration, and curvature ratio are extracted — not desktop screen content or keystroke inputs.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🧪 Testing the Adaptive Continuous Authentication

1. **Natural Interaction**: Navigate to the **Testing Sandbox** tab and type normally in the notepad. Notice how the risk remains low (< 20%) and the continuous status pill stays green.
2. **Simulate Attacker Takeover**: Click the **Simulate Imposter** button in the Imposter Simulator panel.
3. **Observe Adaptive Defense**:
   - The **Dynamic Risk Score** spikes past the 45% threshold.
   - The **Explainable AI (XAI)** panel immediately highlights which biometric signals diverged (e.g., flight time +190%, trajectory curvature +140%).
   - The **Adaptive Step-Up MFA Challenge** appears, requiring a 6-digit TOTP verification code to restore the session.
