from core.db import SessionDependency
from fastapi import APIRouter, HTTPException, status
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

    return UserRead(
        id=new_user.id, email=new_user.email, created_at=new_user.created_at
    )
