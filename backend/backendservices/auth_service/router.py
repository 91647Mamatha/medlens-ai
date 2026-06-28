from fastapi import APIRouter, Depends, HTTPException
from backendservices.auth_service.models import UserRegister, UserLogin
from backendservices.auth_service.service import register_user, login_user, get_profile
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.auth_service.role_guard import require_patient, require_doctor
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(user: UserRegister):
    try:
        logger.info(f"Register attempt: {user.email}")
        result = register_user(user)
        logger.info(f"Register success: {user.email}")
        return result
    except Exception as e:
        logger.error(f"Register error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed!")

@router.post("/login")
def login(user: UserLogin):
    try:
        logger.info(f"Login attempt: {user.email}")
        result = login_user(user)
        if "access_token" in result:
            logger.info(f"Login success: {user.email}")
        else:
            logger.warning(f"Login failed: {user.email}")
        return result
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed!")

@router.get("/profile")
def profile(current_user: dict = Depends(get_current_user)):
    try:
        return get_profile(current_user)
    except Exception as e:
        logger.error(f"Profile error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch profile!")

@router.get("/verify")
def verify(current_user: dict = Depends(get_current_user)):
    try:
        return {
            "valid": True,
            "email": current_user["email"],
            "role": current_user["role"]
        }
    except Exception as e:
        logger.error(f"Verify error: {str(e)}")
        raise HTTPException(status_code=500, detail="Token verification failed!")

@router.get("/doctor-only")
def doctor_only(current_user: dict = Depends(require_doctor)):
    return {"message": f"Welcome Dr. {current_user['full_name']}!"}

@router.get("/patient-only")
def patient_only(current_user: dict = Depends(require_patient)):
    return {"message": f"Welcome {current_user['full_name']}!"}