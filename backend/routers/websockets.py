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

router = APIRouter(tags=["Websockets"])

manager = ConnectionManager()


@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(
    chat_id: int,
    websocket: WebSocket,
    current_user: CurrentUserWSDependency,
    session: SessionDependency,
):

    chat_repo = ChatRepository(session)
    await chat_repo.is_chat_member(chat_id, current_user.id)

    await manager.connect(websocket, chat_id)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, chat_id)
    except Exception as e:
        manager.disconnect(websocket, chat_id)
