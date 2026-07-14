from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.Client import Client
from app.schemas.client import ClientCreate, ClientUpdate, ClientRead


def create_client(data: ClientCreate, db: Session) -> ClientRead:
    existing = db.query(Client).filter(
        or_(Client.telephone == data.telephone, Client.email == data.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce client existe deja",
        )
    new_client = Client(**data.model_dump())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client


def list_clients(skip: int, limit: int, db: Session) -> list[ClientRead]:
    return db.query(Client).offset(skip).limit(limit).all()


def get_client_by_id(client_id: int, db: Session) -> ClientRead:
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )
    return client


def update_client(client_id: int, data: ClientUpdate, db: Session) -> ClientRead:
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aucun champ a modifier",
        )
    for field, value in update_data.items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return client
