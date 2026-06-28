from fastapi import APIRouter, Depends, HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.trend_service.service import analyze_trend
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/trend",
    tags=["Health Trend Service"]
)

@router.get("/analyze")
def get_trend(current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Trend analysis by {current_user['email']}")
        result = analyze_trend(current_user["email"])
        logger.info(f"Trend analysis success for {current_user['email']}")
        return result
    except Exception as e:
        logger.error(f"Trend analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Trend analysis failed!")