"""Active Session ORM Model."""

from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime
from app.database import Base

class ActiveSession(Base):
    __tablename__ = "active_sessions"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), index=True, nullable=False)
    status = Column(String(32), default="CONTINUE")      # CONTINUE, STEP_UP_MFA, RESTRICTED
    current_risk_score = Column(Float, default=15.0)
    device_fingerprint = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_evaluated_at = Column(DateTime, default=datetime.utcnow)
