import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Activity, Clock } from 'lucide-react';
import { useRisk } from '../../context/RiskContext';

export default function RiskTimelineChart() {
  const { riskHistory, riskScore } = useRisk();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-slate-300 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Time: {label}</span>
          </p>
          <p className="mt-1 font-bold text-cyan-400">
            Risk Score: {data.riskScore}%
          </p>
          <p className="text-[11px] text-slate-400">
            Status: <span className="font-medium text-slate-200">{data.decision}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Temporal Analytics</span>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Continuous Risk Timeline</span>
          </h2>
        </div>
        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span>
            <span>Live Score</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 border-dashed inline-block"></span>
            <span>MFA Limit (45%)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-red-400 border-dashed inline-block"></span>
            <span>Lock Limit (75%)</span>
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={riskHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Step-Up MFA Threshold */}
            <ReferenceLine
              y={45}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />

            {/* Critical Lockout Threshold */}
            <ReferenceLine
              y={75}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />

            <Line
              type="monotone"
              dataKey="riskScore"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ fill: '#0891b2', r: 3 }}
              activeDot={{ r: 6, fill: '#22d3ee', stroke: '#083344', strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
