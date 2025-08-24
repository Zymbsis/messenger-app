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

    async def delete_message(self, message: Message):
        await self.session.delete(message)
        await self.session.commit()

        return message

    async def get_message_by_id(self, msg_id: int) -> Message:
        message = await self.session.get(Message, msg_id)
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
            )
        return message

    async def get_messages_by_chat_id(self, chat_id: int) -> list[Message]:
        statement = (
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.asc())
        )
        result = await self.session.exec(statement)
        return result.scalars().all()

    def is_user_message_sender(self, msg_sender_id: int, user_id: int) -> True:
        if msg_sender_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
        return True
