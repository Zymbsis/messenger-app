import json

from core.auth.dependencies import CurrentUserDependency
from core.db import SessionDependency
from fastapi import APIRouter, HTTPException, status
from repositories.chat import ChatRepository
from repositories.message import MessageRepository
from routers.websockets import manager
from schemas import MessageCreate, MessageRead, MessageUpdate

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/{chat_id}", response_model=list[MessageRead])
async def get_messages_by_chat(
    chat_id: int, current_user: CurrentUserDependency, session: SessionDependency
):
    msg_repo = MessageRepository(session)
    chat_repo = ChatRepository(session)

    chat = await chat_repo.get_chat_by_user_id(chat_id, current_user.id)
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
        )

    return await msg_repo.get_messages_by_chat_id(chat_id)


@router.post(
    "/{chat_id}",
    response_model=MessageRead,
    status_code=status.HTTP_201_CREATED,
)
async def add_message(
    msg_data: MessageCreate,
    chat_id: int,
    current_user: CurrentUserDependency,
    session: SessionDependency,
):
    msg_repo = MessageRepository(session)
    chat_repo = ChatRepository(session)

    chat = await chat_repo.get_chat_by_user_id(chat_id, current_user.id)
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
        )

    message = await msg_repo.add_new_message(
        msg_data.content, chat_id, current_user.id, msg_data.attachments
    )

    message_read = MessageRead.model_validate(message)
    broadcast_payload = {"type": "new_message", "payload": message_read.model_dump()}

    await manager.broadcast_to_chat(
        json.dumps(broadcast_payload, default=str), chat_id, session
    )

    return message


@router.patch(
    "/{msg_id}",
    response_model=MessageRead,
)
async def edit_message(
    msg_id: int,
    msg_data: MessageUpdate,
    current_user: CurrentUserDependency,
    session: SessionDependency,
):
    msg_repo = MessageRepository(session)

    message = await msg_repo.get_message_by_user_id(msg_id, current_user.id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
        )

    message.content = msg_data.content
    updated_message = await msg_repo.update_message(message)

    message_read = MessageRead.model_validate(updated_message)
    broadcast_payload = {"type": "edit_message", "payload": message_read.model_dump()}
    
    await manager.broadcast_to_chat(
        json.dumps(broadcast_payload, default=str), updated_message.chat_id, session
    )

    return updated_message


@router.delete("/{msg_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    msg_id: int,
    current_user: CurrentUserDependency,
    session: SessionDependency,
):
    msg_repo = MessageRepository(session)

    message = await msg_repo.get_message_by_user_id(msg_id, current_user.id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
        )

    await msg_repo.delete_message(message)

    broadcast_payload = {
        "type": "delete_message",
        "payload": {"id": msg_id, "chat_id": message.chat_id},
    }
    await manager.broadcast_to_chat(
        json.dumps(broadcast_payload, default=str), message.chat_id, session
    )
