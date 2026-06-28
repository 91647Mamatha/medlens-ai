from fastapi import APIRouter, Depends, HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.nlp_service.models import NLPRequest
from backendservices.nlp_service.service import extract_entities
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/nlp",
    tags=["NLP Service"]
)

@router.post("/entities")
def get_entities(data: NLPRequest, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"NLP attempt: {data.report_id} by {current_user['email']}")
        result = extract_entities(data.report_id, data.extracted_text)
        logger.info(f"NLP success: {data.report_id}")
        return result
    except Exception as e:
        logger.error(f"NLP error: {str(e)}")
        raise HTTPException(status_code=500, detail="Entity extraction failed!")