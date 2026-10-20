"""Dynamic Risk Engine with exponential smoothing and adaptive security policy."""

from typing import Dict, Any, Tuple
from app.config import settings

class RiskEngine:
    def __init__(self):
        # In-memory tracking of ongoing user risk states
        self.session_risk: Dict[str, float] = {}

    def calculate_risk(self, user_id: str, anomaly_score: float) -> Tuple[float, str, str]:
        """
        Calculates dynamic smoothed risk score and adaptive security action.
        Returns: (smoothed_risk, decision, status_message)
        """
        previous_risk = self.session_risk.get(user_id, 15.0)

        # Scale raw anomaly (0.0 - 1.0) to risk points (0 - 100)
        instant_risk = anomaly_score * 100.0

        # Exponential moving average smoothing:
        # Risk_t = alpha * Instant_Risk + (1 - alpha) * Previous_Risk
        alpha = settings.SMOOTHING_ALPHA
        smoothed_risk = round(alpha * instant_risk + (1.0 - alpha) * previous_risk, 1)
        self.session_risk[user_id] = smoothed_risk

        # Adaptive Authentication Policy Evaluation
        if smoothed_risk >= settings.RISK_RESTRICT_THRESHOLD:
            decision = "RESTRICT"
            message = "Critical anomaly detected! Session restricted by continuous authentication policy."
        elif smoothed_risk >= settings.RISK_MFA_THRESHOLD:
            decision = "STEP_UP_MFA"
            message = "Unusual behavioral deviation detected. Adaptive Step-Up MFA required."
        else:
            decision = "CONTINUE"
            message = "Biometric dynamics match legitimate profile. Session healthy."

        return smoothed_risk, decision, message

    def reset_risk_after_mfa(self, user_id: str) -> float:
        """Reset user risk score after successful MFA challenge verification."""
        self.session_risk[user_id] = 12.0
        return 12.0

risk_engine = RiskEngine()
