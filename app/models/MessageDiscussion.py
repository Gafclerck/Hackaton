from datetime import datetime
from sqlalchemy import DateTime, String, Text, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.base import Base
from typing import Optional


class MessageDiscussion(Base):
    __tablename__ = "message_discussion"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    discussion_id: Mapped[int] = mapped_column(ForeignKey("discussion.id"), nullable=False)
    auteur_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    contenu: Mapped[str] = mapped_column(Text, nullable=False)
    parent_message_id: Mapped[int | None] = mapped_column(ForeignKey("message_discussion.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    discussion: Mapped["Discussion"] = relationship("Discussion", back_populates="messages")
    auteur: Mapped["User"] = relationship("User", back_populates="messages_envoyes")
    parent: Mapped[Optional["MessageDiscussion"]] = relationship("MessageDiscussion", remote_side="MessageDiscussion.id")
