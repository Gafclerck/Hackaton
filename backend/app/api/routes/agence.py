from fastapi import APIRouter, Query, status
from typing import List

from app.schemas.agence import AgenceCreate, AgenceUpdate, AgenceResponse
from app.core.deps import SessionDep, CurrentUser, RequireChefCentral
from app.services.agence import create_agence, get_agence_by_id, list_agences, update_agence

router = APIRouter()


@router.post("/create", status_code=status.HTTP_201_CREATED)
def create(agence: AgenceCreate, db: SessionDep, current_user: RequireChefCentral) -> AgenceResponse:
    return create_agence(db, agence)


@router.get("/all")
def read_all(
    db: SessionDep,
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
) -> List[AgenceResponse]:
    return list_agences(db, skip=skip, limit=limit)


@router.get("/{agence_id}")
def read_one(agence_id: int, db: SessionDep, current_user: CurrentUser) -> AgenceResponse:
    return get_agence_by_id(db, agence_id)


@router.patch("/{agence_id}")
def patch(agence_id: int, data: AgenceUpdate, db: SessionDep, current_user: RequireChefCentral) -> AgenceResponse:
    return update_agence(db, agence_id, data)
