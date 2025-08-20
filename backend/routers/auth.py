from core.db import SessionDependency
from core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    create_refresh_token,
    verify_password,
)
from fastapi import APIRouter, HTTPException, Response, status
from repositories.user import UserRepository
from schemas import UserCreate, UserRead

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
)
async def register(user_data: UserCreate, session: SessionDependency):
    repo = UserRepository(session)

    existing_user = await repo.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )

    new_user = await repo.create_user(
        email=user_data.email, password=user_data.password
    )

    return {"message": "Registered successfully"}


@router.post("/login")
async def login(user_data: UserCreate, response: Response, session: SessionDependency):
    repo = UserRepository(session)
    existing_user = await repo.get_user_by_email(user_data.email)

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not verify_password(user_data.password, existing_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(data={"sub": str(existing_user.id)})
    refresh_token = create_refresh_token(data={"sub": str(existing_user.id)})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=True,
        samesite="lax",
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        secure=True,
        samesite="lax",
    )

    return {"message": "Logged in successfully"}
