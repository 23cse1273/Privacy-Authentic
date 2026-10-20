/**
 * Risk Context
 * Manages the live dynamic risk score, anomaly evaluations, XAI explanations,
 * baseline profile, and adaptive authentication state.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DEFAULT_BASELINE, evaluateBiometrics } from '../services/standaloneSimulator';
import { useAuth } from './AuthContext';

const RiskContext = createContext(null);

export function RiskProvider({ children }) {
  const { setIsMfaStepUpOpen } = useAuth();
  const [riskScore, setRiskScore] = useState(14); // Initial benign low score
  const [decision, setDecision] = useState('CONTINUE');
  const [statusMessage, setStatusMessage] = useState('Biometric baseline matched. Session healthy.');
  const [baseline, setBaseline] = useState(DEFAULT_BASELINE);
  const [currentFeatures, setCurrentFeatures] = useState(DEFAULT_BASELINE);
  const [xaiExplanations, setXaiExplanations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isImposterMode, setIsImposterMode] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  // Time-series history for Recharts visualization
  const [riskHistory, setRiskHistory] = useState(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 12; i >= 0; i--) {
      const t = new Date(now - i * 6000);
      initial.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        riskScore: Math.floor(10 + Math.random() * 8),
        threshold: 45,
        criticalThreshold: 75,
        decision: 'CONTINUE',
      });
    }
    return initial;
  });

  // Process a newly evaluated feature batch
  const processEvaluation = useCallback((evaluationResult, rawFeatures) => {
    const { riskScore: newRisk, decision: newDecision, statusMessage: msg, xaiExplanations: xai } = evaluationResult;

    setRiskScore(newRisk);
    setDecision(newDecision);
    setStatusMessage(msg);
    setXaiExplanations(xai || []);
    if (rawFeatures) {
      setCurrentFeatures(rawFeatures);
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Append to time-series history
    setRiskHistory((prev) => {
      const updated = [
        ...prev.slice(prev.length >= 20 ? 1 : 0),
        {
          time: timeStr,
          riskScore: newRisk,
          threshold: 45,
          criticalThreshold: 75,
          decision: newDecision,
        },
      ];
      return updated;
    });

    // Append to audit log
    const logEntry = {
      id: `log_${Date.now()}`,
      timestamp: timeStr,
      riskScore: newRisk,
      decision: newDecision,
      topFactor: xai && xai.length > 0 ? `${xai[0].feature} (${xai[0].percentDeviation > 0 ? '+' : ''}${xai[0].percentDeviation}%)` : 'Consistent with baseline',
    };
    setAuditLogs((prev) => [logEntry, ...prev.slice(0, 49)]);

    // Trigger Adaptive MFA if required
    if (newDecision === 'STEP_UP_MFA') {
      setIsMfaStepUpOpen(true);
    }
  }, [setIsMfaStepUpOpen]);

  // Handle successful MFA verification to restore healthy risk score
  const handleMfaSuccess = useCallback(() => {
    setRiskScore(12);
    setDecision('CONTINUE');
    setStatusMessage('Identity verified via Step-Up TOTP. Risk reset to baseline.');
    setIsImposterMode(false);
    
    // Add verification log
    setAuditLogs((prev) => [
      {
        id: `log_mfa_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        riskScore: 12,
        decision: 'MFA_VERIFIED',
        topFactor: 'Step-Up TOTP Successful - Session Restored',
      },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // Update user baseline profile
  const updateBaselineProfile = useCallback((newBaseline) => {
    setBaseline(newBaseline);
    setRiskScore(10);
    setDecision('CONTINUE');
    setStatusMessage('Baseline calibrated successfully.');
  }, []);

  return (
    <RiskContext.Provider
      value={{
        riskScore,
        decision,
        statusMessage,
        baseline,
        currentFeatures,
        xaiExplanations,
        riskHistory,
        auditLogs,
        isImposterMode,
        setIsImposterMode,
        isCalibrating,
        setIsCalibrating,
        calibrationProgress,
        setCalibrationProgress,
        processEvaluation,
        handleMfaSuccess,
        updateBaselineProfile,
      }}
    >
      {children}
    </RiskContext.Provider>
  );
}

export function useRisk() {
  const context = useContext(RiskContext);
  if (!context) {
    throw new Error('useRisk must be used within a RiskProvider');
  }
  return context;
}
