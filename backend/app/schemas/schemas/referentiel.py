# TypeAffaireRead, SpecialiteRead
# id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
# libelle: Mapped[str] = mapped_column(String(150), nullable=False)

# code: Mapped[Optional[str]] = mapped_column(String(30))
# id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
# libelle: Mapped[str] = mapped_column(String(150), nullable=False)
# description: Mapped[Optional[str]] = mapped_column(Text)

# users: Mapped[List["UserSpecialite"]] = relationship(back_populates="specialite")

from pydantic import BaseModel
from typing import Optional

class TypeAffaireRead(BaseModel):
    libelle : str 
    code : Optional[str]

class SpecialiteRead(BaseModel):
    code : Optional[str]
    libelle : str
    description : Optional[str]
