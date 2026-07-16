from fastapi import APIRouter

from app.core.deps import SessionDep, CurrentUser
from app.schemas.referentiel import TypeAffaireRead, SpecialiteRead
from app.services import referentiel_service

router = APIRouter()


@router.get("/types-affaire", response_model=list[TypeAffaireRead])
def lister_types_affaire(db: SessionDep, current_user: CurrentUser):
    return referentiel_service.lister_types_affaire(db)


@router.get("/specialites", response_model=list[SpecialiteRead])
def lister_specialites(db: SessionDep, current_user: CurrentUser):
    return referentiel_service.lister_specialites(db)
