from app.core.base import Base
from sqlalchemy import Integer, String
from sqlalchemy.orm import mapped_column, Mapped

from datetime import datetime
from sqlalchemy import Boolean, DateTime,ForeignKey,String,func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from enum import Enum
# class Role(str, Enum):
#     GERANT_CENTRAL : str



class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    agence_id: Mapped[int] = mapped_column(ForeignKey("agences.id"),nullable=False)

    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    prenom: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False) #a modifer plus tard avec des enumerations

    actif: Mapped[bool] = mapped_column( Boolean, nullable=False,default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),nullable=False,server_default=func.now())

    last_login: Mapped[datetime | None] = mapped_column(DateTime(timezone=True),nullable=True)

    # ATTRIBUT DE RELATION
    agence: Mapped["Agence"] = relationship(back_populates="users")

