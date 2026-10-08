from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Project, Task, User
from app.database.schemas.task_schemas import TaskCreate, TaskResponse

router = APIRouter()


@router.get(
    "/api/tasks/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    tags=["tasks"],
)
def get_tasks(task_id: int, db: Session = Depends(get_db)) -> TaskResponse:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post(
    "/api/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["tasks"],
)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)) -> TaskResponse:
    if db.get(Project, payload.project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if db.get(User, payload.user_created_id) is None:
        raise HTTPException(status_code=404, detail="Owner not found")

    task = Task(
        project_id=payload.project_id,
        title=payload.title,
        description=payload.description,
        user_created_id=payload.user_created_id,
    )

    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put(
    "/api/tasks/{task_id}/toggle-complete",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    tags=["tasks"],
)
def toggle_task_complete(task_id: int, db: Session = Depends(get_db)) -> TaskResponse:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = not task.completed
    db.commit()
    db.refresh(task)
    return task