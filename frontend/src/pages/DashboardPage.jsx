import React from 'react';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import RiskTimelineChart from '../components/dashboard/RiskTimelineChart';
import FeatureRadarChart from '../components/dashboard/FeatureRadarChart';
import XaiExplanationPanel from '../components/dashboard/XaiExplanationPanel';
import AuditLogTable from '../components/dashboard/AuditLogTable';
import { useTelemetry } from '../context/TelemetryContext';
import { useRisk } from '../context/RiskContext';
import { Activity, ShieldCheck, Zap, Database, Server } from 'lucide-react';

export default function DashboardPage() {
  const { totalEventsAnalyzed } = useTelemetry();
  const { isImposterMode, riskScore } = useRisk();

  return (
    <div className="space-y-6">
      
      {/* Top Notification / Status Banner if Imposter Mode is Active */}
      {isImposterMode && (
        <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-4 flex items-center justify-between text-red-200">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-red-400 animate-bounce" />
            <div>
              <p className="font-bold text-sm text-white">Active Attack Simulation in Progress</p>
              <p className="text-xs text-red-300">
                Synthetic anomalous telemetry is being injected to evaluate the anomaly detector. Watch the risk score and XAI attributions update live.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-red-900/60 border border-red-700 text-red-300">
            SIMULATOR_ACTIVE
          </span>
        </div>
      )}

      {/* Metrics Header Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Telemetry Events</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">{totalEventsAnalyzed.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Key dwell & mouse trajectory samples</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Detection Baseline</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">Calibrated</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Isolation Forest User Model Ready</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Privacy Safeguard</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">100%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Zero keystroke / password retention</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Real-Time Channel</span>
          <p className="text-2xl font-black text-teal-400 mt-1">Full-Duplex</p>
          <p className="text-[10px] text-slate-500 mt-0.5">WebSocket sliding window evaluation</p>
        </div>
      </div>

      {/* Core Anomaly & Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskScoreCard />
        </div>
        <div className="lg:col-span-2">
          <RiskTimelineChart />
        </div>
      </div>

      {/* Multimodal Feature Breakdown & Explainable AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureRadarChart />
        <XaiExplanationPanel />
      </div>

      {/* Continuous Audit Log */}
      <AuditLogTable />

    </div>
  );
}
