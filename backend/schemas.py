from datetime import datetime

from pydantic import BaseModel, EmailStr
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    email: EmailStr = Field(max_length=254)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=64)


class UserRead(UserBase):
    id: int
    created_at: datetime


class TokenPayload(BaseModel):
    sub: str | None = None
    exp: datetime | None = None


class ChatCreate(SQLModel):
    user2_id: int


class ChatRead(ChatCreate):
    id: int
    user1_id: int
    created_at: datetime
    updated_at: datetime
