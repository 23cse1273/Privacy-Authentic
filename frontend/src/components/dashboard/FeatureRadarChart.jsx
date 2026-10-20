import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { Layers } from 'lucide-react';
import { useRisk } from '../../context/RiskContext';

export default function FeatureRadarChart() {
  const { baseline, currentFeatures } = useRisk();

  // Normalize metrics between 10 and 100 so radar stays visually balanced
  const radarData = [
    {
      metric: 'Dwell Time',
      Baseline: 50,
      Current: Math.min(Math.max((currentFeatures.dwell_time_mean / baseline.dwell_time_mean) * 50, 10), 100),
    },
    {
      metric: 'Flight Time',
      Baseline: 50,
      Current: Math.min(Math.max((currentFeatures.flight_time_mean / baseline.flight_time_mean) * 50, 10), 100),
    },
    {
      metric: 'Typing Cadence',
      Baseline: 50,
      Current: Math.min(Math.max((currentFeatures.typing_cadence_kpm / (baseline.typing_cadence_kpm || 1)) * 50, 10), 100),
    },
    {
      metric: 'Mouse Speed',
      Baseline: 50,
      Current: Math.min(Math.max((currentFeatures.mouse_velocity_mean / (baseline.mouse_velocity_mean || 0.1)) * 50, 10), 100),
    },
    {
      metric: 'Curvature',
      Baseline: 50,
      Current: Math.min(Math.max((currentFeatures.trajectory_curvature / (baseline.trajectory_curvature || 1)) * 50, 10), 100),
    },
    {
      metric: 'Click Duration',
      Baseline: 50,
      Current: Math.min(Math.max((currentFeatures.click_duration_mean / (baseline.click_duration_mean || 10)) * 50, 10), 100),
    },
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Multimodal Fusion</span>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Biometric Signature Comparison</span>
          </h2>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
          Normalized Profile
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
            <Radar
              name="Legitimate Baseline"
              dataKey="Baseline"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.2}
            />
            <Radar
              name="Active Session"
              dataKey="Current"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.35}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => <span className="text-slate-300">{value}</span>}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
