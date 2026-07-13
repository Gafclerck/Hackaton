from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey
from app.core.base import Base
from typing import Optional

class UserSpecialite(Base):
    __tablename__ = "user_specialite"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    specialite_id: Mapped[int] = mapped_column(ForeignKey("specialite.id"), primary_key=True)
    niveau: Mapped[Optional[int]] = mapped_column(Integer)

    # user: Mapped["User"] = relationship(back_populates="specialites")
    # specialite: Mapped["Specialite"] = relationship(back_populates="users")
