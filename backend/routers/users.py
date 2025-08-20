from core.auth.dependencies import CurrentUserDependency
from core.db import SessionDependency
from fastapi import APIRouter
from repositories.user import UserRepository
from schemas import UserRead

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/current-user", response_model=UserRead)
async def get_current_user(current_user: CurrentUserDependency):
    return current_user


@router.get("/all-users", response_model=list[UserRead])
async def get_all_users(
    session: SessionDependency, current_user: CurrentUserDependency
):
    repo = UserRepository(session)
    return await repo.get_all_users(current_user.id)
