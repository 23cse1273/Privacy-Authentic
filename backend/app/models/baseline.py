"""Behavioral Baseline ORM Model."""

from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.database import Base

class BehavioralBaseline(Base):
    __tablename__ = "behavioral_baselines"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), index=True, nullable=False)
    features_json = Column(Text, nullable=False)        # JSON string of calibrated feature statistics
    sample_count = Column(Integer, default=1)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
