import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, User, LogOut, Activity, Lock, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRisk } from '../../context/RiskContext';
import { useTelemetry } from '../../context/TelemetryContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const { riskScore, decision } = useRisk();
  const { totalEventsAnalyzed } = useTelemetry();

  // Determine status color and icon
  const getStatusBadge = () => {
    if (decision === 'RESTRICT' || riskScore >= 75) {
      return {
        label: 'Session Restricted',
        color: 'bg-red-500/20 text-red-400 border-red-500/40',
        icon: <ShieldX className="w-4 h-4 text-red-400" />,
      };
    }
    if (decision === 'STEP_UP_MFA' || riskScore >= 45) {
      return {
        label: 'MFA Step-Up Triggered',
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse',
        icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
      };
    }
    return {
      label: 'Continuous Auth Active',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    };
  };

  const status = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                BioContinuous
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                XAI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Privacy-Preserving Continuous Authentication</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'playground'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Testing Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'privacy'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Audit</span>
          </button>
        </nav>

        {/* Status Pill & User Controls */}
        <div className="flex items-center space-x-3">
          {/* Continuous Status Pill */}
          <div className={`hidden md:flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
            {status.icon}
            <span>{status.label}</span>
            <span className="text-slate-400">({riskScore}%)</span>
          </div>

          {/* User profile dropdown or badge */}
          {user && (
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-2.5 py-1">
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-medium text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400">{user.role || 'Evaluator'}</p>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-700/60 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
