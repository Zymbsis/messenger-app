import os
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

raw_database_url = os.getenv("DATABASE_URL")

if not raw_database_url:
    raise ValueError("DATABASE_URL environment variable is not set")

DATABASE_URL = raw_database_url.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session


async def close_db():
    await engine.dispose()


SessionDependency = Annotated[AsyncSession, Depends(get_session)]
