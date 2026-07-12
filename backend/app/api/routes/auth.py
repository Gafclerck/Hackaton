from fastapi import Depends, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.schemas.user import (
    RegistrationRequest,
    ChefCentralRegisterRequest,
    ChefAgenceRegisterRequest,
    Token,
    UserResponse,
)
from app.core.deps import SessionDep, CurrentUser, RequireChefCentral, RequireChefAgence
from app.services.auth_service import register_user, login_user
from app.models.User import UserRole

router = APIRouter()


@router.post("/register")
def register(user: RegistrationRequest, db: SessionDep) -> UserResponse:
    return register_user(user, db, role=user.role)


@router.post("/chef_central/register")
def register_by_chef_central(
    user: ChefCentralRegisterRequest,
    db: SessionDep,
    current_user: RequireChefCentral,
) -> UserResponse:
    return register_user(user, db, role=user.role)


@router.post("/chef_agence/register")
def register_by_chef_agence(
    user: ChefAgenceRegisterRequest,
    db: SessionDep,
    current_user: RequireChefAgence,
) -> UserResponse:
    return register_user(user, db, role=UserRole.AVOCAT)


@router.post("/login")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: SessionDep
) -> Token:
    access_token = login_user(db, form_data)
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me")
def get_user(user: CurrentUser) -> UserResponse:
    return user