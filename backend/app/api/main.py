from fastapi import APIRouter

from app.api.routes import auth, clients, referentiels

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(referentiels.router, tags=["referentiels"])