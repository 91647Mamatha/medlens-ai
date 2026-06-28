from fastapi import HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from fastapi import Depends

def require_role(required_role: str):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] != required_role:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied! {required_role.capitalize()}s only!"
            )
        return current_user
    return role_checker

def require_patient(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "patient":
        raise HTTPException(
            status_code=403,
            detail="Access denied! Patients only!"
        )
    return current_user

def require_doctor(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "doctor":
        raise HTTPException(
            status_code=403,
            detail="Access denied! Doctors only!"
        )
    return current_user