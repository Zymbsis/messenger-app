import json

from core.auth.dependencies import CurrentUserWSDependency
from core.connection_manager import ConnectionManager
from core.db import SessionDependency
from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
    status,
)
from repositories.chat import ChatRepository
from repositories.message import MessageRepository

router = APIRouter(tags=["Websockets"])

manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    current_user: CurrentUserWSDependency,
    session: SessionDependency,
):
    await manager.connect(websocket, current_user.id)

    try:
        while True:
            data = await websocket.receive_text()
            try:
                message_data = json.loads(data)
                message_type = message_data.get("type")
                payload = message_data.get("payload", {})

                if message_type == "message_read":
                    await handle_message_read(payload, current_user.id, session)
                    
            except json.JSONDecodeError:
                continue
            except Exception as e:
                print(f"Error processing WebSocket message: {e}")
                continue
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, current_user.id)
    except Exception as e:
        manager.disconnect(websocket, current_user.id)


async def handle_message_read(payload: dict, user_id: int, session: SessionDependency):
    message_id = payload.get("id")
    chat_id = payload.get("chat_id")
    
    if not message_id or not chat_id:
        return
    
    msg_repo = MessageRepository(session)
    chat_repo = ChatRepository(session)
    
    await chat_repo.is_chat_member(chat_id, user_id)
    
    message = await msg_repo.get_message_by_id(message_id)
    if message.sender_id == user_id:
        return  # Don't mark own messages as read
    
    message.is_read = True
    await msg_repo.update_message(message)
    
    broadcast_payload = {
        "type": "message_read",
        "payload": {"id": message_id, "chat_id": chat_id}
    }
    await manager.broadcast_to_chat(json.dumps(broadcast_payload, default=str), chat_id, session)