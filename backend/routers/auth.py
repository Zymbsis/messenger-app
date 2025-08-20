from typing import Annotated

from core.auth.cookies import set_auth_cookies
from core.auth.jwt import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from core.auth.security import verify_password
from core.db import SessionDependency
from fastapi import APIRouter, Cookie, HTTPException, Response, status
from repositories.user import UserRepository
from schemas import UserCreate, UserRead

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/register",
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

    await repo.create_user(email=user_data.email, password=user_data.password)

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

    set_auth_cookies(
        response,
        access_token,
        refresh_token,
        access_expires_minutes=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        refresh_expires_minutes=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {"message": "Logged in successfully"}


@router.post("/refresh")
async def refresh(response: Response, refresh_token: str | None = Cookie(default=None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    payload = verify_token(refresh_token)
    user_id = payload.sub

    access_token = create_access_token(data={"sub": str(user_id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user_id)})

    set_auth_cookies(
        response,
        access_token,
        new_refresh_token,
        access_expires_minutes=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        refresh_expires_minutes=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {"message": "Refreshed successfully"}


@router.post("/logout")
async def logout(
    response: Response,
):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")

    return {"message": "Logged out successfully"}
