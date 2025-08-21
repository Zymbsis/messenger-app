from models import Message
from sqlmodel.ext.asyncio.session import AsyncSession


class MessageRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def add_new_message(self, content: str, chat_id: int, sender_id: int):
        message = Message(chat_id=chat_id, sender_id=sender_id, content=content)
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)

        return message

    async def update_message(self, msg_id: int, content: str):
        message = await self.get_message_by_id(msg_id)
        message.content = content
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)

        return message

    async def get_message_by_id(self, msg_id: int) -> Message | None:
        return await self.session.get(Message, msg_id)

    async def delete_message(self, id: int):
        message = await self.get_message_by_id(id)

        if message:
            await self.session.delete(message)
            await self.session.commit()

        return message
