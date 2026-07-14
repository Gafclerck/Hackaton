from fastapi import APIRouter

from app.api.routes import auth, client, agence, referentiel

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(client.router, prefix="/client", tags=["client"])
api_router.include_router(agence.router, prefix="/agence", tags=["agence"])
api_router.include_router(referentiel.router, prefix="/referentiel", tags=["referentiel"])
