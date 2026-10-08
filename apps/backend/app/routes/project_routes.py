from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Project, Task, User, UserProject
from app.database.schemas.project_schemas import ProjectCreate, ProjectResponse

router = APIRouter()


@router.get(
    "/api/projects",
    response_model=list[ProjectResponse],
    status_code=status.HTTP_200_OK,
    tags=["projects"],
)
def list_projects(db: Session = Depends(get_db)) -> list[ProjectResponse]:
    projects = db.query(Project).all()
    return projects


@router.post(
    "/api/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["projects"],
)
def create_project(
    payload: ProjectCreate, db: Session = Depends(get_db)
) -> ProjectResponse:

    if db.get(User, payload.user_created_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found"
        )

    new_project = Project(
        name=payload.name,
        description=payload.description,
        user_created_id=payload.user_created_id,
    )
    db.add(new_project)
    db.flush()

    for user in payload.assigned_users:
        if db.get(User, user.user_id) is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        user_project = UserProject(
            user_id=user.user_id,
            project_id=new_project.id,
            is_lead=user.is_lead,
        )
        db.add(user_project)

    for task in payload.tasks:
        new_task = Task(
            title=task.title,
            description=task.description,
            user_created_id=payload.user_created_id,
            project_id=new_project.id,
        )
        db.add(new_task)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A project with this name already exists",
        ) from exc
    db.refresh(new_project)
    return new_project


@router.get(
    "/api/projects/{project_id}",
    response_model=ProjectResponse,
    status_code=status.HTTP_200_OK,
    tags=["projects"],
)
def get_project(project_id: int, db: Session = Depends(get_db)) -> ProjectResponse:

    # Get project
    project = db.query(Project).filter(Project.id == project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return project
