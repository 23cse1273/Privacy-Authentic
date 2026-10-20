/**
 * Telemetry Feature Extractor
 * Extracts statistical behavioral features from raw timing and motion buffers.
 * 
 * PRIVACY GUARANTEE:
 * - No characters or key codes are retained or processed.
 * - Only millisecond timestamps, physical coordinate displacements, and derived velocities are used.
 */

// Basic statistical helpers
export function calculateMean(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((acc, val) => acc + val, 0) / arr.length;
}

export function calculateStdDev(arr, mean) {
  if (!arr || arr.length <= 1) return 0;
  const avg = mean !== undefined ? mean : calculateMean(arr);
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

export function calculateMedian(arr) {
  if (!arr || arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Extracts multimodal feature vector from aggregated telemetry buffers
 * @param {Object} rawTelemetry
 *   - dwellTimes: Array of numbers (ms)
 *   - flightTimes: Array of numbers (ms)
 *   - mouseVelocities: Array of numbers (px/ms)
 *   - mouseAccelerations: Array of numbers (px/ms^2)
 *   - mouseAngles: Array of numbers (radians change)
 *   - clickDurations: Array of numbers (ms)
 *   - totalPathLength: Number (total pixels traveled)
 *   - directDisplacement: Number (straight-line distance)
 *   - windowDurationMs: Number (duration of sampling window)
 *   - eventCount: Number (total interaction events)
 *   - idleIntervals: Array of numbers (ms)
 */
export function extractMultimodalFeatures(rawTelemetry) {
  const {
    dwellTimes = [],
    flightTimes = [],
    mouseVelocities = [],
    mouseAccelerations = [],
    mouseAngles = [],
    clickDurations = [],
    totalPathLength = 0,
    directDisplacement = 0,
    windowDurationMs = 10000,
    eventCount = 0,
    idleIntervals = [],
  } = rawTelemetry;

  // 1. Keystroke Dynamics
  const meanDwell = calculateMean(dwellTimes);
  const stdDwell = calculateStdDev(dwellTimes, meanDwell);
  const meanFlight = calculateMean(flightTimes);
  const stdFlight = calculateStdDev(flightTimes, meanFlight);
  
  // Typing Cadence (Characters/Keys per minute equivalent)
  const windowMinutes = Math.max(windowDurationMs / 60000, 0.05);
  const typingCadenceKpm = dwellTimes.length > 0 ? (dwellTimes.length / windowMinutes) : 0;

  // 2. Mouse Dynamics
  const meanVelocity = calculateMean(mouseVelocities);
  const maxVelocity = mouseVelocities.length > 0 ? Math.max(...mouseVelocities) : 0;
  const meanAcceleration = calculateMean(mouseAccelerations);
  const meanAngleChange = calculateMean(mouseAngles);

  // Trajectory Curvature Ratio (Path length / Straight line displacement)
  // Value of 1.0 means straight linear motion; higher values mean erratic/curved paths
  let trajectoryCurvature = 1.0;
  if (directDisplacement > 5 && totalPathLength >= directDisplacement) {
    trajectoryCurvature = totalPathLength / directDisplacement;
  }

  // Click Dynamics
  const meanClickDuration = calculateMean(clickDurations);

  // 3. Temporal & Interaction Consistency
  const meanIdleInterval = calculateMean(idleIntervals);
  const totalIdleMs = idleIntervals.reduce((a, b) => a + b, 0);
  const idleRatio = Math.min(Math.max(totalIdleMs / windowDurationMs, 0), 1.0);
  const eventFrequencyHz = (eventCount / (windowDurationMs / 1000));

  return {
    timestamp: Date.now(),
    sampleSize: {
      keystrokes: dwellTimes.length,
      mouseMovements: mouseVelocities.length,
      clicks: clickDurations.length,
    },
    // Standardized feature vector conforming to ML Model requirements
    features: {
      dwell_time_mean: parseFloat(meanDwell.toFixed(2)),
      dwell_time_std: parseFloat(stdDwell.toFixed(2)),
      flight_time_mean: parseFloat(meanFlight.toFixed(2)),
      flight_time_std: parseFloat(stdFlight.toFixed(2)),
      typing_cadence_kpm: parseFloat(typingCadenceKpm.toFixed(1)),
      mouse_velocity_mean: parseFloat(meanVelocity.toFixed(3)),
      mouse_velocity_max: parseFloat(maxVelocity.toFixed(3)),
      mouse_acceleration_mean: parseFloat(meanAcceleration.toFixed(4)),
      trajectory_curvature: parseFloat(trajectoryCurvature.toFixed(2)),
      click_duration_mean: parseFloat(meanClickDuration.toFixed(2)),
      idle_time_ratio: parseFloat(idleRatio.toFixed(3)),
      event_frequency_hz: parseFloat(eventFrequencyHz.toFixed(2)),
    },
  };
}
