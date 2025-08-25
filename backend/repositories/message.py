from fastapi import HTTPException, status
from models import Attachment, Message
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlmodel.ext.asyncio.session import AsyncSession
from schemas import AttachmentCreate


class MessageRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def add_new_message(
        self,
        content: str,
        chat_id: int,
        sender_id: int,
        attachments: list[AttachmentCreate] | None = None,
    ) -> Message:
        message = Message(chat_id=chat_id, sender_id=sender_id, content=content)
        if attachments:
            message.attachments = [
                Attachment(**att.model_dump()) for att in attachments
            ]
        self.session.add(message)
        await self.session.commit()

        stmt = (
            select(Message)
            .where(Message.id == message.id)
            .options(selectinload(Message.attachments))
        )
        result = await self.session.exec(stmt)
        new_message = result.scalar_one_or_none()
        if not new_message:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not create message",
            )
        return new_message

    async def update_message(self, message: Message) -> Message:
        if message.attachments:
            message.attachments = [
                Attachment(**att.model_dump()) for att in message.attachments or []
            ]

        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        await self.session.refresh(message, attribute_names=["attachments"])
        return message

    async def delete_message(self, message: Message) -> None:
        await self.session.delete(message)
        await self.session.commit()

    async def get_message_by_id(self, msg_id: int) -> Message | None:
        statement = (
            select(Message)
            .where(Message.id == msg_id)
            .options(selectinload(Message.attachments))
        )
        result = await self.session.exec(statement)
        return result.scalar_one_or_none()

    async def get_message_by_user_id(self, msg_id: int, user_id: int) -> Message | None:
        statement = (
            select(Message)
            .where((Message.id == msg_id) & (Message.sender_id == user_id))
            .options(selectinload(Message.attachments))
        )
        result = await self.session.exec(statement)
        return result.scalar_one_or_none()

    async def get_messages_by_chat_id(self, chat_id: int) -> list[Message]:
        statement = (
            select(Message)
            .where(Message.chat_id == chat_id)
            .options(selectinload(Message.attachments))
            .order_by(Message.created_at.asc())
        )
        result = await self.session.exec(statement)
        return result.scalars().all()