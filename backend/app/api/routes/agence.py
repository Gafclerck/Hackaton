from fastapi import Depends, Request, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.schemas.agence import AgenceRequest, AgenceResponse
from typing import List

from app.core.deps import SessionDep, CurrentUser, TokenDep, RequireChefCentral, RequireChefAgence, limiter
from app.services.agence import add_agence, get_agence_by_id, get_all_agences, update_agence
router = APIRouter()

@router.post("/agence")
def register(agence: AgenceRequest, db: SessionDep) -> List[AgenceResponse]:
    return add_agence(db, agence)

@router.get("/agence/{agence_id}")
def get_agence(agence_id: int, db: SessionDep) -> AgenceResponse:
    return get_agence_by_id(db, agence_id)

@router.get("/agences")
def get_all_agences_route(db: SessionDep) -> List[AgenceResponse]:
    return get_all_agences(db)

@router.patch("/agence/{agence_id}")
def update_agence(agence_id: int, agence: AgenceRequest, db: SessionDep) -> AgenceResponse:
    # Implement the logic to update the agence here
    return update_agence(db, agence_id, agence)