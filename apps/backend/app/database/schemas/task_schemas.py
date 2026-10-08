from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field
from app.database.schemas.user_schemas import UserTaskResponse, UserResponse
from app.database.schemas.update_schemas import UpdateResponse


class TaskDraft(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    user_created_id: int
    project_id: int


class TaskResponse(BaseModel):
    id: int
    title: str = Field(validation_alias="title")
    description: str | None = Field(default=None, max_length=255)
    project_id: int
    date_created: datetime
    user_created:  UserResponse | None
    completed: bool
    in_review: bool
    assigned_users: list[UserTaskResponse] = Field(default_factory=list)
    updates: list[UpdateResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)