from app.core.base import Base
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import mapped_column, Mapped
from typing import List, Optional
from datetime import datetime
from sqlalchemy import Boolean, DateTime,ForeignKey,String,func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum

class UserRole(str, Enum):
    CHEF_CENTRAL = "chef_central"
    CHEF_AGENCE = "chef_agence"
    AVOCAT = "avocat"

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    agence_id: Mapped[int] = mapped_column(ForeignKey("agence.id"),nullable=False)

    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    prenom: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(ENUM(UserRole, create_type=True), nullable=False) #a modifer plus tard avec des enumerations

    actif: Mapped[bool] = mapped_column( Boolean, nullable=False,default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),nullable=False,server_default=func.now())
    last_login: Mapped[datetime | None] = mapped_column(DateTime(timezone=True),nullable=True)

    # ATTRIBUT DE RELATION
    agence: Mapped[Optional["Agence"]] = relationship(back_populates="users", foreign_keys=[agence_id])
    specialites: Mapped[List["UserSpecialite"]] = relationship(back_populates="user")

    dossiers_assignes: Mapped[List["Dossier"]] = relationship(
        back_populates="avocat_assigne", foreign_keys="Dossier.avocat_assigne_id"
    )
    dossiers_supervises: Mapped[List["Dossier"]] = relationship(
        back_populates="avocat_en_chef", foreign_keys="Dossier.avocat_en_chef_id"
    )

    documents_uploades: Mapped[List["Document"]] = relationship(back_populates="uploaded_by")
    messages_envoyes: Mapped[List["MessageDiscussion"]] = relationship(back_populates="auteur")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="destinataire")
    historiques: Mapped[List["HistoriqueAction"]] = relationship(back_populates="user")

    analyses_suggerees: Mapped[List["AnalyseIA"]] = relationship(
        back_populates="avocat_suggere", foreign_keys="AnalyseIA.avocat_suggere_id"
    )
    analyses_validees: Mapped[List["AnalyseIA"]] = relationship(
        back_populates="validee_par", foreign_keys="AnalyseIA.validee_par_id"
    )