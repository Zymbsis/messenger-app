from typing import Annotated

from core.auth.jwt import verify_token
from core.db import SessionDependency
from fastapi import Cookie, Depends, HTTPException, Security, status
from fastapi.security import APIKeyCookie
from models import User
from repositories.user import UserRepository
from sqlmodel.ext.asyncio.session import AsyncSession

http_auth_scheme = APIKeyCookie(name="access_token", auto_error=True)
TokenDependency = Annotated[str, Depends(http_auth_scheme)]

WSTokenDependency = Annotated[str | None, Cookie(alias="access_token")]


def verify_token_http(token: TokenDependency) -> str:
    payload = verify_token(token)
    return payload.sub


def verify_token_ws(token: WSTokenDependency) -> str:
    payload = verify_token(token)
    return payload.sub


async def get_current_user(session: AsyncSession, user_id: str):
    repo = UserRepository(session)
    user = await repo.get_user_by_id(int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return user


async def get_current_user_http(
    session: SessionDependency,
    user_id: Annotated[str, Depends(verify_token_http)],
) -> User:
    return await get_current_user(session, int(user_id))


async def get_current_user_ws(
    session: SessionDependency,
    user_id: Annotated[str, Depends(verify_token_ws)],
) -> User:
    return await get_current_user(session, int(user_id))


CurrentUserDependency = Annotated[User, Security(get_current_user_http)]
CurrentUserWSDependency = Annotated[User, Security(get_current_user_ws)]
