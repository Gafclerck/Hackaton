from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text
from app.core.base import Base
from typing import List, Optional

class Specialite(Base):
    __tablename__ = "specialite"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    libelle: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    users: Mapped[List["UserSpecialite"]] = relationship(back_populates="specialite")