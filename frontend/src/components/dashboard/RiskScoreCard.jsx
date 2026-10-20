import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useRisk } from '../../context/RiskContext';

export default function RiskScoreCard() {
  const { riskScore, decision, statusMessage } = useRisk();

  // Dynamic visual parameters based on risk thresholds
  const getTheme = () => {
    if (riskScore >= 75 || decision === 'RESTRICT') {
      return {
        level: 'CRITICAL ANOMALY',
        badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
        strokeColor: '#ef4444',
        textColor: 'text-red-400',
        bgGlow: 'shadow-red-500/10 border-red-500/30',
        actionText: 'Session Restricted / Locked',
        icon: <ShieldX className="w-8 h-8 text-red-400" />,
      };
    }
    if (riskScore >= 45 || decision === 'STEP_UP_MFA') {
      return {
        level: 'ELEVATED RISK',
        badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        strokeColor: '#f59e0b',
        textColor: 'text-amber-400',
        bgGlow: 'shadow-amber-500/10 border-amber-500/30',
        actionText: 'Step-Up MFA Verification Required',
        icon: <ShieldAlert className="w-8 h-8 text-amber-400" />,
      };
    }
    return {
      level: 'AUTHENTIC & SECURE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      strokeColor: '#10b981',
      textColor: 'text-emerald-400',
      bgGlow: 'shadow-emerald-500/10 border-emerald-500/30',
      actionText: 'Session Unrestricted (Continuous)',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
    };
  };

  const theme = getTheme();

  // Circular gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className={`bg-slate-900/90 rounded-2xl border p-6 shadow-xl backdrop-blur-md transition-all duration-300 ${theme.bgGlow}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Continuous Risk Engine</span>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Dynamic Risk Score</span>
          </h2>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${theme.badgeColor}`}>
          {theme.level}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated risk score stroke */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={theme.strokeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-extrabold tracking-tight ${theme.textColor}`}>
              {riskScore}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Risk Index</span>
          </div>
        </div>

        {/* Status & Adaptive Response Details */}
        <div className="space-y-3">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Adaptive Action</span>
            <p className="text-sm font-semibold text-slate-100 flex items-center space-x-1.5 mt-0.5">
              <span>{theme.actionText}</span>
            </p>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/30">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Engine Telemetry State</span>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {statusMessage}
            </p>
          </div>

          {/* Threshold Legend */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Low (&lt;45%)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>MFA (45-74%)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Block (&gt;75%)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
