from fastapi import APIRouter, status

from app.core.deps import CurrentUser, RequireChefCentral, SessionDep
from app.schemas.referentiel import (
    SpecialiteRead,
    TypeAffaireCreate,
    TypeAffaireUpdate,
    SpecialiteCreate,
    SpecialiteUpdate,
    TypeAffaireRead,
)
from app.services.ref_services import (
    create_type_affaire,
    get_type_affaire_by_id,
    update_type_affaire,
    create_specialite,
    get_specialite_by_id,
    update_specialite,
)

router = APIRouter()


# --- TypeAffaire ---

@router.get("/type_affaires")
def list_type_affaires(db: SessionDep, current_user: CurrentUser) -> list[TypeAffaireRead]:
    from app.models.TypeAffaire import TypeAffaire
    return db.query(TypeAffaire).all()


@router.get("/type_affaires/{type_affaire_id}")
def read_type_affaire(type_affaire_id: int, db: SessionDep, current_user: CurrentUser) -> TypeAffaireRead:
    return get_type_affaire_by_id(type_affaire_id, db)


@router.post("/type_affaires/create", status_code=status.HTTP_201_CREATED)
def create_type_affaire_route(
    type_affaire: TypeAffaireCreate,
    db: SessionDep,
    current_user: RequireChefCentral,
) -> TypeAffaireRead:
    return create_type_affaire(type_affaire, db)


@router.put("/type_affaires/{type_affaire_id}")
def update_type_affaire_route(
    type_affaire_id: int,
    data: TypeAffaireUpdate,
    db: SessionDep,
    current_user: RequireChefCentral,
) -> TypeAffaireRead:
    return update_type_affaire(type_affaire_id, data, db)


# --- Specialite ---

@router.get("/specialites")
def list_specialites(db: SessionDep, current_user: CurrentUser) -> list[SpecialiteRead]:
    from app.models.Specialite import Specialite
    return db.query(Specialite).all()


@router.get("/specialites/{specialite_id}")
def read_specialite(specialite_id: int, db: SessionDep, current_user: CurrentUser) -> SpecialiteRead:
    return get_specialite_by_id(specialite_id, db)


@router.post("/specialites/create", status_code=status.HTTP_201_CREATED)
def create_specialite_route(
    specialite: SpecialiteCreate,
    db: SessionDep,
    current_user: RequireChefCentral,
) -> SpecialiteRead:
    return create_specialite(specialite, db)


@router.put("/specialites/{specialite_id}")
def update_specialite_route(
    specialite_id: int,
    data: SpecialiteUpdate,
    db: SessionDep,
    current_user: RequireChefCentral,
) -> SpecialiteRead:
    return update_specialite(specialite_id, data, db)
