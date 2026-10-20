/**
 * Telemetry Context & Stream Provider
 * 
 * Orchestrates keyboard and mouse collectors, runs sliding time-window evaluations,
 * and passes multimodal feature vectors to the risk engine.
 * 
 * PRIVACY SPECIFICATION (NIST SP 800-63B-4):
 * - Raw keystroke letters and numbers are NEVER stored or inspected.
 * - Screen coordinates are converted into relative velocities and trajectory curvatures.
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useKeystrokeCollector } from '../hooks/useKeystrokeCollector';
import { useMouseCollector } from '../hooks/useMouseCollector';
import { extractMultimodalFeatures } from '../services/telemetryExtractor';
import { evaluateBiometrics } from '../services/standaloneSimulator';
import { useRisk } from './RiskContext';
import { wsService } from '../services/websocketService';
import { useAuth } from './AuthContext';

const TelemetryContext = createContext(null);

export function TelemetryProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const {
    baseline,
    riskScore,
    processEvaluation,
    isImposterMode,
    isCalibrating,
    calibrationProgress,
    setCalibrationProgress,
    updateBaselineProfile,
  } = useRisk();

  const keystrokeCollector = useKeystrokeCollector();
  const mouseCollector = useMouseCollector();

  const [totalEventsAnalyzed, setTotalEventsAnalyzed] = useState(142);
  const [lastWindowTime, setLastWindowTime] = useState(Date.now());
  const [isCollecting, setIsCollecting] = useState(true);
  const calibrationSamplesRef = useRef([]);

  // Attach global event listeners to the window
  useEffect(() => {
    if (!isCollecting || !isAuthenticated) return;

    const onKeyDown = (e) => keystrokeCollector.handleKeyDown(e);
    const onKeyUp = (e) => keystrokeCollector.handleKeyUp(e);
    const onMouseMove = (e) => mouseCollector.handleMouseMove(e);
    const onMouseDown = (e) => mouseCollector.handleMouseDown(e);
    const onMouseUp = (e) => mouseCollector.handleMouseUp(e);

    window.addEventListener('keydown', onKeyDown, { passive: true });
    window.addEventListener('keyup', onKeyUp, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isCollecting, isAuthenticated, keystrokeCollector, mouseCollector]);

  // Connect to WebSocket if token is available
  useEffect(() => {
    if (isAuthenticated && token) {
      wsService.connect(token);

      // Listen for server evaluation results
      const unsubscribe = wsService.on('evaluation_result', (data) => {
        if (data && data.riskScore !== undefined) {
          processEvaluation(data, data.features);
        }
      });

      return () => {
        unsubscribe();
        wsService.disconnect();
      };
    }
  }, [isAuthenticated, token, processEvaluation]);

  // Periodic sliding window feature extraction (every 6 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const windowDurationMs = now - lastWindowTime;
      setLastWindowTime(now);

      const keyData = keystrokeCollector.flushData();
      const mouseData = mouseCollector.flushData();

      const eventCount = keyData.dwellTimes.length + keyData.flightTimes.length + mouseData.mouseVelocities.length;
      if (eventCount > 0) {
        setTotalEventsAnalyzed((prev) => prev + eventCount);
      }

      // Feature extraction
      const extracted = extractMultimodalFeatures({
        ...keyData,
        ...mouseData,
        windowDurationMs,
        eventCount,
      });

      let features = { ...extracted.features };

      // Handle Calibration Mode
      if (isCalibrating) {
        calibrationSamplesRef.current.push(features);
        const progress = Math.min(calibrationSamplesRef.current.length * 20, 100);
        setCalibrationProgress(progress);

        if (progress >= 100) {
          // Average calibration samples to form the new legitimate profile
          const newBase = { ...baseline };
          const samples = calibrationSamplesRef.current;
          for (const key of Object.keys(newBase)) {
            const vals = samples.map((s) => s[key]).filter((v) => v !== undefined && !isNaN(v) && v > 0);
            if (vals.length > 0) {
              newBase[key] = parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
            }
          }
          updateBaselineProfile(newBase);
          calibrationSamplesRef.current = [];
        }
        return;
      }

      // If Imposter / Anomaly Simulation mode is enabled, perturb features to simulate attacker takeover
      if (isImposterMode) {
        features = {
          dwell_time_mean: 240.0, // Unusually slow / heavy key press
          dwell_time_std: 65.0,
          flight_time_mean: 410.0, // Erratic hesitation
          flight_time_std: 110.0,
          typing_cadence_kpm: 85.0, // Drastic drop in cadence
          mouse_velocity_mean: 3.4, // Fast, abrupt mouse movements
          mouse_velocity_max: 7.8,
          mouse_acceleration_mean: 0.18,
          trajectory_curvature: 2.85, // Highly erratic curved paths
          click_duration_mean: 195.0,
          idle_time_ratio: 0.70,
          event_frequency_hz: 1.5,
        };
      }

      // Try sending via WebSocket first
      const sentViaWs = wsService.send('telemetry_batch', { features });

      // If WebSocket is not connected (standalone / local evaluation mode), evaluate in-browser
      if (!sentViaWs) {
        const evaluation = evaluateBiometrics(features, baseline, riskScore);
        processEvaluation(evaluation, features);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [
    isAuthenticated,
    lastWindowTime,
    keystrokeCollector,
    mouseCollector,
    isImposterMode,
    isCalibrating,
    baseline,
    riskScore,
    processEvaluation,
    updateBaselineProfile,
    setCalibrationProgress,
  ]);

  return (
    <TelemetryContext.Provider
      value={{
        totalEventsAnalyzed,
        isCollecting,
        setIsCollecting,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
}
