from fastapi import APIRouter

api_router = APIRouter()

@api_router.get("/referentiel/affaire")
def typeAffaireRead(typeAffaire : typeAffaireRead):
    pass

@api_router.get("/referentiel/specialite")
def SpecialiteRead(specialite: SpecialiteRead):
    pass