import hashlib
import re

from backendservices.auth_service.models import UserRegister, UserLogin
from backendservices.auth_service.jwt_handler import create_access_token
from database import get_user_by_email, save_user


def validate_password(password: str):
    if len(password) < 8:
        return "Password must be at least 8 characters long"

    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter"

    if not re.search(r"[0-9]", password):
        return "Password must contain at least one number"

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Password must contain at least one special character"

    return None


def register_user(user: UserRegister):
    existing = get_user_by_email(user.email)
    if existing:
        return {"message": "User already exists"}

    password_error = validate_password(user.password)
    if password_error:
        return {
            "error": True,
            "message": password_error
        }

    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    save_user(user.full_name, user.email, hashed_password, user.role)

    return {"message": "User registered successfully"}


def login_user(user: UserLogin):
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    existing = get_user_by_email(user.email)

    if existing and existing["password"] == hashed_password:
        token = create_access_token({
            "email": existing["email"],
            "role": existing["role"],
            "full_name": existing["full_name"]
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": existing["role"],
            "full_name": existing["full_name"]
        }

    return {"message": "Invalid email or password"}


def get_profile(current_user: dict):
    return {
        "full_name": current_user["full_name"],
        "email": current_user["email"],
        "role": current_user["role"]
    }