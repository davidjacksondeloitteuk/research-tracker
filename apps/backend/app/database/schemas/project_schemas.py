from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field
from app.database.schemas.task_schemas import TaskDraft, TaskResponse
from app.database.schemas.user_schemas import UserProjectCreate, UserProjectResponse, UserResponse
from app.database.schemas.update_schemas import UpdateResponse

class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    user_created_id: int
    assigned_users: list[UserProjectCreate] = Field(default_factory=list)
    tasks: list[TaskDraft] = Field(default_factory=list)


class ProjectResponse(BaseModel):
    id: int
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    date_created: datetime
    user_created: UserResponse | None
    tasks: list[TaskResponse] = Field(default_factory=list)
    assigned_users: list[UserProjectResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)