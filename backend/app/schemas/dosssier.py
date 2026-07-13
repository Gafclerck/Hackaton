from pydantic import BaseModel

class DossierRequest(BaseModel):
    client_id:int
    agence_receptrice_id: int
    avocat_en_chef_id: int
    type_affaire_id: int
    
    reference: str
    titre: str
    description_initiale: str
    statut: str
    priorite: int

    class Config:
        from_attributes = True

class DossierResponse(BaseModel):
    reference: str
    titre: str
    client_id:int
    type_affaire_id: int
    agence_receptrice_id: int
    avocat_en_chef_id: int
    statut: str
    priorite: int

class AffectationRequest(BaseModel):
    avocat_id:int
    dossier_id:int
    