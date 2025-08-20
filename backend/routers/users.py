from core.auth.dependencies import CurrentUserDependency
from fastapi import APIRouter
from schemas import UserRead

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/current-user", response_model=UserRead)
async def get_current_user(current_user: CurrentUserDependency):
    return current_user
