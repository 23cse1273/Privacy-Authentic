import React from 'react';
import { HelpCircle, Sparkles, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useRisk } from '../../context/RiskContext';

export default function XaiExplanationPanel() {
  const { xaiExplanations, riskScore } = useRisk();

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Explainable AI (XAI)</span>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Anomaly Contribution Factors</span>
          </h2>
        </div>
        <span className="text-xs text-slate-400 flex items-center space-x-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>SHAP-style Feature Impact</span>
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Quantified attribution of behavioral shifts causing current risk score deviation from the legitimate user profile:
      </p>

      {xaiExplanations.length === 0 ? (
        <div className="py-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-700/60">
          <p className="text-xs text-emerald-400 font-medium">✓ All behavioral features are aligned within baseline tolerance.</p>
          <p className="text-[11px] text-slate-500 mt-1">No anomalous features detected in the current window.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {xaiExplanations.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                item.isHighRisk
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center space-x-2">
                  {item.percentDeviation > 0 ? (
                    <TrendingUp className={`w-4 h-4 ${item.isHighRisk ? 'text-red-400' : 'text-amber-400'}`} />
                  ) : (
                    <TrendingDown className={`w-4 h-4 ${item.isHighRisk ? 'text-red-400' : 'text-amber-400'}`} />
                  )}
                  <span className="font-semibold text-slate-200">{item.feature}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-mono text-xs font-bold ${item.isHighRisk ? 'text-red-400' : 'text-amber-400'}`}>
                    {item.percentDeviation > 0 ? `+${item.percentDeviation}%` : `${item.percentDeviation}%`}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    Impact: {item.impactScore}
                  </span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.isHighRisk ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(Math.abs(item.impactScore) * 12, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                <span>Baseline: <strong className="text-slate-300 font-mono">{item.baselineValue}</strong></span>
                <span>Active Window: <strong className="text-slate-300 font-mono">{item.liveValue}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
