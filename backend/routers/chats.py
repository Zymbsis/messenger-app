import json
from core.auth.dependencies import CurrentUserDependency
from core.db import SessionDependency
from fastapi import APIRouter, HTTPException, status
from repositories.chat import ChatRepository
from repositories.user import UserRepository
from routers.websockets import manager
from schemas import ChatCreate, ChatRead

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.get("", response_model=list[ChatRead])
async def get_chats(current_user: CurrentUserDependency, session: SessionDependency):
    repo = ChatRepository(session)
    return await repo.get_chats_by_user_id(current_user.id)


@router.get("/{chat_id}", response_model=ChatRead)
async def get_chat(
    chat_id: int, current_user: CurrentUserDependency, session: SessionDependency
):
    repo = ChatRepository(session)
    chat = await repo.get_chat_by_user_id(chat_id, current_user.id)

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
        )

    return chat


@router.post("", response_model=ChatRead, status_code=status.HTTP_201_CREATED)
async def create_chat(
    chat_data: ChatCreate,
    current_user: CurrentUserDependency,
    session: SessionDependency,
):
    if current_user.id == chat_data.user2_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create chat with yourself",
        )

    user_repo = UserRepository(session)
    other_user = await user_repo.get_user_by_id(chat_data.user2_id)

    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    await session.refresh(
        current_user, attribute_names=["chats_as_user1", "chats_as_user2"]
    )

    u1, u2 = sorted([current_user.id, chat_data.user2_id])
    existing_chat = next(
        (
            chat
            for chat in current_user.chats
            if (chat.user1_id == u1 and chat.user2_id == u2)
        ),
        None,
    )

    if not existing_chat:
        chat_repo = ChatRepository(session)
        new_chat = await chat_repo.create_new_chat(u1, u2)
        return new_chat

    return existing_chat


@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(
    chat_id: int, current_user: CurrentUserDependency, session: SessionDependency
):
    repo = ChatRepository(session)
    chat = await repo.get_chat_by_user_id(chat_id, current_user.id)

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
        )

    partner_id = chat.user1_id if chat.user1_id != current_user.id else chat.user2_id

    await repo.delete_chat(chat)

    broadcast_payload = {
        "type": "delete_chat",
        "payload": {"id": chat_id},
    }
    
    await manager.send_personal_message(json.dumps(broadcast_payload, default=str), partner_id)
