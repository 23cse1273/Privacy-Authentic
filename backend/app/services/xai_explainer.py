"""Explainable AI (XAI) Attribution Service."""

from typing import Dict, Any, List
from app.services.ml_detector import FEATURE_KEYS, DEFAULT_BASELINE_VECTOR, FEATURE_SCALES

FRIENDLY_NAMES = {
    "dwell_time_mean": "Key Dwell Time (Hold)",
    "dwell_time_std": "Dwell Time Variance",
    "flight_time_mean": "Inter-Key Flight Time",
    "flight_time_std": "Flight Time Variance",
    "typing_cadence_kpm": "Typing Cadence (KPM)",
    "mouse_velocity_mean": "Avg Mouse Speed",
    "mouse_velocity_max": "Peak Mouse Speed",
    "mouse_acceleration_mean": "Mouse Acceleration",
    "trajectory_curvature": "Trajectory Curvature",
    "click_duration_mean": "Click Hold Duration",
    "idle_time_ratio": "Idle Rest Ratio",
    "event_frequency_hz": "Interaction Frequency",
}

FEATURE_WEIGHTS = {
    "dwell_time_mean": 0.15,
    "flight_time_mean": 0.18,
    "typing_cadence_kpm": 0.12,
    "mouse_velocity_mean": 0.14,
    "mouse_acceleration_mean": 0.10,
    "trajectory_curvature": 0.13,
    "click_duration_mean": 0.08,
    "idle_time_ratio": 0.05,
    "event_frequency_hz": 0.05,
}

class XaiExplainer:
    @staticmethod
    def explain_anomaly(live_features: Dict[str, Any], baseline_features: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Compute feature attribution breakdown and impact scores
        quantifying how much each biometric signal diverged from baseline.
        """
        explanations = []

        for key, weight in FEATURE_WEIGHTS.items():
            live_val = float(live_features.get(key, baseline_features.get(key, 0.0)))
            base_val = float(baseline_features.get(key, DEFAULT_BASELINE_VECTOR.get(key, 1.0)))
            scale = float(FEATURE_SCALES.get(key, 1.0))

            diff = abs(live_val - base_val)
            deviation_ratio = diff / scale

            # Percent deviation relative to legitimate baseline
            percent_deviation = ((live_val - base_val) / base_val * 100.0) if base_val != 0 else 0.0
            impact_score = round(deviation_ratio * weight * 10.0, 2)

            if deviation_ratio > 0.35:
                explanations.append({
                    "feature": FRIENDLY_NAMES.get(key, key),
                    "key": key,
                    "impactScore": impact_score,
                    "liveValue": round(live_val, 2),
                    "baselineValue": round(base_val, 2),
                    "percentDeviation": round(percent_deviation, 1),
                    "isHighRisk": deviation_ratio > 1.2,
                })

        # Sort explanations descending by impact score
        explanations.sort(key=lambda x: x["impactScore"], reverse=True)
        return explanations[:5]  # Top 5 most influential factors

xai_explainer = XaiExplainer()
