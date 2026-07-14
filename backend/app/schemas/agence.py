import re
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from app.models.User import UserRole
from typing import Optional

class AgenceRequest(BaseModel):
    nom: str = Field(..., min_length=1, max_length=255)
    adresse: str = Field(..., min_length=1, max_length=255)
    ville: str = Field(..., min_length=1, max_length=100)
    telephone: str = Field(..., min_length=1, max_length=20)
    est_siege: bool = Field(default=False)
    actif: bool = Field(default=True)

class AgenceResponse(BaseModel):
    id: int
    nom: str
    adresse: str
    ville: str
    telephone: str
    est_siege: bool
    actif: bool
    created_at: datetime

    class Config:
        from_attributes = True