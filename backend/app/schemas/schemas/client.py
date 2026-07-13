from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class ClientCreate(BaseModel):
    type_client: str
    nom: str
    telephone: str
    email: EmailStr
    nin: Optional[str] = None
    rccm: Optional[str] = None


class ClientRead(BaseModel):
    id: int
    type_client: str
    nom: str
    telephone: str
    email: EmailStr
    nin: Optional[str]
    rccm: Optional[str]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }