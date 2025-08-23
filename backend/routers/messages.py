from core.auth.dependencies import CurrentUserDependency
from core.db import SessionDependency
from fastapi import APIRouter, HTTPException, status
from repositories.chat import ChatRepository
from repositories.message import MessageRepository
from schemas import MessageRead

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/{chat_id}", response_model=list[MessageRead])
async def get_messages_by_chat(
    chat_id: int, current_user: CurrentUserDependency, session: SessionDependency
):
    msg_repo = MessageRepository(session)
    chat_repo = ChatRepository(session)
    is_chat_member = await chat_repo.is_chat_member(chat_id, current_user.id)
    print("*" * 15)
    print(is_chat_member)
    if not is_chat_member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    return await msg_repo.get_messages_by_chat_id(chat_id)
