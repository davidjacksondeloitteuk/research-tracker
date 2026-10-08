import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.database.schemas.user_schemas import UserCreate, UserLogin, UserResponse

router = APIRouter(prefix="/api/users")


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 200_000)
    return f"pbkdf2_sha256${salt}${digest.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        algorithm, salt, digest_hex = password_hash.split("$", 2)
        if algorithm != "pbkdf2_sha256":
            return False

        digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 200_000)
        return secrets.compare_digest(digest.hex(), digest_hex)
    except ValueError:
        return False


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["users"])
def register_user(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    existing_user = db.scalar(select(User).where(User.username == payload.username))
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")

    user = User(
        username=payload.username,
        first_name=payload.first_name,
        last_name=payload.last_name,
        profile_picture=payload.profile_picture,
        password_hash=hash_password(payload.password),
    )
    db.add(user)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists") from exc

    db.refresh(user)
    return user


@router.post("/login", response_model=UserResponse, tags=["users"])
def login_user(payload: UserLogin, db: Session = Depends(get_db)) -> User:
    user = db.scalar(select(User).where(User.username == payload.username))

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    return user
