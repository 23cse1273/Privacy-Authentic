"""Authentication schemas."""

from typing import Optional
from pydantic import BaseModel

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str = "Authenticated User"
    isMfaEnabled: bool = True
    baselineCalibrated: bool = False

class TokenResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserResponse

class MfaVerifyRequest(BaseModel):
    code: str

class MfaSetupResponse(BaseModel):
    secret: str
    otpauth_url: str
