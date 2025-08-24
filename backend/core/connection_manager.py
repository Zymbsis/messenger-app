import asyncio
import json

from fastapi import WebSocket
from repositories.chat import ChatRepository


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(message)
            except Exception:
                del self.active_connections[user_id]

    async def broadcast_to_chat(self, message: str, chat_id: int, session):
        chat_repo = ChatRepository(session)
        chat = await chat_repo.get_chat_by_id(chat_id)
        
        if chat:
            user_ids = [chat.user1_id, chat.user2_id]
            await asyncio.gather(
                *[
                    self.send_personal_message(message, user_id)
                    for user_id in user_ids
                    if user_id in self.active_connections
                ],
                return_exceptions=True,
            )
