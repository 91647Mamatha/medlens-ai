from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "patient"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserProfile(BaseModel):
    full_name: str
    email: str
    role: str