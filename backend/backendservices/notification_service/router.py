from fastapi import APIRouter, Depends, HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.notification_service.service import (
    get_my_notifications,
    read_notification
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/notifications",
    tags=["Notification Service"]
)

@router.get("/my")
def my_notifications(current_user: dict = Depends(get_current_user)):
    try:
        return get_my_notifications(current_user["email"])
    except Exception as e:
        logger.error(f"Fetch notifications error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch notifications!")

@router.put("/read/{notification_id}")
def mark_read(notification_id: int, current_user: dict = Depends(get_current_user)):
    try:
        return read_notification(notification_id)
    except Exception as e:
        logger.error(f"Mark read error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not mark notification as read!")