import json
from typing import Any

from core.auth.dependencies import CurrentUserWSDependency
from core.connection_manager import ConnectionManager
from core.db import SessionDependency
from fastapi import (
    APIRouter,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
    status,
)
from fastapi.dependencies.models import Dependant
from repositories.chat import ChatRepository
from repositories.message import MessageRepository

router = APIRouter(tags=["Websockets"])

manager = ConnectionManager()


def validate_payload(payload: Any) -> tuple[str, dict]:
    if not isinstance(payload, dict):
        raise WebSocketException(code=status.WS_1007_INVALID_FRAME_PAYLOAD_DATA)

    action = payload.get("action")
    data = payload.get("data")

    if not action or not isinstance(data, dict):
        raise WebSocketException(code=status.WS_1007_INVALID_FRAME_PAYLOAD_DATA)

    return action, data


async def send_error(ws: WebSocket, action: str, message: str):
    await ws.send_json(
        {
            "type": "error",
            "action": action,
            "message": message,
        }
    )


@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(
    chat_id: int,
    websocket: WebSocket,
    current_user: CurrentUserWSDependency,
    session: SessionDependency,
):

    chat_repo = ChatRepository(session)
    is_chat_member = await chat_repo.is_chat_member(chat_id, current_user.id)

    if not is_chat_member:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

    msg_repo = MessageRepository(session)
    await manager.connect(websocket, chat_id)

    try:
        while True:
            try:
                raw_text = await websocket.receive_text()
                payload = json.loads(raw_text)
                action, data = validate_payload(payload)
            except WebSocketException:
                raise
            except Exception:
                raise WebSocketException(code=status.WS_1007_INVALID_FRAME_PAYLOAD_DATA)

            match action:
                case "send_message":
                    content = data.get("content")
                    if not content:
                        await send_error(
                            websocket, "send_message", "content can not be empty"
                        )
                        continue

                    message = await msg_repo.add_new_message(
                        content, chat_id, current_user.id
                    )
                    await manager.broadcast(message.model_dump_json(), chat_id)

                case "edit_message":
                    msg_id = data.get("id")
                    content = data.get("content")

                    if not msg_id or not content:
                        await send_error(
                            websocket, "edit_message", "id and content required"
                        )
                        continue

                    try:
                        message = await msg_repo.update_message(
                            msg_id, current_user.id, content
                        )
                        await manager.broadcast(message.model_dump_json(), chat_id)
                    except HTTPException as e:
                        await send_error(websocket, "edit_message", str(e.detail))

                case "delete_message":
                    msg_id = data.get("id")

                    if not msg_id:
                        await send_error(websocket, "delete_message", "id required")
                        continue

                    try:
                        await msg_repo.delete_message(msg_id, current_user.id)
                        await manager.broadcast(
                            json.dumps({"id": msg_id, "is_deleted": True}), chat_id
                        )
                    except HTTPException as e:
                        await send_error(websocket, "delete_message", str(e.detail))

                case _:
                    await send_error(websocket, action, "unknown action")

    except WebSocketDisconnect:
        manager.disconnect(websocket, chat_id)
    except Exception as e:
        print(e)
        await send_error(websocket, "general", "unexpected error")
        manager.disconnect(websocket, chat_id)
