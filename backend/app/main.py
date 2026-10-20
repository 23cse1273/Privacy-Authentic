"""FastAPI Application entry point for Privacy-Preserving Continuous Authentication."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db, SessionLocal
from app.models.user import User
from app.models.baseline import BehavioralBaseline
from app.services.auth_service import auth_service
from app.services.ml_detector import DEFAULT_BASELINE_VECTOR
from app.api.routes_auth import router as auth_router
from app.api.routes_telemetry import router as telemetry_router
from app.api.websocket_handler import router as websocket_router
import json

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle management."""
    # 1. Initialize DB tables
    init_db()

    # 2. Seed default demo user if not already created
    db = SessionLocal()
    try:
        demo = db.query(User).filter(User.email == "manpreet@cgc.edu.in").first()
        if not demo:
            demo = User(
                id="usr_demo_101",
                email="manpreet@cgc.edu.in",
                full_name="Manpreet Singh",
                hashed_password=auth_service.hash_password("Password@123"),
                totp_secret=auth_service.generate_totp_secret(),
                is_mfa_enabled=True,
                baseline_calibrated=True,
            )
            db.add(demo)
            baseline = BehavioralBaseline(
                id="base_demo_101",
                user_id="usr_demo_101",
                features_json=json.dumps(DEFAULT_BASELINE_VECTOR),
                sample_count=10,
            )
            db.add(baseline)
            db.commit()
    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Privacy-Preserving Continuous User Authentication Using Multimodal Behavioral Biometrics and Explainable AI",
    lifespan=lifespan,
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(telemetry_router, prefix=settings.API_PREFIX)
app.include_router(websocket_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "anomaly_detector": "Isolation Forest Ready",
        "xai_engine": "Active",
    }
