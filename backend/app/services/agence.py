from sqlalchemy.orm import Session
from app.schemas.agence import AgenceRequest, AgenceResponse
from app.models.Agence import Agence
from fastapi import HTTPException, status

def add_agence(db : Session, agence_data : AgenceRequest) -> AgenceResponse:
    agence_db = db.query(Agence).filter(Agence.nom==agence_data.nom).first()
    if agence_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agence deja existante",
        )
    agence = Agence(**agence_data.dict())
    db.add(agence)
    db.commit()
    db.refresh(agence)
    return agence

def get_agence_by_id(db : Session, agence_id : int) -> AgenceResponse:
    agence = db.query(Agence).filter(Agence.id==agence_id).first()
    if not agence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agence non trouvée",
        )
    return agence

def get_all_agences(db : Session):
    return db.query(Agence).all()

def update_agence(db : Session, agence_id : int, agence_data : AgenceRequest) -> AgenceResponse:
    agence = db.query(Agence).filter(Agence.id==agence_id).first()
    if not agence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agence non trouvée",
        )
    for key, value in agence_data.dict().items():
        setattr(agence, key, value)
    db.commit()
    db.refresh(agence)
    return agence