from fastapi import  APIRouter
from services import dossierService
from app.schemas.dosssier import DossierRequest,DossierResponse,AffectationRequest
from typing import List

router = APIRouter()


@router.post("/dossier")
def ajouterDossier(dossier:DossierRequest, db:Session):
    dossierService.creerDossier(dossier,db)

@router.get("/dossier")
def afficherDossiers()->List[DossierResponse]:
    dossiers=dossierService.voirDossier()
    return dossiers

@router.post("/affecter")
def attribuerDossierAAvocat(data:AffectationRequest,db:Session):
    dossierService.attribuerDossierAAvocat(data,db)

@router.post("/changerleStatutDunDossier")
def changerleStatutDunDossier(dossier_id:int,db:Session):
    dossierService.changerStatut(dossier_id,db)

