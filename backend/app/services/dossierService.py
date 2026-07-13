from models import DossierModel
from models import Dossier
from sqlachemy.orm import Session
import psycopg
from app.schemas.dosssier import AffectationRequest

def creerDossier(dossier:Dossier,db:Session):
    doss=Dossier(id=dossier.id,client_id=dossier.client_id,agence_receptrice_id=dossier.agence_receptrice_id,
                                     avocat_en_chef_id=dossier.avocat_en_chef_id,agence_assigne_id=dossier.agence_assigne_id,
                                     avocat_assigne_id=dossier.avocat_assigne_id,type_affaire_id=dossier.type_affaire_id,
                                     reference=dossier.reference,titre=dossier.titre,description_initiale=dossier.description_initiale,
                                     statut=dossier.statut,priorite=dossier.priorite,date_reception=dossier.date_reception,
                                     date_affectation=dossier.date_affectation,dossier=date_cloture)
    
    db.add(doss)
    db.commit()

def voirDossier()->list[Dossier]:
    dossiers=db.query(Dossier).all()
    return dossiers

def attribuerDossierAAvocat(data:AffectationRequest,db:Session):
    dossier=db.get(Dossier,data.dossier_id)
    dossier.avocat_assigne_id=data.avocat_id

def changerStatut(data:AffectationRequest,db:Session):
    dossier=db.get(Dossier,data.dossier_id)
    dossier.statut="en_cour"