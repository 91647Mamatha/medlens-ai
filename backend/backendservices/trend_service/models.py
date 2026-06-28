from pydantic import BaseModel
from typing import List

class TrendRequest(BaseModel):
    pass

class ValueTrend(BaseModel):
    parameter: str
    values: List[str]
    trend: str
    status: str

class TrendResponse(BaseModel):
    total_reports: int
    trend_analysis: str
    overall_health: str