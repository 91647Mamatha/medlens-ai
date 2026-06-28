from fastapi import APIRouter, Depends, HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.summary_service.models import SummaryRequest
from backendservices.summary_service.service import generate_summary
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/summary",
    tags=["Summary Service"]
)

@router.post("/generate")
def get_summary(data: SummaryRequest, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Summary attempt: {data.report_id} by {current_user['email']}")
        result = generate_summary(data.report_id, data.extracted_text)
        logger.info(f"Summary success: {data.report_id}")

        if current_user["role"] == "patient":
            return {
                "report_id": result["report_id"],
                "patient_summary": result.get("patient_summary", ""),
                "health_tips": result.get("health_tips", ""),
                "recommendations": result.get("recommendations", ""),
                "source": "Groq"
            }
        elif current_user["role"] == "doctor":
            return {
                "report_id": result["report_id"],
                "doctor_summary": result.get("doctor_summary", ""),
                "abnormal_values": result.get("abnormal_values", ""),
                "source": "Groq"
            }
    except Exception as e:
        logger.error(f"Summary error: {str(e)}")
        raise HTTPException(status_code=500, detail="Summary generation failed!")