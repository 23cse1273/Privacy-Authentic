import os

class Settings:
    """Application Settings and Configuration."""
    PROJECT_NAME: str = "Privacy-Preserving Continuous User Authentication"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Database Configuration (Defaults to SQLite; override with PostgreSQL via DATABASE_URL)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./pca_database.db"
    )

    # JWT Authentication
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super-secret-continuous-auth-key-2026")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 240

    # Risk Engine Configuration
    RISK_MFA_THRESHOLD: float = 45.0       # Score >= 45 triggers Step-Up MFA
    RISK_RESTRICT_THRESHOLD: float = 75.0  # Score >= 75 restricts session
    SMOOTHING_ALPHA: float = 0.35          # Exponential moving average weight for smoothing

    # CORS Allowed Origins
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

settings = Settings()
