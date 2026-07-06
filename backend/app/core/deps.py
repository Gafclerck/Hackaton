from fastapi.security import OAuth2PasswordBearer
from typing import Generator
from sqlalchemy.orm import Session
from app.core.db import session

def get_session() -> Generator[Session, None, None]:
    sessionlocal = session()
    try:
        yield sessionlocal
    finally:
        sessionlocal.close()