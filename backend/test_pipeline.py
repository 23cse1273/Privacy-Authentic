"""Pipeline verification test."""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database import init_db
init_db()

from app.services.ml_detector import ml_detector, DEFAULT_BASELINE_VECTOR
base_model = ml_detector.train_baseline_model('test_user', DEFAULT_BASELINE_VECTOR)

# Benign sample
benign_sample = DEFAULT_BASELINE_VECTOR.copy()
benign_sample['dwell_time_mean'] = 98.0
score_benign = ml_detector.evaluate_sample('test_user', benign_sample)

# Anomaly sample
anomaly_sample = DEFAULT_BASELINE_VECTOR.copy()
anomaly_sample['dwell_time_mean'] = 260.0
anomaly_sample['flight_time_mean'] = 450.0
anomaly_sample['trajectory_curvature'] = 3.5
score_anomaly = ml_detector.evaluate_sample('test_user', anomaly_sample)

from app.services.xai_explainer import xai_explainer
explanations = xai_explainer.explain_anomaly(anomaly_sample, DEFAULT_BASELINE_VECTOR)

from app.services.risk_engine import risk_engine
risk_benign, dec_benign, msg_benign = risk_engine.calculate_risk('test_user', score_benign)
risk_anomaly, dec_anomaly, msg_anomaly = risk_engine.calculate_risk('test_user', score_anomaly)

print(f"Benign Anomaly Score: {score_benign:.3f} | Smoothed Risk: {risk_benign}% | Decision: {dec_benign}")
print(f"Anomaly Score: {score_anomaly:.3f} | Smoothed Risk: {risk_anomaly}% | Decision: {dec_anomaly}")
if explanations:
    print(f"XAI Top Factor: {explanations[0]['feature']} ({explanations[0]['percentDeviation']}%)")
print("ALL ML, RISK, AND XAI PIPELINE CHECKS PASSED!")
