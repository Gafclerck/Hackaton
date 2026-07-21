from fastapi import APIRouter
from app.services.historiques_service import get_historique_by_dossier_id

router=APIRouter()
@router.get("/api/dossiers/:id/historique")
def readHistorique(id:int,user:CurrentUser, db: SessionDep)->HistoriqueActionRead:
    return get_historique_by_dossier_id(id,user,db)
