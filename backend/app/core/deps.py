from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated, Generator
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings
from app.models.User import User, UserRole
from app.core.db import session
from app.services.auth_service import get_user_from_token

limiter = Limiter(key_func=get_remote_address)

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_STR}/auth/login"
)

def get_session() -> Generator[Session, None, None]:
    sessionlocal = session()
    try:
        yield sessionlocal
    finally:
        sessionlocal.close()

def get_current_user(token: Annotated[str, Depends(reusable_oauth2)], session: Annotated[Session, Depends(get_session)]) -> User:
    credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = get_user_from_token(session, token)
    if not user:
        raise credentials_exception
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.actif:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    return current_user

def require_chef_central(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != UserRole.CHEF_CENTRAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access reserve au chef central"
        )
    return current_user


def require_chef_agence(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != UserRole.CHEF_AGENCE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access reserve au chef d'agence"
        )
    return current_user

SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]
CurrentUser = Annotated[User, Depends(get_current_active_user)]
RequireChefCentral = Annotated[User, Depends(require_chef_central)]
RequireChefAgence = Annotated[User, Depends(require_chef_agence)]