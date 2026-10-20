import React, { useState } from 'react';
import { Send, Lock, AlertCircle, CheckCircle2, ShieldCheck, DollarSign, FileText, Download } from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { useAuth } from '../../context/AuthContext';

export default function InteractivePlayground() {
  const { decision, riskScore } = useRisk();
  const { setIsMfaStepUpOpen } = useAuth();

  const [noteContent, setNoteContent] = useState('');
  const [transferAmount, setTransferAmount] = useState('2,500.00');
  const [recipient, setRecipient] = useState('ACC-99214-CHASE');
  const [actionFeedback, setActionFeedback] = useState(null);

  const handleSensitiveAction = (actionName) => {
    // Check adaptive authentication policy
    if (decision === 'RESTRICT' || riskScore >= 75) {
      setActionFeedback({
        type: 'danger',
        message: `Action Blocked! Continuous authentication has restricted your session due to critical behavioral divergence (${riskScore}%).`,
      });
      return;
    }

    if (decision === 'STEP_UP_MFA' || riskScore >= 45) {
      setActionFeedback({
        type: 'warning',
        message: `Step-Up Verification Required! Behavioral biometrics require confirmation before executing ${actionName}.`,
      });
      setIsMfaStepUpOpen(true);
      return;
    }

    // Normal execution if risk is low
    setActionFeedback({
      type: 'success',
      message: `Action Approved! "${actionName}" executed successfully. Continuous biometric signature confirmed legitimate.`,
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Enterprise Workstation Mock</span>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>Protected Activity Environment</span>
          </h2>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Telemetry Active</span>
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Interact with the workspace below (type notes, fill forms, move cursor). Every keystroke cadence and mouse gesture feeds into the continuous authentication engine in real time.
      </p>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className={`p-3 rounded-xl border text-xs mb-4 flex items-center space-x-2 ${
          actionFeedback.type === 'danger'
            ? 'bg-red-500/10 border-red-500/30 text-red-300'
            : actionFeedback.type === 'warning'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          {actionFeedback.type === 'danger' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mock Financial Transfer Form */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Sensitive Financial Action</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">STEP-UP PROTECTED</span>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Target Account Number</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Transfer Amount (USD)</label>
            <input
              type="text"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={() => handleSensitiveAction(`Wire Transfer ($${transferAmount})`)}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1.5 mt-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Authorize Wire Transfer</span>
          </button>
        </div>

        {/* Freeform Typing Notepad for Telemetry Generation */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Interactive Notepad (Telemetry Generator)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">ZERO CONTENT LOGGED</span>
          </div>

          <textarea
            rows="4"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Type any message, report or thought here to generate natural typing rhythm and cadence..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
          />

          <button
            onClick={() => handleSensitiveAction('Confidential Report Export')}
            className="w-full py-2 px-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-700/20 transition-all flex items-center justify-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Protected Audit Records</span>
          </button>
        </div>

      </div>
    </div>
  );
}
