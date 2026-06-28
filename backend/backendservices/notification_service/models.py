from pydantic import BaseModel

class NotificationCreate(BaseModel):
    user_email: str
    title: str
    message: str
    type: str