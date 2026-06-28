from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.upload_service.service import upload_file, get_my_uploads
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/upload",
    tags=["Upload Service"]
)

@router.post("/report")
async def upload_report(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        logger.info(f"Upload attempt by {current_user['email']}: {file.filename}")
        result = await upload_file(file, current_user)
        logger.info(f"Upload success: {file.filename}")
        return result
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="File upload failed!")

@router.get("/my-uploads")
def my_uploads(current_user: dict = Depends(get_current_user)):
    try:
        return get_my_uploads(current_user)
    except Exception as e:
        logger.error(f"Fetch uploads error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch uploads!")