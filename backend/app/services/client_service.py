from sqlalchemy.orm import Session

from app.models.Client import Client
from app.schemas.client import ClientCreate


def creer_client(db: Session, data: ClientCreate) -> Client:
    client = Client(**data.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def lister_clients(db: Session) -> list[Client]:
    return db.query(Client).all()


def obtenir_client(db: Session, client_id: int) -> Client | None:
    return db.query(Client).filter(Client.id == client_id).first()
