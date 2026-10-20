"""Telemetry and biometric feature schemas."""

from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class BiometricFeaturesSchema(BaseModel):
    """
    Standardized derived multimodal behavioral biometrics.
    Strictly privacy-preserving: contains zero character content or passwords.
    """
    dwell_time_mean: float = Field(..., description="Mean key hold duration in ms")
    dwell_time_std: float = Field(0.0, description="Standard deviation of dwell time")
    flight_time_mean: float = Field(..., description="Mean inter-key flight duration in ms")
    flight_time_std: float = Field(0.0, description="Standard deviation of flight time")
    typing_cadence_kpm: float = Field(0.0, description="Keys/events per minute rate")
    mouse_velocity_mean: float = Field(..., description="Average mouse velocity in px/ms")
    mouse_velocity_max: float = Field(0.0, description="Maximum mouse velocity in px/ms")
    mouse_acceleration_mean: float = Field(0.0, description="Average mouse acceleration")
    trajectory_curvature: float = Field(1.0, description="Path length to net displacement ratio")
    click_duration_mean: float = Field(0.0, description="Average click hold duration in ms")
    idle_time_ratio: float = Field(0.0, description="Proportion of idle window duration (0.0 to 1.0)")
    event_frequency_hz: float = Field(0.0, description="Interaction frequency in Hz")

class TelemetryBatchRequest(BaseModel):
    features: BiometricFeaturesSchema
    sampleSize: Optional[Dict[str, int]] = None
    windowDurationMs: Optional[int] = 10000
    timestamp: Optional[int] = None
