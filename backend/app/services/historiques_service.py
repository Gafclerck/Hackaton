from sqlalchemy.orm import Session
from app.models.HistoriqueAction import HistoriqueAction
from app.models.Dossier import Dossier
from app.services.dossier_service import _apply_role_filter
from typing import List

def get_historique_by_dossier_id(dossier_id:int,user:CurrentUser, db: Session)->List[HistoriqueAction]:
    _apply_role_filter(user)
    historiques = db.query(HistoriqueAction).filter(Dossier.id == dossier_id)
    return historiques