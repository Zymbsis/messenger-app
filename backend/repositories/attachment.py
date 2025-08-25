from models import Attachment
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession


class AttachmentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_attachment_by_id(self, attachment_id: int) -> Attachment | None:
        return await self.session.get(Attachment, attachment_id)

    async def get_attachments_by_message_id(self, message_id: int) -> list[Attachment]:
        statement = select(Attachment).where(Attachment.message_id == message_id)
        result = await self.session.exec(statement)
        return result.scalars().all()
