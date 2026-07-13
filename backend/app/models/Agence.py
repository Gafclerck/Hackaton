from datetime import datetime

from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.base import Base
from typing import List

class Agence(Base):
    __tablename__ = "agence"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nom: Mapped[str] = mapped_column(String(255), nullable=False)
    adresse: Mapped[str] = mapped_column(String(255), nullable=False)
    ville: Mapped[str] = mapped_column(String(100), nullable=False)
    telephone: Mapped[str] = mapped_column(String(20), nullable=False)
    est_siege: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    actif: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column( DateTime,nullable=False,  server_default=func.now())

    # # ATTRIBUT DE RELATION
    # users: Mapped[List["User"]] = relationship(
    #     back_populates="agence", foreign_keys="User.agence_id"
    # )
    # dossiers_recus: Mapped[List["Dossier"]] = relationship(
    #     back_populates="agence_receptrice", foreign_keys="Dossier.agence_receptrice_id"
    # )
    # dossiers_assignes: Mapped[List["Dossier"]] = relationship(
    #     back_populates="agence_assigne", foreign_keys="Dossier.agence_assigne_id"
    # )
    # analyses_suggerees: Mapped[List["AnalyseIA"]] = relationship(
    #     back_populates="agence_suggeree"
    # )
