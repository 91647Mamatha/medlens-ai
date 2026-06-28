from fastapi import APIRouter, Depends, HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.history_service.service import save_full_report, get_all_reports, get_report_by_id, delete_report
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/history",
    tags=["History Service"]
)

@router.post("/save/{report_id}")
def save(report_id: str, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Save report attempt: {report_id} by {current_user['email']}")
        result = save_full_report(report_id, current_user["email"])
        logger.info(f"Save report success: {report_id}")
        return result
    except Exception as e:
        logger.error(f"Save report error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not save report!")

@router.get("/all")
def get_all(current_user: dict = Depends(get_current_user)):
    try:
        return get_all_reports(current_user["email"])
    except Exception as e:
        logger.error(f"Fetch history error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch history!")

@router.get("/{report_id}")
def get_one(report_id: str, current_user: dict = Depends(get_current_user)):
    try:
        return get_report_by_id(report_id)
    except Exception as e:
        logger.error(f"Fetch report error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch report!")

@router.delete("/{report_id}")
def delete(report_id: str, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Delete report attempt: {report_id} by {current_user['email']}")
        result = delete_report(report_id, current_user["email"])
        logger.info(f"Delete report success: {report_id}")
        return result
    except Exception as e:
        logger.error(f"Delete report error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not delete report!")