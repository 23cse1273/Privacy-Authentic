/**
 * Mouse Dynamics Collector Hook
 * 
 * Captures:
 * 1. Movement Velocity (px/ms) and Acceleration
 * 2. Trajectory Curvature (Path length / Net straight-line displacement)
 * 3. Click Duration (mousedown to mouseup duration)
 * 4. Angle changes (trajectory curvature indicators)
 * 
 * PRIVACY GUARANTEE:
 * - We only track relative spatial-temporal motion metrics, not screen content or clicked elements.
 */

import { useRef, useCallback } from 'react';

export function useMouseCollector() {
  const lastPoint = useRef(null); // { x, y, time }
  const startSegmentPoint = useRef(null); // { x, y }
  const lastVelocity = useRef(0);
  const mouseDownTime = useRef(null);

  const velocitiesRef = useRef([]);
  const accelerationsRef = useRef([]);
  const anglesRef = useRef([]);
  const clickDurationsRef = useRef([]);
  const totalPathLengthRef = useRef(0);
  const segmentCountRef = useRef(0);

  const handleMouseMove = useCallback((e) => {
    const now = performance.now();
    const currentPoint = { x: e.clientX, y: e.clientY, time: now };

    if (lastPoint.current) {
      const dt = currentPoint.time - lastPoint.current.time;
      if (dt > 8) { // Sample around ~60-120fps max to avoid noise
        const dx = currentPoint.x - lastPoint.current.x;
        const dy = currentPoint.y - lastPoint.current.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0) {
          totalPathLengthRef.current += distance;
          const velocity = distance / dt; // px/ms
          velocitiesRef.current.push(velocity);

          // Acceleration
          if (lastVelocity.current !== 0) {
            const dv = velocity - lastVelocity.current;
            const acceleration = Math.abs(dv / dt);
            accelerationsRef.current.push(acceleration);
          }
          lastVelocity.current = velocity;

          // Trajectory Angle
          const angle = Math.atan2(dy, dx);
          anglesRef.current.push(angle);
        }

        lastPoint.current = currentPoint;
      }
    } else {
      lastPoint.current = currentPoint;
      startSegmentPoint.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    mouseDownTime.current = performance.now();
  }, []);

  const handleMouseUp = useCallback(() => {
    if (mouseDownTime.current !== null) {
      const duration = performance.now() - mouseDownTime.current;
      if (duration >= 10 && duration <= 2000) {
        clickDurationsRef.current.push(duration);
      }
      mouseDownTime.current = null;
    }
  }, []);

  const flushData = useCallback(() => {
    let directDisplacement = 0;
    if (startSegmentPoint.current && lastPoint.current) {
      const dx = lastPoint.current.x - startSegmentPoint.current.x;
      const dy = lastPoint.current.y - startSegmentPoint.current.y;
      directDisplacement = Math.hypot(dx, dy);
    }

    const data = {
      mouseVelocities: [...velocitiesRef.current],
      mouseAccelerations: [...accelerationsRef.current],
      mouseAngles: [...anglesRef.current],
      clickDurations: [...clickDurationsRef.current],
      totalPathLength: totalPathLengthRef.current,
      directDisplacement: directDisplacement,
    };

    // Reset buffer
    velocitiesRef.current = [];
    accelerationsRef.current = [];
    anglesRef.current = [];
    clickDurationsRef.current = [];
    totalPathLengthRef.current = 0;
    startSegmentPoint.current = lastPoint.current;

    return data;
  }, []);

  const getRecentEventCount = useCallback(() => {
    return velocitiesRef.current.length + clickDurationsRef.current.length;
  }, []);

  return {
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    flushData,
    getRecentEventCount,
  };
}
