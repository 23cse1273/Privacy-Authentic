"""Risk evaluation and XAI schemas."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.schemas.telemetry import BiometricFeaturesSchema

class XaiExplanationItem(BaseModel):
    feature: str
    key: str
    impactScore: float
    liveValue: float
    baselineValue: float
    percentDeviation: float
    isHighRisk: bool

class RiskEvaluationResponse(BaseModel):
    rawAnomalyScore: float
    riskScore: float
    decision: str  # CONTINUE | STEP_UP_MFA | RESTRICT
    statusMessage: str
    xaiExplanations: List[XaiExplanationItem]
    evaluatedAt: str
    features: Optional[BiometricFeaturesSchema] = None

class BaselineResponse(BaseModel):
    userId: str
    calibrated: bool
    baseline: Dict[str, float]
    updatedAt: str

class AuditLogItem(BaseModel):
    id: str
    timestamp: str
    riskScore: float
    decision: str
    topFactor: str
