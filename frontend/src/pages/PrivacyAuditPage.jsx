import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Lock, EyeOff, FileText, Database, Server } from 'lucide-react';

export default function PrivacyAuditPage() {
  const allowedSignals = [
    { name: 'Key Dwell Time', desc: 'Milliseconds between keydown and keyup for an anonymous key event.' },
    { name: 'Inter-Key Flight Time', desc: 'Milliseconds between releasing one key and pressing the subsequent key.' },
    { name: 'Typing Cadence (KPM)', desc: 'Total anonymous key events per minute rate.' },
    { name: 'Mouse Velocity & Acceleration', desc: 'Displacement per millisecond (px/ms) without screen capture.' },
    { name: 'Trajectory Curvature', desc: 'Ratio between total mouse trajectory length and straight-line displacement.' },
    { name: 'Click Hold Duration', desc: 'Milliseconds between mousedown and mouseup.' },
    { name: 'Idle Rest Ratio', desc: 'Proportion of sliding window time without cursor movement.' },
  ];

  const prohibitedSignals = [
    { name: 'Raw Keystrokes & Characters', desc: 'Zero recording of keys typed (e.g. letters, numbers, symbols, backspaces).' },
    { name: 'Passwords & Input Values', desc: 'Passwords and form text inputs are completely excluded from behavioral datasets.' },
    { name: 'Screen Captures / Video', desc: 'No screen recording, window content scraping, or optical sensors used.' },
    { name: 'Webcam / Facial Recognition', desc: 'No biometric camera or facial recognition streams needed.' },
    { name: 'Voice / Audio Streams', desc: 'No microphone recording or ambient audio surveillance.' },
    { name: 'Browsing URLs / History', desc: 'No navigation tracking outside the authenticated web session.' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Privacy Architecture & Compliance Ledger</h1>
            <p className="text-xs text-slate-400">Formal verification of privacy guarantees under NIST SP 800-63B-4 session monitoring guidelines</p>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Allowed vs Prohibited */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Permitted Derived Signals */}
        <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-6 shadow-xl shadow-emerald-500/5">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <span>Permitted Derived Telemetry (Anonymized)</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Only statistical temporal and spatial interaction characteristics are computed locally and transmitted:
          </p>

          <div className="space-y-3">
            {allowedSignals.map((item, idx) => (
              <div key={idx} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
                <span className="text-xs font-semibold text-emerald-300 block">{item.name}</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strictly Excluded Signals */}
        <div className="bg-slate-900/90 rounded-2xl border border-red-500/30 p-6 shadow-xl shadow-red-500/5">
          <div className="flex items-center space-x-2 text-red-400 font-bold text-sm uppercase tracking-wider mb-4">
            <XCircle className="w-5 h-5" />
            <span>Strictly Prohibited & Excluded Signals</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            To prevent invasive surveillance and credential exposure, the following are structurally never captured:
          </p>

          <div className="space-y-3">
            {prohibitedSignals.map((item, idx) => (
              <div key={idx} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
                <span className="text-xs font-semibold text-red-300 block">{item.name}</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Operational Pipeline Architecture Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Operational Pipeline Data Flow (Synopsis Figure 1)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-2.5">
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">STAGE 1</span>
            <span className="text-slate-200 font-medium">Login & MFA</span>
          </div>
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-2.5">
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">STAGE 2</span>
            <span className="text-slate-200 font-medium">Baseline Calibration</span>
          </div>
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-2.5">
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">STAGE 3</span>
            <span className="text-slate-200 font-medium">Live Activity Telemetry</span>
          </div>
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-2.5">
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">STAGE 4</span>
            <span className="text-slate-200 font-medium">Multimodal Fusion</span>
          </div>
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-2.5">
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">STAGE 5</span>
            <span className="text-slate-200 font-medium">ML Anomaly Detection</span>
          </div>
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-2.5">
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">STAGE 6</span>
            <span className="text-slate-200 font-medium">Adaptive Security Action</span>
          </div>
        </div>
      </div>

    </div>
  );
}
