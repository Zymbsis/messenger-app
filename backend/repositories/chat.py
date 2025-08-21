from models import Chat
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession


class ChatRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_new_chat(self, user1_id: int, user2_id: int) -> Chat:
        u1, u2 = sorted([user1_id, user2_id])
        chat = Chat(user1_id=u1, user2_id=u2)
        self.session.add(chat)
        await self.session.commit()
        await self.session.refresh(chat)

        return chat

    async def get_chats_by_user_id(self, user_id: int) -> list[Chat]:
        statement = select(Chat).where(
            (Chat.user1_id == user_id) | (Chat.user2_id == user_id)
        )
        result = await self.session.exec(statement)

        return result.all()

    async def get_chat_by_id(self, chat_id: int) -> Chat | None:
        return await self.session.get(Chat, chat_id)

    async def is_chat_member(self, chat_id: int, user_id: int) -> bool:
        chat = await self.get_chat_by_id(chat_id)

        if not chat:
            return False

        return user_id in [chat.user1_id, chat.user2_id]
