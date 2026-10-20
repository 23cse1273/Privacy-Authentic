"""Machine Learning Anomaly Detector using Scikit-Learn Isolation Forest."""

from typing import Dict, Any, List, Optional
import numpy as np
from sklearn.ensemble import IsolationForest

FEATURE_KEYS = [
    "dwell_time_mean",
    "dwell_time_std",
    "flight_time_mean",
    "flight_time_std",
    "typing_cadence_kpm",
    "mouse_velocity_mean",
    "mouse_velocity_max",
    "mouse_acceleration_mean",
    "trajectory_curvature",
    "click_duration_mean",
    "idle_time_ratio",
    "event_frequency_hz",
]

DEFAULT_BASELINE_VECTOR = {
    "dwell_time_mean": 95.0,
    "dwell_time_std": 18.0,
    "flight_time_mean": 140.0,
    "flight_time_std": 35.0,
    "typing_cadence_kpm": 240.0,
    "mouse_velocity_mean": 0.85,
    "mouse_velocity_max": 3.2,
    "mouse_acceleration_mean": 0.045,
    "trajectory_curvature": 1.15,
    "click_duration_mean": 85.0,
    "idle_time_ratio": 0.25,
    "event_frequency_hz": 6.5,
}

FEATURE_SCALES = {
    "dwell_time_mean": 25.0,
    "dwell_time_std": 12.0,
    "flight_time_mean": 45.0,
    "flight_time_std": 25.0,
    "typing_cadence_kpm": 80.0,
    "mouse_velocity_mean": 0.50,
    "mouse_velocity_max": 2.0,
    "mouse_acceleration_mean": 0.03,
    "trajectory_curvature": 0.40,
    "click_duration_mean": 30.0,
    "idle_time_ratio": 0.35,
    "event_frequency_hz": 3.5,
}

class AnomalyDetector:
    def __init__(self):
        # Per-user trained Isolation Forest models cache
        self.user_models: Dict[str, IsolationForest] = {}

    def _features_to_vector(self, features: Dict[str, Any]) -> np.ndarray:
        """Extract standardized numeric vector from feature map."""
        vec = []
        for k in FEATURE_KEYS:
            val = features.get(k, DEFAULT_BASELINE_VECTOR.get(k, 0.0))
            scale = FEATURE_SCALES.get(k, 1.0)
            # Scale feature to standardize variances across different units (ms vs px/ms)
            vec.append(float(val) / scale)
        return np.array(vec, dtype=np.float32)

    def train_baseline_model(self, user_id: str, baseline_features: Dict[str, Any], n_samples: int = 150) -> IsolationForest:
        """
        Train an Isolation Forest baseline model centered on the legitimate user profile
        with simulated realistic biological variance.
        """
        center_vec = self._features_to_vector(baseline_features)
        
        # Generate Gaussian perturbed samples around the user baseline (natural human variance ~10-15%)
        np.random.seed(42)
        noise = np.random.normal(loc=0.0, scale=0.15, size=(n_samples, len(center_vec)))
        training_data = center_vec + noise

        # Train Isolation Forest
        model = IsolationForest(
            n_estimators=100,
            contamination=0.05,
            random_state=42,
            n_jobs=1
        )
        model.fit(training_data)
        self.user_models[user_id] = model
        return model

    def evaluate_sample(self, user_id: str, features: Dict[str, Any], baseline: Optional[Dict[str, Any]] = None) -> float:
        """
        Evaluate live feature vector using the user's Isolation Forest model.
        Returns a normalized anomaly score between 0.0 (normal) and 1.0 (highly anomalous).
        """
        if user_id not in self.user_models:
            base = baseline or DEFAULT_BASELINE_VECTOR
            self.train_baseline_model(user_id, base)

        model = self.user_models[user_id]
        sample_vec = self._features_to_vector(features).reshape(1, -1)

        # Isolation Forest decision_function: higher score = normal, negative score = anomaly
        raw_score = model.decision_function(sample_vec)[0]

        # Normalization mapping:
        # Typical decision_function values range from -0.35 (severe anomaly) to +0.25 (typical normal)
        # We transform this into anomaly index in [0.0, 1.0]:
        normalized_anomaly = 1.0 / (1.0 + np.exp(8.0 * raw_score))
        return float(np.clip(normalized_anomaly, 0.0, 1.0))

ml_detector = AnomalyDetector()
