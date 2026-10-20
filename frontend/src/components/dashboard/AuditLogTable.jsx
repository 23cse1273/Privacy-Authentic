import React from 'react';
import { ScrollText, ShieldCheck, ShieldAlert, ShieldX, Key } from 'lucide-react';
import { useRisk } from '../../context/RiskContext';

export default function AuditLogTable() {
  const { auditLogs } = useRisk();

  const getDecisionBadge = (decision) => {
    switch (decision) {
      case 'CONTINUE':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span>CONTINUE</span>
          </span>
        );
      case 'STEP_UP_MFA':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-3 h-3" />
            <span>STEP_UP_MFA</span>
          </span>
        );
      case 'MFA_VERIFIED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Key className="w-3 h-3" />
            <span>VERIFIED</span>
          </span>
        );
      case 'RESTRICT':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldX className="w-3 h-3" />
            <span>RESTRICT</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Compliance & Auditing</span>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <span>Continuous Evaluation Audit Trail</span>
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Showing recent {auditLogs.length} events
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Risk Score</th>
              <th className="py-2.5 px-3">Adaptive Decision</th>
              <th className="py-2.5 px-3">Influential Biometric Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-slate-500">
                  No evaluation logs recorded yet. Telemetry window running...
                </td>
              </tr>
            ) : (
              auditLogs.slice(0, 8).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold">
                    <span className={log.riskScore >= 75 ? 'text-red-400' : log.riskScore >= 45 ? 'text-amber-400' : 'text-emerald-400'}>
                      {log.riskScore}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{getDecisionBadge(log.decision)}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.topFactor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
