from typing import Annotated

from core.auth.jwt import verify_token
from core.db import SessionDependency
from fastapi import Cookie, Depends, HTTPException, status
from models import User
from repositories.user import UserRepository


async def get_current_user(
    session: SessionDependency, access_token: str = Cookie()
) -> User:
    payload = verify_token(access_token)
    user_id = payload.sub

    repo = UserRepository(session)
    user = await repo.get_user_by_id(int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


CurrentUserDependency = Annotated[User, Depends(get_current_user)]
