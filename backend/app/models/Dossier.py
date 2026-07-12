from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.base import Base
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, DateTime, Text, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.base import Base

class Dossier(Base):
    __tablename__ = "dossier"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("client.id"), nullable=False)
    agence_receptrice_id: Mapped[int] = mapped_column(ForeignKey("agence.id"), nullable=False)
    avocat_en_chef_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    agence_assignee_id: Mapped[int] = mapped_column(ForeignKey("agence.id"), nullable=True)
    avocat_assignee_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)
    type_affaire_id: Mapped[int] = mapped_column(ForeignKey("type_affaire.id"), nullable=False)
    
    reference: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    titre: Mapped[str] = mapped_column(String(255), nullable=False)
    description_initiale: Mapped[str] = mapped_column(Text, nullable=True)
    statut: Mapped[str] = mapped_column(String(50), nullable=False, default="en_attente")
    priorite: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    date_reception: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    date_affectation: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    date_cloture: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    #ATTRIBUTS DE RELATION
    client: Mapped["Client"] = relationship("Client", back_populates="dossiers")
    agence_receptrice: Mapped["Agence"] = relationship("Agence", foreign_keys=[agence_receptrice_id])
    avocat_en_chef: Mapped["User"] = relationship("User", foreign_keys=[avocat_en_chef_id])
    agence_assignee: Mapped["Agence"] = relationship("Agence", foreign_keys=[agence_assignee_id])
    avocat_assignee: Mapped["User"] = relationship("User", foreign_keys=[avocat_assignee_id])
    type_affaire: Mapped["TypeAffaire"] = relationship("TypeAffaire", back_populates="dossiers")


    documents: Mapped[List["Document"]] = relationship(back_populates="dossier")
    discussions: Mapped[List["Discussion"]] = relationship(back_populates="dossier")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="dossier")
    historiques: Mapped[List["HistoriqueAction"]] = relationship(back_populates="dossier")

    # Relation 0..1 explicite : un dossier a au plus une analyse IA
    analyse_ia: Mapped[Optional["AnalyseIA"]] = relationship(
        back_populates="dossier", uselist=False
    )
