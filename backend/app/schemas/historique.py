from pydantic import BaseModel, Field

class HistoriqueActionRead(BaseModel){
    id:int
    dossier_id : int
    user_id: int
    action: str
    ancienne_valeur: dict
    nouvelle_valeur: dict
    commentaire: str
    created_at: datetime
}