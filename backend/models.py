from datetime import datetime

from pydantic import EmailStr
from schemas import UserBase
from sqlmodel import Field, func


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: EmailStr = Field(unique=True, index=True, max_length=254)
    hashed_password: str = Field(min_length=60, max_length=60)
    created_at: datetime = Field(
        default=None, sa_column_kwargs={"server_default": func.now()}, nullable=False
    )
