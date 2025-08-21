from datetime import datetime

from pydantic import EmailStr
from schemas import UserBase
from sqlmodel import (
    CheckConstraint,
    Field,
    Relationship,
    SQLModel,
    UniqueConstraint,
    func,
)


class User(UserBase, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: EmailStr = Field(unique=True, index=True, max_length=254)
    hashed_password: str = Field(min_length=60, max_length=60)
    created_at: datetime = Field(
        sa_column_kwargs={"server_default": func.now()}, nullable=False
    )
    last_seen: datetime = Field(
        sa_column_kwargs={"server_default": func.now()}, nullable=False
    )

    chats_as_user1: list["Chat"] = Relationship(
        back_populates="user1", sa_relationship_kwargs={"foreign_keys": "Chat.user1_id"}
    )
    chats_as_user2: list["Chat"] = Relationship(
        back_populates="user2", sa_relationship_kwargs={"foreign_keys": "Chat.user2_id"}
    )

    @property
    def chats(self):
        return (self.chats_as_user1 or []) + (self.chats_as_user2 or [])


class Chat(SQLModel, table=True):
    __tablename__ = "chats"
    __table_args__ = (
        UniqueConstraint("user1_id", "user2_id", name="unique_chat_pair"),
        CheckConstraint("user1_id < user2_id", name="valid_chat_pair"),
    )

    id: int | None = Field(default=None, primary_key=True)
    user1_id: int = Field(foreign_key="users.id", index=True)
    user2_id: int = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(
        sa_column_kwargs={"server_default": func.now()}, nullable=False
    )
    updated_at: datetime = Field(
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
        nullable=False,
    )

    user1: "User" = Relationship(
        back_populates="chats_as_user1",
        sa_relationship_kwargs={"foreign_keys": "Chat.user1_id"},
    )
    user2: "User" = Relationship(
        back_populates="chats_as_user2",
        sa_relationship_kwargs={"foreign_keys": "Chat.user2_id"},
    )
