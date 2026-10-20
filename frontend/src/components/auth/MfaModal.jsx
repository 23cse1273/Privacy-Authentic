import React, { useState } from 'react';
import { ShieldAlert, Key, CheckCircle, AlertCircle, X, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRisk } from '../../context/RiskContext';

export default function MfaModal() {
  const { isMfaStepUpOpen, setIsMfaStepUpOpen, verifyMfaCode } = useAuth();
  const { riskScore, handleMfaSuccess, xaiExplanations } = useRisk();

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isMfaStepUpOpen) return null;

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);
    setError('');

    // Auto-advance focus to next digit
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of your authenticator code.');
      return;
    }

    setIsSubmitting(true);
    const result = await verifyMfaCode(fullCode);
    setIsSubmitting(false);

    if (result.success) {
      handleMfaSuccess();
      setOtpCode(['', '', '', '', '', '']);
    } else {
      setError(result.error || 'Invalid authentication code. Please try again.');
    }
  };

  const handleUseDemoCode = () => {
    setOtpCode(['1', '2', '3', '4', '5', '6']);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-amber-500/10 text-slate-100 relative">
        
        {/* Header Icon */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Adaptive Step-Up Challenge</span>
            <h3 className="text-lg font-bold text-white">Identity Verification Required</h3>
          </div>
        </div>

        {/* Reason banner */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-300 mb-5">
          <p className="font-semibold text-amber-300 flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Behavioral Anomaly Triggered (Risk: {riskScore}%)</span>
          </p>
          <p className="mt-1 text-slate-400">
            {xaiExplanations.length > 0
              ? `Significant divergence detected in ${xaiExplanations[0].feature} (${xaiExplanations[0].percentDeviation}%). Please confirm your identity.`
              : 'Continuous behavioral biometrics indicated atypical interaction dynamics.'}
          </p>
        </div>

        {/* 6-Digit Code Input */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Enter 6-Digit TOTP Authenticator Code
            </label>
            <div className="flex justify-between gap-2 max-w-xs mx-auto">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-12 text-center text-xl font-bold bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all text-white"
                  autoFocus={idx === 0}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying...' : 'Verify & Continue Session'}</span>
            </button>

            {/* Quick Demo Helper Button */}
            <button
              type="button"
              onClick={handleUseDemoCode}
              className="w-full text-center text-xs text-slate-400 hover:text-amber-300 py-1 transition-colors"
            >
              Testing Tip: Click here to autofill test code (123456)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
