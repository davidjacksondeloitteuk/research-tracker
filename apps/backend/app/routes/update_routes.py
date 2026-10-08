from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Update, User
from app.database.schemas.update_schemas import UpdateCreate, UpdateEdit, UpdateResponse

router = APIRouter()


@router.get(
    "/api/updates",
    response_model=list[UpdateResponse],
    status_code=status.HTTP_200_OK,
    tags=["updates"],
)
def get_updates(db: Session = Depends(get_db)) -> list[UpdateResponse]:
    return db.query(Update).all()


@router.post(
    "/api/updates",
    response_model=UpdateResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["updates"],
)
def create_update(
    payload: UpdateCreate, db: Session = Depends(get_db)
) -> UpdateResponse:

    if db.get(User, payload.user_created_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found"
        )

    new_update = Update(
        title=payload.title,
        content=payload.content,
        user_created_id=payload.user_created_id,
        task_id=payload.task_id,
    )
    db.add(new_update)
    db.commit()
    db.refresh(new_update)

    return new_update


@router.put(
    "/api/updates/{update_id}",
    response_model=UpdateResponse,
    status_code=status.HTTP_200_OK,
    tags=["updates"],
)
def update_update(
    update_id: int, payload: UpdateEdit, db: Session = Depends(get_db)
) -> UpdateResponse:
    update = db.get(Update, update_id)
    if update is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Update not found"
        )

    update.title = payload.title
    update.content = payload.content

    db.commit()
    db.refresh(update)

    return update


@router.delete(
    "/api/updates/{update_id}",
    status_code=status.HTTP_201_CREATED,
    tags=["updates"],
)
def delete_update(update_id: int, db: Session = Depends(get_db)) -> None:
    update = db.get(Update, update_id)
    if update is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Update not found"
        )
    db.delete(update)
    db.commit()
    return None
