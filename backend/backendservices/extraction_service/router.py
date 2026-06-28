from fastapi import APIRouter, Depends, HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.extraction_service.models import ExtractionRequest
from backendservices.extraction_service.service import extract_text
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/extract",
    tags=["Extraction Service"]
)

@router.post("/text")
def extract(data: ExtractionRequest, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Extraction attempt: {data.report_id} by {current_user['email']}")
        result = extract_text(data.report_id)
        logger.info(f"Extraction success: {data.report_id}")
        return result
    except Exception as e:
        logger.error(f"Extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Text extraction failed!")