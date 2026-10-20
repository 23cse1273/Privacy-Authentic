/**
 * Standalone Biometric Anomaly & Risk Simulator
 * 
 * Provides an in-browser statistical baseline calibration, Z-score / Isolation Forest-style
 * multi-dimensional deviation scorer, and XAI feature-attribution generator.
 * Works seamlessly in client-side mode or as a fallback when backend is starting.
 */

export const DEFAULT_BASELINE = {
  dwell_time_mean: 95.0,        // ms
  dwell_time_std: 18.0,
  flight_time_mean: 140.0,      // ms
  flight_time_std: 35.0,
  typing_cadence_kpm: 240.0,    // characters/key events per min
  mouse_velocity_mean: 0.85,    // px/ms
  mouse_velocity_max: 3.2,
  mouse_acceleration_mean: 0.045,
  trajectory_curvature: 1.15,   // natural smooth curves
  click_duration_mean: 85.0,    // ms
  idle_time_ratio: 0.25,        // natural pause ratio
  event_frequency_hz: 6.5,
};

// Tolerances (standard error margins before flagging anomaly)
const FEATURE_TOLERANCE = {
  dwell_time_mean: 25.0,
  dwell_time_std: 15.0,
  flight_time_mean: 45.0,
  flight_time_std: 30.0,
  typing_cadence_kpm: 90.0,
  mouse_velocity_mean: 0.60,
  mouse_velocity_max: 2.0,
  mouse_acceleration_mean: 0.035,
  trajectory_curvature: 0.50,
  click_duration_mean: 35.0,
  idle_time_ratio: 0.40,
  event_frequency_hz: 4.0,
};

// Feature importance weights for multimodal fusion
const FEATURE_WEIGHTS = {
  dwell_time_mean: 0.15,
  flight_time_mean: 0.18,
  typing_cadence_kpm: 0.12,
  mouse_velocity_mean: 0.14,
  mouse_acceleration_mean: 0.10,
  trajectory_curvature: 0.13,
  click_duration_mean: 0.08,
  idle_time_ratio: 0.05,
  event_frequency_hz: 0.05,
};

/**
 * Evaluates live feature vector against legitimate baseline.
 * Produces:
 * - anomalyScore (0 to 1)
 * - dynamicRiskScore (0 to 100)
 * - decision ('CONTINUE' | 'STEP_UP_MFA' | 'RESTRICT')
 * - xaiExplanations (Array of contributing features with relative impact)
 */
export function evaluateBiometrics(features, baseline = DEFAULT_BASELINE, previousRisk = 15) {
  const explanations = [];
  let weightedDeviationSum = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(FEATURE_WEIGHTS)) {
    const liveVal = features[key] ?? baseline[key];
    const baseVal = baseline[key];
    const tolerance = FEATURE_TOLERANCE[key] || 1;

    // Absolute difference
    const diff = Math.abs(liveVal - baseVal);
    // Normalized deviation
    const deviationRatio = diff / tolerance;

    weightedDeviationSum += deviationRatio * weight;
    totalWeight += weight;

    // Calculate percentage shift for explainability
    const percentShift = baseVal !== 0 ? ((liveVal - baseVal) / baseVal) * 100 : 0;
    
    // If deviation is meaningful, generate XAI explanation factor
    if (deviationRatio > 0.4) {
      explanations.push({
        feature: formatFeatureName(key),
        key,
        impactScore: parseFloat((deviationRatio * weight * 10).toFixed(2)),
        liveValue: liveVal,
        baselineValue: baseVal,
        percentDeviation: parseFloat(percentShift.toFixed(1)),
        isHighRisk: deviationRatio > 1.2,
      });
    }
  }

  const rawDeviation = weightedDeviationSum / (totalWeight || 1);
  
  // Transform raw deviation through sigmoid-like curve to 0-100 risk score
  const instantRisk = Math.min(Math.max(rawDeviation * 45, 5), 100);

  // Exponential moving average smoothing (as required by synopsis Section 7.1)
  // to avoid erratic spikes from single isolated movements:
  // Risk_t = alpha * InstantRisk + (1 - alpha) * Risk_t-1
  const alpha = 0.35;
  const smoothedRisk = Math.round(alpha * instantRisk + (1 - alpha) * previousRisk);

  // Sort XAI explanations by impact score descending
  explanations.sort((a, b) => b.impactScore - a.impactScore);

  // Adaptive security decision based on risk policy
  let decision = 'CONTINUE';
  let statusMessage = 'Biometric signature verified. Normal session.';

  if (smoothedRisk >= 75) {
    decision = 'RESTRICT';
    statusMessage = 'Critical anomaly detected! Session restricted.';
  } else if (smoothedRisk >= 45) {
    decision = 'STEP_UP_MFA';
    statusMessage = 'Unusual behavioral shift. Adaptive MFA step-up required.';
  }

  return {
    rawAnomalyScore: parseFloat((instantRisk / 100).toFixed(3)),
    riskScore: smoothedRisk,
    decision,
    statusMessage,
    xaiExplanations: explanations.slice(0, 5), // Top 5 influential factors
    evaluatedAt: new Date().toISOString(),
  };
}

export function formatFeatureName(key) {
  const names = {
    dwell_time_mean: 'Key Dwell Time (Hold)',
    dwell_time_std: 'Dwell Time Variance',
    flight_time_mean: 'Inter-Key Flight Time',
    flight_time_std: 'Flight Time Variance',
    typing_cadence_kpm: 'Typing Cadence (KPM)',
    mouse_velocity_mean: 'Avg Mouse Speed',
    mouse_velocity_max: 'Peak Mouse Speed',
    mouse_acceleration_mean: 'Mouse Acceleration',
    trajectory_curvature: 'Trajectory Curvature',
    click_duration_mean: 'Click Hold Duration',
    idle_time_ratio: 'Idle Rest Ratio',
    event_frequency_hz: 'Interaction Frequency',
  };
  return names[key] || key.replace(/_/g, ' ');
}
