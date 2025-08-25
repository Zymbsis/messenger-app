import json

from core.auth.dependencies import CurrentUserDependency
from core.db import SessionDependency
from fastapi import APIRouter, HTTPException, status
from repositories.chat import ChatRepository
from repositories.message import MessageRepository
from routers.websockets import manager
from schemas import MessageCreate, MessageRead, MessageUpdate

router = APIRouter(prefix="/messages", tags=["Messages"])


async def message_to_dict(message):
    return {
        "id": message.id,
        "chat_id": message.chat_id,
        "sender_id": message.sender_id,
        "content": message.content,
        "message_type": message.message_type,
        "is_read": message.is_read,
        "attachments": [
            {
                "id": att.id,
                "message_id": att.message_id,
                "public_id": att.public_id,
                "original_url": att.original_url,
                "full_image_url": att.full_image_url,
                "thumbnail_url": att.thumbnail_url,
                "file_name": att.file_name,
                "file_size": att.file_size,
                "width": att.width,
                "height": att.height,
                "format": att.format,
                "cloudinary_created_at": att.cloudinary_created_at,
                "created_at": att.created_at,
            }
            for att in message.attachments
        ],
        "created_at": message.created_at,
        "updated_at": message.updated_at,
    }


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

    message = await msg_repo.add_new_message(msg_data.content, chat_id, current_user.id, msg_data.attachments)
    broadcast_payload = {"type": "new_message", "payload": await message_to_dict(message)}
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
    broadcast_payload = {
        "type": "edit_message",
        "payload": await message_to_dict(updated_message),
    }
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
