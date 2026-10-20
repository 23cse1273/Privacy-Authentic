import React, { useState } from 'react';
import { ShieldCheck, Info, X, CheckCircle2, Lock } from 'lucide-react';

export default function PrivacyPledgeBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border-b border-cyan-800/40 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 text-slate-300">
            <span className="font-semibold text-cyan-300">NIST SP 800-63B-4 Privacy Compliant:</span>
            <span>Zero raw keystroke/password retention.</span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              Only derived millisecond dynamics (dwell time, flight latency, mouse velocity, curvature) are processed.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Keylogging Prohibited</span>
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
