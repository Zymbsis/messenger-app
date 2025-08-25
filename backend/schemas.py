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


class AttachmentCreate(SQLModel):
    public_id: str
    original_url: str
    full_image_url: str
    thumbnail_url: str
    file_name: str
    file_size: int
    width: int
    height: int
    format: str
    cloudinary_created_at: str


class MessageCreate(SQLModel):
    content: str
    attachments: list[AttachmentCreate] | None = None


class MessageUpdate(MessageCreate):
    pass


class AttachmentRead(AttachmentCreate):
    id: int
    message_id: int
    created_at: datetime


class MessageRead(MessageCreate):
    id: int
    chat_id: int
    sender_id: int
    message_type: str = "text"
    is_read: bool = False
    attachments: list[AttachmentRead] | None = None
    created_at: datetime
    updated_at: datetime
