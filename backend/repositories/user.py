from core.security import hash_password
from models import User
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_user_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        result = await self.session.exec(statement)
        return result.one_or_none()

    async def create_user(self, email: str, password: str) -> User:
        hashed_password = hash_password(password)
        user = User(email=email, hashed_password=hashed_password)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
