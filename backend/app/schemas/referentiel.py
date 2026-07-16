from typing import Optional

from pydantic import BaseModel, ConfigDict


class TypeAffaireRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    libelle: str
    code: Optional[str] = None


class SpecialiteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    libelle: str
    description: Optional[str] = None
