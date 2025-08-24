from fastapi import HTTPException, status
from models import Message
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession


class MessageRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def add_new_message(
        self, content: str, chat_id: int, sender_id: int
    ) -> Message:
        message = Message(chat_id=chat_id, sender_id=sender_id, content=content)
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        return message

    async def update_message(self, message: Message) -> Message:
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        return message

    async def delete_message(self, message: Message) -> None:
        await self.session.delete(message)
        await self.session.commit()

    async def get_message_by_id(self, msg_id: int) -> Message | None:
        return await self.session.get(Message, msg_id)

    async def get_message_by_user_id(self, msg_id: int, user_id: int) -> Message | None:
        statement = select(Message).where(
            (Message.id == msg_id) & (Message.sender_id == user_id)
        )
        result = await self.session.exec(statement)
        return result.scalar_one_or_none()

    async def get_messages_by_chat_id(self, chat_id: int) -> list[Message]:
        statement = (
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.asc())
        )
        result = await self.session.exec(statement)
        return result.scalars().all()
