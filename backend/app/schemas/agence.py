from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class AgenceCreate(BaseModel):
    nom: str = Field(..., min_length=1, max_length=255)
    adresse: str = Field(..., min_length=1, max_length=255)
    ville: str = Field(..., min_length=1, max_length=100)
    telephone: str = Field(..., min_length=1, max_length=20)
    est_siege: bool = Field(default=False)
    actif: bool = Field(default=True)

    model_config = {"from_attributes": True}


class AgenceUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=1, max_length=255)
    adresse: Optional[str] = Field(None, min_length=1, max_length=255)
    ville: Optional[str] = Field(None, min_length=1, max_length=100)
    telephone: Optional[str] = Field(None, min_length=1, max_length=20)
    est_siege: Optional[bool] = None
    actif: Optional[bool] = None

    model_config = {"from_attributes": True}


class AgenceResponse(BaseModel):
    id: int
    nom: str
    adresse: str
    ville: str
    telephone: str
    est_siege: bool
    actif: bool
    created_at: datetime

    model_config = {"from_attributes": True}
