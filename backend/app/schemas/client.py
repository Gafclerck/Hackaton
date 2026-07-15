from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field
from app.models.Client import ClientType


class ClientCreate(BaseModel):
    type_client: ClientType
    nom: str = Field(..., min_length=1, max_length=255)
    telephone: str = Field(..., min_length=1, max_length=20)
    email: EmailStr
    nin: Optional[str] = Field(None, max_length=50)
    rccm: Optional[str] = Field(None, max_length=50)

    model_config = {"from_attributes": True}


class ClientUpdate(BaseModel):
    type_client: Optional[ClientType] = None
    nom: Optional[str] = Field(None, min_length=1, max_length=255)
    telephone: Optional[str] = Field(None, min_length=1, max_length=20)
    email: Optional[EmailStr] = None
    nin: Optional[str] = Field(None, max_length=50)
    rccm: Optional[str] = Field(None, max_length=50)

    model_config = {"from_attributes": True}


class ClientRead(BaseModel):
    id: int
    type_client: ClientType
    nom: str
    telephone: str
    email: EmailStr
    nin: Optional[str] = None
    rccm: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
