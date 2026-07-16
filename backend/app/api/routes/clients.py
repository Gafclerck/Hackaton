from fastapi import APIRouter, HTTPException, status

from app.core.deps import SessionDep, CurrentUser
from app.schemas.client import ClientCreate, ClientRead
from app.services import client_service

router = APIRouter()


@router.post("", response_model=ClientRead, status_code=status.HTTP_201_CREATED)
def creer_client(data: ClientCreate, db: SessionDep, current_user: CurrentUser):
    client = client_service.creer_client(db, data)
    return client


@router.get("", response_model=list[ClientRead])
def lister_clients(db: SessionDep, current_user: CurrentUser):
    return client_service.lister_clients(db)


@router.get("/{client_id}", response_model=ClientRead)
def obtenir_client(client_id: int, db: SessionDep, current_user: CurrentUser):
    client = client_service.obtenir_client(db, client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client introuvable")
    return client
