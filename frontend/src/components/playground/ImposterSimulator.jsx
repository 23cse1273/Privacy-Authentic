import React, { useState } from 'react';
import { UserX, Zap, RotateCcw, AlertTriangle, Bug, Terminal } from 'lucide-react';
import { useRisk } from '../../context/RiskContext';

export default function ImposterSimulator() {
  const { isImposterMode, setIsImposterMode, riskScore, decision } = useRisk();
  const [selectedAnomalyScenario, setSelectedAnomalyScenario] = useState('hesitant_intruder');

  const handleToggle = () => {
    setIsImposterMode(!isImposterMode);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Interactive Testing Suite</span>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <UserX className="w-5 h-5 text-red-400" />
            <span>Imposter & Attack Simulator</span>
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          Evaluator Mode
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Inject simulated attacker interaction telemetry into the pipeline to test whether the continuous anomaly detector and adaptive MFA trigger as designed.
      </p>

      {/* Toggle Imposter Mode Switch */}
      <div className={`p-4 rounded-xl border transition-all mb-4 ${
        isImposterMode
          ? 'bg-red-500/10 border-red-500/40 text-red-300'
          : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isImposterMode ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {isImposterMode ? 'Imposter Anomaly Injection Active' : 'Normal Genuine Session'}
              </p>
              <p className="text-xs text-slate-400">
                {isImposterMode ? 'Perturbing telemetry with anomalous dynamics' : 'Observing authentic user patterns'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isImposterMode
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {isImposterMode ? 'Disable Attack' : 'Simulate Imposter'}
          </button>
        </div>
      </div>

      {/* Quick Anomaly Presets */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Simulated Threat Profiles
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => { setSelectedAnomalyScenario('hesitant_intruder'); setIsImposterMode(true); }}
            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
              isImposterMode && selectedAnomalyScenario === 'hesitant_intruder'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <p className="font-semibold text-white">1. Hesitant Intruder</p>
            <p className="text-[10px] text-slate-400 mt-0.5">High flight latency (+190%)</p>
          </button>

          <button
            onClick={() => { setSelectedAnomalyScenario('automated_bot'); setIsImposterMode(true); }}
            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
              isImposterMode && selectedAnomalyScenario === 'automated_bot'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <p className="font-semibold text-white">2. Synthetic Bot</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Zero variance, uniform timing</p>
          </button>

          <button
            onClick={() => { setSelectedAnomalyScenario('erratic_mouse'); setIsImposterMode(true); }}
            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
              isImposterMode && selectedAnomalyScenario === 'erratic_mouse'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <p className="font-semibold text-white">3. Erratic Jitter</p>
            <p className="text-[10px] text-slate-400 mt-0.5">High curvature & acceleration</p>
          </button>
        </div>
      </div>
    </div>
  );
}
