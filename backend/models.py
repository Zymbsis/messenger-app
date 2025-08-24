from datetime import datetime

from pydantic import EmailStr
from sqlmodel import (
    CheckConstraint,
    Column,
    DateTime,
    Field,
    Relationship,
    SQLModel,
    UniqueConstraint,
    func,
)


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: EmailStr = Field(unique=True, index=True, max_length=254)
    hashed_password: str = Field(min_length=60, max_length=60)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        )
    )
    last_seen: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        )
    )

    chats_as_user1: list["Chat"] = Relationship(
        back_populates="user1", sa_relationship_kwargs={"foreign_keys": "Chat.user1_id"}
    )
    chats_as_user2: list["Chat"] = Relationship(
        back_populates="user2", sa_relationship_kwargs={"foreign_keys": "Chat.user2_id"}
    )
    sent_messages: list["Message"] = Relationship(back_populates="sender")

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
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )

    user1: "User" = Relationship(
        back_populates="chats_as_user1",
        sa_relationship_kwargs={"foreign_keys": "Chat.user1_id"},
    )
    user2: "User" = Relationship(
        back_populates="chats_as_user2",
        sa_relationship_kwargs={"foreign_keys": "Chat.user2_id"},
    )
    messages: list["Message"] = Relationship(
        back_populates="chat", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: int | None = Field(default=None, primary_key=True)
    chat_id: int = Field(foreign_key="chats.id", index=True)
    sender_id: int = Field(foreign_key="users.id", index=True)
    content: str = Field(max_length=1000)
    message_type: str = Field(default="text", max_length=20)
    is_read: bool = Field(default=False)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )

    chat: Chat = Relationship(back_populates="messages")
    sender: User = Relationship(back_populates="sent_messages")
