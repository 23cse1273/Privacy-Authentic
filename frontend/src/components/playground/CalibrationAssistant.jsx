import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Play, Key } from 'lucide-react';
import { useRisk } from '../../context/RiskContext';

const CALIBRATION_TEXT = "Continuous behavioral authentication protects sessions against unauthorized takeover using typing rhythm and mouse dynamics.";

export default function CalibrationAssistant() {
  const { isCalibrating, setIsCalibrating, calibrationProgress, setCalibrationProgress } = useRisk();
  const [typedInput, setTypedInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationProgress(0);
    setTypedInput('');
    setIsCompleted(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setTypedInput(val);

    if (val.length >= CALIBRATION_TEXT.length * 0.9) {
      setIsCompleted(true);
      setIsCalibrating(false);
      setCalibrationProgress(100);
    } else {
      const prog = Math.min(Math.round((val.length / CALIBRATION_TEXT.length) * 100), 95);
      setCalibrationProgress(prog);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Baseline Calibration</span>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Calibrate Legitimate Profile</span>
          </h2>
        </div>
        {!isCalibrating && !isCompleted ? (
          <button
            onClick={startCalibration}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition-all flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start Calibration</span>
          </button>
        ) : (
          <button
            onClick={startCalibration}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center space-x-1.5 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-calibrate</span>
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
        Type the sample phrase below naturally at your usual pace. The system will measure your personal dwell time variance, flight timing, and mouse cadence to build your user baseline.
      </p>

      {/* Target Phrase Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono mb-3 select-none">
        {CALIBRATION_TEXT}
      </div>

      {/* Typing Input */}
      <div className="space-y-3">
        <textarea
          rows="2"
          value={typedInput}
          onChange={handleInputChange}
          placeholder="Click here and type the sample phrase above to calibrate..."
          disabled={!isCalibrating && !isCompleted}
          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50"
        />

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Calibration Sampling Progress</span>
            <span className="font-mono font-semibold text-cyan-400">{calibrationProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${calibrationProgress}%` }}
            ></div>
          </div>
        </div>

        {isCompleted && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Profile successfully calibrated! Isolation Forest baseline updated.</span>
          </div>
        )}
      </div>
    </div>
  );
}
