from datetime import datetime

from pydantic import BaseModel, ConfigDict
from app.database.schemas.user_schemas import UserResponse

class UpdateCreate(BaseModel):
    title: str
    content: str
    user_created_id: int
    task_id: int

class UpdateResponse(BaseModel):
    id: int
    task_id: int
    title: str
    content: str
    user_created: UserResponse
    date_created: datetime

    model_config = ConfigDict(from_attributes=True)


class UpdateEdit(BaseModel):
    title: str
    content: str