"""Telemetry and Continuous Biometric Evaluation API routes."""

import uuid
import json
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.baseline import BehavioralBaseline
from app.models.audit import AuditLog
from app.schemas.telemetry import TelemetryBatchRequest, BiometricFeaturesSchema
from app.schemas.risk import RiskEvaluationResponse, BaselineResponse, AuditLogItem, XaiExplanationItem
from app.services.ml_detector import ml_detector, DEFAULT_BASELINE_VECTOR
from app.services.risk_engine import risk_engine
from app.services.xai_explainer import xai_explainer
from app.api.routes_auth import get_current_user_from_header

router = APIRouter(prefix="/telemetry", tags=["Telemetry & Evaluation"])

@router.post("/evaluate", response_model=RiskEvaluationResponse)
def evaluate_telemetry(
    req: TelemetryBatchRequest,
    user: User = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    """
    Evaluates privacy-preserving multimodal feature batch.
    1. Compares with calibrated baseline
    2. Runs Isolation Forest anomaly model
    3. Smooths dynamic risk score over sliding window
    4. Computes Explainable AI (XAI) feature attribution
    5. Records compliance audit trail
    """
    features_dict = req.features.dict()

    # Retrieve user's baseline
    baseline_record = db.query(BehavioralBaseline).filter(BehavioralBaseline.user_id == user.id).first()
    if baseline_record and baseline_record.features_json:
        baseline_features = json.loads(baseline_record.features_json)
    else:
        baseline_features = DEFAULT_BASELINE_VECTOR

    # 1. Isolation Forest Anomaly Scoring
    anomaly_score = ml_detector.evaluate_sample(user.id, features_dict, baseline_features)

    # 2. Dynamic Risk Smoothing & Adaptive Decision
    smoothed_risk, decision, status_message = risk_engine.calculate_risk(user.id, anomaly_score)

    # 3. Explainable AI (XAI) Attribution
    xai_factors = xai_explainer.explain_anomaly(features_dict, baseline_features)

    # 4. Record Audit Log Entry
    audit_entry = AuditLog(
        id=f"log_{uuid.uuid4().hex[:12]}",
        user_id=user.id,
        risk_score=smoothed_risk,
        decision=decision,
        top_factors_json=json.dumps(xai_factors),
        evaluated_at=datetime.utcnow()
    )
    db.add(audit_entry)
    db.commit()

    return RiskEvaluationResponse(
        rawAnomalyScore=round(anomaly_score, 3),
        riskScore=smoothed_risk,
        decision=decision,
        statusMessage=status_message,
        xaiExplanations=[XaiExplanationItem(**factor) for factor in xai_factors],
        evaluatedAt=datetime.utcnow().isoformat(),
        features=req.features,
    )

@router.post("/calibrate", response_model=BaselineResponse)
def calibrate_baseline(
    new_features: BiometricFeaturesSchema,
    user: User = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    """Calibrate and update legitimate user baseline profile and retrain ML model."""
    features_dict = new_features.dict()

    baseline_record = db.query(BehavioralBaseline).filter(BehavioralBaseline.user_id == user.id).first()
    if not baseline_record:
        baseline_record = BehavioralBaseline(
            id=f"base_{uuid.uuid4().hex[:12]}",
            user_id=user.id,
            features_json=json.dumps(features_dict),
            sample_count=1,
        )
        db.add(baseline_record)
    else:
        baseline_record.features_json = json.dumps(features_dict)
        baseline_record.sample_count += 1

    user.baseline_calibrated = True
    db.commit()

    # Retrain user's Isolation Forest model around newly calibrated baseline
    ml_detector.train_baseline_model(user.id, features_dict)
    risk_engine.reset_risk_after_mfa(user.id)

    return BaselineResponse(
        userId=user.id,
        calibrated=True,
        baseline=features_dict,
        updatedAt=datetime.utcnow().isoformat()
    )

@router.get("/baseline", response_model=BaselineResponse)
def get_baseline(
    user: User = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    """Retrieve calibrated baseline profile."""
    record = db.query(BehavioralBaseline).filter(BehavioralBaseline.user_id == user.id).first()
    if record and record.features_json:
        baseline = json.loads(record.features_json)
    else:
        baseline = DEFAULT_BASELINE_VECTOR

    return BaselineResponse(
        userId=user.id,
        calibrated=user.baseline_calibrated,
        baseline=baseline,
        updatedAt=record.updated_at.isoformat() if record else datetime.utcnow().isoformat()
    )

@router.get("/audit-logs", response_model=List[AuditLogItem])
def get_audit_logs(
    user: User = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    """Retrieve recent continuous authentication audit logs."""
    logs = db.query(AuditLog).filter(AuditLog.user_id == user.id).order_by(AuditLog.evaluated_at.desc()).limit(30).all()
    
    result = []
    for log in logs:
        top_factor_str = "Consistent with baseline profile"
        if log.top_factors_json:
            factors = json.loads(log.top_factors_json)
            if factors and len(factors) > 0:
                top_factor_str = f"{factors[0]['feature']} ({factors[0]['percentDeviation']}%)"

        result.append(AuditLogItem(
            id=log.id,
            timestamp=log.evaluated_at.strftime("%H:%M:%S"),
            riskScore=log.risk_score,
            decision=log.decision,
            topFactor=top_factor_str
        ))
    return result
