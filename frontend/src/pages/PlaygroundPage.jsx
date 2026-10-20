import React from 'react';
import ImposterSimulator from '../components/playground/ImposterSimulator';
import CalibrationAssistant from '../components/playground/CalibrationAssistant';
import InteractivePlayground from '../components/playground/InteractivePlayground';
import { Cpu, HelpCircle } from 'lucide-react';

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Biometric Testing & Simulation Lab</h1>
            <p className="text-xs text-slate-400">Interactive sandbox to test baseline calibration, imposter attack detection, and adaptive MFA triggers</p>
          </div>
        </div>
      </div>

      {/* Row 1: Imposter Simulator & Calibration Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImposterSimulator />
        <CalibrationAssistant />
      </div>

      {/* Row 2: Live Activity Environment guarded by Continuous Authentication */}
      <InteractivePlayground />

    </div>
  );
}
