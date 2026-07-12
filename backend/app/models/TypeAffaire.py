from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy import Integer, String, ForeignKey
from app.core.base import Base
from typing import List, Optional


class TypeAffaire(Base):
    __tablename__ = "type_affaire"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    libelle: Mapped[str] = mapped_column(String(150), nullable=False)
    code: Mapped[Optional[str]] = mapped_column(String(30))

    #dossiers: Mapped[List["Dossier"]] = relationship(back_populates="type_affaire")

