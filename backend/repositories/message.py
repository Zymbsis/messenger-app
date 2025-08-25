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
        self, content: str, chat_id: int, sender_id: int, attachments: list[AttachmentCreate] | None = None
    ) -> Message:
        message = Message(chat_id=chat_id, sender_id=sender_id, content=content)
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)

        if attachments:
            for attachment_data in attachments:
                attachment = Attachment(
                    message_id=message.id,
                    public_id=attachment_data.public_id,
                    original_url=attachment_data.original_url,
                    full_image_url=attachment_data.full_image_url,
                    thumbnail_url=attachment_data.thumbnail_url,
                    file_name=attachment_data.file_name,
                    file_size=attachment_data.file_size,
                    width=attachment_data.width,
                    height=attachment_data.height,
                    format=attachment_data.format,
                    cloudinary_created_at=attachment_data.cloudinary_created_at,
                )
                self.session.add(attachment)

            await self.session.commit()

            await self.session.refresh(message)
            await self.session.refresh(message, attribute_names=["attachments"])

        return message

    async def update_message(self, message: Message) -> Message:
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        await self.session.refresh(message, attribute_names=["attachments"])
        return message

    async def delete_message(self, message: Message) -> None:
        await self.session.delete(message)
        await self.session.commit()

    async def get_message_by_id(self, msg_id: int) -> Message | None:
        statement = select(Message).where(Message.id == msg_id).options(selectinload(Message.attachments))
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
            .order_by(Message.created_at.asc())
            .options(selectinload(Message.attachments))
        )
        result = await self.session.exec(statement)
        return result.scalars().all()
