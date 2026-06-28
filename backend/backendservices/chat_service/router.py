from fastapi import APIRouter, Depends, HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.chat_service.models import ChatRequest
from backendservices.chat_service.service import chat, get_chat_history_by_report
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/chat",
    tags=["AI Health Assistant"]
)

@router.post("/ask")
def ask(data: ChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Chat attempt by {current_user['email']}: {data.question}")
        result = chat(
            data.question,
            data.report_text,
            data.report_id,
            current_user["email"]
        )
        logger.info(f"Chat success: mode={result.get('mode')} source={result.get('source')}")
        return result
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Chat failed!")

@router.get("/history/{report_id}")
def history(report_id: str, current_user: dict = Depends(get_current_user)):
    try:
        return get_chat_history_by_report(report_id)
    except Exception as e:
        logger.error(f"Chat history error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch chat history!")