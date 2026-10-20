"""Audit Log ORM Model."""

from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), index=True, nullable=False)
    session_id = Column(String(64), nullable=True)
    risk_score = Column(Float, nullable=False)
    decision = Column(String(32), nullable=False)        # CONTINUE, STEP_UP_MFA, RESTRICT
    top_factors_json = Column(Text, nullable=True)       # JSON string of XAI attribution factors
    evaluated_at = Column(DateTime, default=datetime.utcnow)
