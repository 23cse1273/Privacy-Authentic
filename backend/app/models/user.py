"""User ORM Model."""

from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    totp_secret = Column(String(64), nullable=True)
    is_mfa_enabled = Column(Boolean, default=True)
    baseline_calibrated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
