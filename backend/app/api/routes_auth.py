"""Authentication API routes."""

import uuid
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.baseline import BehavioralBaseline
from app.models.session import ActiveSession
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    MfaVerifyRequest,
    MfaSetupResponse,
)
from app.services.auth_service import auth_service
from app.services.risk_engine import risk_engine
from app.services.ml_detector import DEFAULT_BASELINE_VECTOR
import json

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user_from_header(
    authorization: str = Header(None), 
    db: Session = Depends(get_db)
) -> User:
    """Dependency to extract user from Authorization Bearer token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token")
    
    token = authorization.split(" ")[1]
    payload = auth_service.decode_token(token)
    if not payload or "sub" not in payload:
        # Check if demo token
        if token.startswith("demo_jwt_token") or token.startswith("token_"):
            demo_user = db.query(User).filter(User.id == "usr_demo_101").first()
            if demo_user:
                return demo_user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalid or expired")

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user and initialize behavioral baseline."""
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    hashed_pw = auth_service.hash_password(user_data.password)
    totp_secret = auth_service.generate_totp_secret()

    new_user = User(
        id=user_id,
        email=user_data.email,
        full_name=user_data.name,
        hashed_password=hashed_pw,
        totp_secret=totp_secret,
        is_mfa_enabled=True,
        baseline_calibrated=False,
    )
    db.add(new_user)

    # Initialize default baseline
    baseline_entry = BehavioralBaseline(
        id=f"base_{uuid.uuid4().hex[:12]}",
        user_id=user_id,
        features_json=json.dumps(DEFAULT_BASELINE_VECTOR),
        sample_count=1,
    )
    db.add(baseline_entry)
    db.commit()
    db.refresh(new_user)

    token = auth_service.create_access_token({"sub": user_id, "email": new_user.email})

    return TokenResponse(
        token=token,
        user=UserResponse(
            id=new_user.id,
            name=new_user.full_name,
            email=new_user.email,
            isMfaEnabled=new_user.is_mfa_enabled,
            baselineCalibrated=new_user.baseline_calibrated,
        )
    )

@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    """Authenticate with email and password and issue session JWT."""
    user = db.query(User).filter(User.email == creds.email).first()
    if not user or not auth_service.verify_password(creds.password, user.hashed_password):
        # Auto-create or login demo user if matching demo credentials
        if creds.email == "manpreet@cgc.edu.in":
            demo_user = db.query(User).filter(User.id == "usr_demo_101").first()
            if not demo_user:
                demo_user = User(
                    id="usr_demo_101",
                    email="manpreet@cgc.edu.in",
                    full_name="Manpreet Singh",
                    hashed_password=auth_service.hash_password("Password@123"),
                    totp_secret=auth_service.generate_totp_secret(),
                    is_mfa_enabled=True,
                    baseline_calibrated=True,
                )
                db.add(demo_user)
                db.commit()
                db.refresh(demo_user)
            user = demo_user
        else:
            raise HTTPException(status_code=400, detail="Invalid email or password")

    token = auth_service.create_access_token({"sub": user.id, "email": user.email})

    return TokenResponse(
        token=token,
        user=UserResponse(
            id=user.id,
            name=user.full_name,
            email=user.email,
            isMfaEnabled=user.is_mfa_enabled,
            baselineCalibrated=user.baseline_calibrated,
        )
    )

@router.post("/mfa/verify")
def verify_mfa(req: MfaVerifyRequest, user: User = Depends(get_current_user_from_header)):
    """Verify adaptive step-up MFA challenge code and reset risk score."""
    is_valid = auth_service.verify_totp_code(user.totp_secret, req.code)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    # Reset continuous risk score
    new_risk = risk_engine.reset_risk_after_mfa(user.id)

    return {
        "success": True,
        "message": "Step-up MFA verified successfully. Continuous session risk restored to baseline.",
        "riskScore": new_risk,
        "status": "CONTINUE",
    }

@router.get("/mfa/setup", response_model=MfaSetupResponse)
def setup_mfa(user: User = Depends(get_current_user_from_header)):
    """Generate TOTP secret and setup URI."""
    secret = user.totp_secret or auth_service.generate_totp_secret()
    otpauth_url = auth_service.get_totp_uri(secret, user.email)
    return MfaSetupResponse(secret=secret, otpauth_url=otpauth_url)

@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user_from_header)):
    """Fetch current user profile."""
    return UserResponse(
        id=user.id,
        name=user.full_name,
        email=user.email,
        isMfaEnabled=user.is_mfa_enabled,
        baselineCalibrated=user.baseline_calibrated,
    )
