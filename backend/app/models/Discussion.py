from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy import Integer, String, ForeignKey
from app.core.base import Base
from typing import List
from datetime import datetime

class Discussion(Base):
    __tablename__ = "discussion"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    dossier_id: Mapped[int] = mapped_column(ForeignKey("dossier.id"), nullable=False)
    created_by_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    sujet: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    dossier: Mapped["Dossier"] = relationship(back_populates="discussions")
    created_by: Mapped["User"] = relationship()
    messages: Mapped[List["MessageDiscussion"]] = relationship(back_populates="discussion")