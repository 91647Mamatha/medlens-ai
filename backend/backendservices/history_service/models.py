from pydantic import BaseModel
from typing import List, Optional

class SaveReportRequest(BaseModel):
    report_id: str
    file_name: str
    extracted_text: str
    entities: list
    patient_summary: str
    doctor_summary: str
    abnormal_values: str
    health_tips: str
    recommendations: str

class ReportHistory(BaseModel):
    report_id: str
    file_name: str
    patient_summary: str
    abnormal_values: str
    created_at: str