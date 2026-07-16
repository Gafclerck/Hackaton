from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, model_validator


class ClientBase(BaseModel):
    type_client: Literal["PHYSIQUE", "MORALE"]
    nom: str
    telephone: str
    email: EmailStr
    nin: Optional[str] = None
    rccm: Optional[str] = None

    @model_validator(mode="after")
    def valider_nin_rccm(self) -> "ClientBase":
        if self.type_client == "PHYSIQUE" and self.rccm is not None:
            raise ValueError(
                "rccm ne doit pas etre renseigne pour un client de type PHYSIQUE"
            )
        if self.type_client == "MORALE" and self.nin is not None:
            raise ValueError(
                "nin ne doit pas etre renseigne pour un client de type MORALE"
            )
        return self


class ClientCreate(ClientBase):
    pass


class ClientRead(ClientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
