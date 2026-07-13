


from fastapi import HTTPException, status

from app.models.Client import Client
from app.schemas.schemas.client import ClientCreate
from sqlalchemy.orm import Session


def clientCreate(data : ClientCreate, db: Session):
    client = db.query(Client).filter(Client.telephone == data.telephone or Client.email == data.email).first()
    if client : 
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail="Ce client existe deja")
    
    new_client = Client(**data.model_dump())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)

    return new_client

def getAllClient(db: Session):
    return db.query(Client).all()