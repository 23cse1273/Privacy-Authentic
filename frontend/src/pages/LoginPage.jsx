import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { ShieldCheck, Lock, Activity, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Background ambient light effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/15 blur-3xl pointer-events-none rounded-full"></div>

      {/* Main Container */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left column: Academic & Feature Highlights */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Multimodal Behavioral Biometrics & XAI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Privacy-Preserving <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Continuous Authentication
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Eliminates the post-login session hijacking vulnerability. Continuously analyzes non-intrusive typing cadence, mouse dynamics, and temporal patterns without ever recording raw keystrokes or passwords.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <span>Real-time Isolation Forest anomaly detection baseline</span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Adaptive step-up MFA and dynamic risk smoothing</span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <EyeOff className="w-4 h-4" />
              </div>
              <span>NIST SP 800-63B-4 compliant zero-credential telemetry</span>
            </div>
          </div>
        </div>

        {/* Right column: Form Card */}
        <div className="flex justify-center">
          {isRegisterMode ? (
            <RegisterForm onSwitchToLogin={() => setIsRegisterMode(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setIsRegisterMode(true)} />
          )}
        </div>

      </div>

    </div>
  );
}
