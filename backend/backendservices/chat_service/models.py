from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    question: str
    report_text: Optional[str] = None
    report_id: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    message: str

class ChatResponse(BaseModel):
    question: str
    answer: str
    mode: str
    source: str