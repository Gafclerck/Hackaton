from pydantic import BaseModel, Field
from typing import Optional


# TypeAffaire schemas
class TypeAffaireCreate(BaseModel):
    libelle: str = Field(..., min_length=1, max_length=150)


class TypeAffaireUpdate(BaseModel):
    libelle: Optional[str] = Field(None, min_length=1, max_length=150)

    model_config = {"from_attributes": True}


class TypeAffaireRead(BaseModel):
    id: int
    code: str
    libelle: str

    model_config = {"from_attributes": True}


# Specialite schemas
class SpecialiteCreate(BaseModel):
    libelle: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = None


class SpecialiteUpdate(BaseModel):
    libelle: Optional[str] = Field(None, min_length=1, max_length=150)
    description: Optional[str] = None

    model_config = {"from_attributes": True}


class SpecialiteRead(BaseModel):
    id: int
    libelle: str
    description: Optional[str] = None

    model_config = {"from_attributes": True}
