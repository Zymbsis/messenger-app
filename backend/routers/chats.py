from core.auth.dependencies import CurrentUserDependency
from core.db import SessionDependency
from fastapi import APIRouter, HTTPException, status
from repositories.chat import ChatRepository
from repositories.user import UserRepository
from schemas import ChatCreate, ChatRead

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.post("/", response_model=ChatRead, status_code=status.HTTP_201_CREATED)
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

    if existing_chat:
        return ChatRead(
            id=existing_chat.id,
            user1_id=existing_chat.user1_id,
            user2_id=existing_chat.user2_id,
            created_at=existing_chat.created_at,
            updated_at=existing_chat.updated_at,
        )

    chat_repo = ChatRepository(session)
    new_chat = await chat_repo.create_new_chat(user1_id=u1, user2_id=u2)

    return ChatRead(
        id=new_chat.id,
        user1_id=new_chat.user1_id,
        user2_id=new_chat.user2_id,
        created_at=new_chat.created_at,
        updated_at=new_chat.updated_at,
    )
