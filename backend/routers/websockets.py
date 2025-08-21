import json

from core.auth.dependencies import CurrentUserDependency
from core.connection_manager import ConnectionManager
from core.db import SessionDependency
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from repositories.chat import ChatRepository
from repositories.message import MessageRepository

router = APIRouter(tags=["Websockets"])

manager = ConnectionManager()


@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    chat_id: int,
    current_user: CurrentUserDependency,
    session: SessionDependency,
):
    chat_repo = ChatRepository(session)

    is_chat_member = await chat_repo.is_chat_member(chat_id, current_user.id)

    if not is_chat_member:
        await websocket.close(code=403)
        return

    msg_repo = MessageRepository(session)
    await manager.connect(websocket, chat_id)

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            action = payload.get("action")
            message_data = payload.get("data")

            if action == "send_message":
                content = message_data.get("content")
                message = await msg_repo.add_new_message(
                    content, chat_id, current_user.id
                )

                await manager.broadcast(message.model_dump_json(), chat_id)

            elif action == "edit_message":
                message_id = message_data.get("id")
                content = message_data.get("content")
                message = await msg_repo.update_message(message_id, content)

                await manager.broadcast(message.model_dump_json(), chat_id)

            elif action == "delete_message":
                message_id = message_data.get("id")
                await msg_repo.delete_message(message_id)

                await manager.broadcast(
                    json.dumps({"id": message_id, "is_deleted": True}), chat_id
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket, chat_id)
