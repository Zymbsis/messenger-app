from models import Chat
from sqlmodel.ext.asyncio.session import AsyncSession


class ChatRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_new_chat(self, user1_id: int, user2_id: int) -> Chat:
        u1, u2 = sorted([user1_id, user2_id])
        chat = Chat(user1_id=u1, user2_id=u2)
        self.session.add(chat)
        await self.session.commit()
        await self.session.refresh(chat)

        return chat
