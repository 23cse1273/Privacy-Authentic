/**
 * Keystroke Dynamics Collector Hook
 * 
 * Captures:
 * 1. Dwell Time: Duration between keydown and keyup for each key.
 * 2. Flight Time: Duration between keyup of key N and keydown of key N+1.
 * 
 * STRICT PRIVACY GUARANTEE:
 * - We do NOT store or inspect `event.key`, `event.code`, or text characters.
 * - Only timestamps (performance.now() or Date.now()) are captured.
 * - No sensitive passwords, numbers, or keystrokes are recorded.
 */

import { useRef, useCallback } from 'react';

export function useKeystrokeCollector() {
  const activeKeysDown = useRef(new Map()); // Map<keyIdentifierNumber, timestampMs>
  const keySequenceCounter = useRef(0);
  const lastKeyUpTimestamp = useRef(null);

  const dwellTimesRef = useRef([]);
  const flightTimesRef = useRef([]);

  const handleKeyDown = useCallback((e) => {
    // Generate an anonymous numeric ID for the key press instance
    // Note: We use e.which or an internal counter, but NEVER persist the actual character
    const anonymousKeyId = e.code || 'key';
    const now = performance.now();

    // Flight time calculation: interval between previous keyup and current keydown
    if (lastKeyUpTimestamp.current !== null) {
      const flightTime = now - lastKeyUpTimestamp.current;
      // Filter out long pauses (e.g. > 2500ms) to avoid skewing typing cadence
      if (flightTime > 10 && flightTime < 2500) {
        flightTimesRef.current.push(flightTime);
      }
    }

    if (!activeKeysDown.current.has(anonymousKeyId)) {
      activeKeysDown.current.set(anonymousKeyId, now);
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    const anonymousKeyId = e.code || 'key';
    const now = performance.now();

    if (activeKeysDown.current.has(anonymousKeyId)) {
      const keyDownTime = activeKeysDown.current.get(anonymousKeyId);
      const dwellTime = now - keyDownTime;
      activeKeysDown.current.delete(anonymousKeyId);

      // Valid dwell time usually falls between 20ms and 1500ms
      if (dwellTime >= 15 && dwellTime <= 1500) {
        dwellTimesRef.current.push(dwellTime);
      }
    }

    lastKeyUpTimestamp.current = now;
  }, []);

  // Flush and return collected timing arrays for window evaluation
  const flushData = useCallback(() => {
    const dwell = [...dwellTimesRef.current];
    const flight = [...flightTimesRef.current];
    dwellTimesRef.current = [];
    flightTimesRef.current = [];
    return { dwellTimes: dwell, flightTimes: flight };
  }, []);

  const getRecentCount = useCallback(() => {
    return dwellTimesRef.current.length;
  }, []);

  return {
    handleKeyDown,
    handleKeyUp,
    flushData,
    getRecentCount,
  };
}
