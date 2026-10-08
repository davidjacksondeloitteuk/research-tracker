from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=255)
    first_name: str = Field(min_length=1, max_length=255)
    last_name: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=8, max_length=255)
    profile_picture: str | None = Field(default=None, max_length=255)


class UserResponse(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    profile_picture: str | None = None
    date_created: datetime

    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    username: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=1, max_length=255)


class UserProjectCreate(BaseModel):
    user_id: int
    is_lead: bool = False


class UserProjectResponse(BaseModel):
    user_id: int
    project_id: int
    is_lead: bool = False
    user: UserResponse

    model_config = ConfigDict(from_attributes=True)


class UserTaskCreate(BaseModel):
    user_id: int
    task_id: int


class UserTaskResponse(BaseModel):
    user_id: int
    task_id: int

    model_config = ConfigDict(from_attributes=True)
