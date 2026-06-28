from pydantic import BaseModel
from typing import Optional

class UploadResponse(BaseModel):
    message: str
    report_id: str
    file_key: str
    file_name: str
    file_type: str
    file_size: str
    uploaded_by: str
    uploaded_at: str

class FileInfo(BaseModel):
    report_id: str
    file_key: str
    file_name: str
    file_type: str
    file_size: str
    uploaded_by: str
    uploaded_at: str