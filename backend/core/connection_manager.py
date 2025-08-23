import asyncio

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, chat_id: int):
        await websocket.accept()

        if chat_id not in self.active_connections:
            self.active_connections[chat_id] = []
        self.active_connections[chat_id].append(websocket)

    def disconnect(self, websocket: WebSocket, chat_id: int):
        if chat_id in self.active_connections:
            self.active_connections[chat_id].remove(websocket)

        if not self.active_connections[chat_id]:
            del self.active_connections[chat_id]

    async def broadcast(self, message: str, chat_id: int):
        if chat_id in self.active_connections:
            await asyncio.gather(
                *[
                    connection.send_text(message)
                    for connection in self.active_connections[chat_id]
                ],
                return_exceptions=True,
            )
