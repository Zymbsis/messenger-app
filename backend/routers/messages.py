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
    is_chat_member = await chat_repo.is_chat_member(chat_id, current_user.id)
    if not is_chat_member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    return await msg_repo.get_messages_by_chat_id(chat_id)


@router.post("/{chat_id}", response_model=MessageRead)
async def add_message(
    msg_data: MessageCreate,
    chat_id: int,
    current_user: CurrentUserDependency,
    session: SessionDependency,
):
    msg_repo = MessageRepository(session)
    chat_repo = ChatRepository(session)
    is_chat_member = await chat_repo.is_chat_member(chat_id, current_user.id)
    if not is_chat_member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    message = await msg_repo.add_new_message(msg_data.content, chat_id, current_user.id)
    broadcast_payload = {"type": "new_message", "payload": message.model_dump()}

    await manager.broadcast(json.dumps(broadcast_payload, default=str), chat_id)

    return message


@router.delete("/{msg_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    msg_id: int,
    current_user: CurrentUserDependency,
    session: SessionDependency,
):
    msg_repo = MessageRepository(session)
    chat_repo = ChatRepository(session)
    message = await msg_repo.get_message_by_id(msg_id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
        )
    is_chat_member = await chat_repo.is_chat_member(message.chat_id, current_user.id)
    if not is_chat_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete message",
        )
    if current_user.id != message.sender_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete message",
        )
    await msg_repo.delete_message(message)
    broadcast_payload = {
        "type": "delete_message",
        "payload": {"id": msg_id},
    }
    await manager.broadcast(json.dumps(broadcast_payload), message.chat_id)


@router.put("/{msg_id}", response_model=MessageRead)
async def edit_message(
    msg_id: int,
    msg_data: MessageUpdate,
    current_user: CurrentUserDependency,
    session: SessionDependency,
):
    msg_repo = MessageRepository(session)
    chat_repo = ChatRepository(session)
    message = await msg_repo.get_message_by_id(msg_id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
        )
    is_chat_member = await chat_repo.is_chat_member(message.chat_id, current_user.id)
    if not is_chat_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot edit message",
        )
    if current_user.id != message.sender_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot edit message",
        )
    message.content = msg_data.content
    updated_message = await msg_repo.update_message(message)
    broadcast_payload = {
        "type": "edit_message",
        "payload": updated_message.model_dump(),
    }
    await manager.broadcast(json.dumps(broadcast_payload, default=str), message.chat_id)
    return updated_message
