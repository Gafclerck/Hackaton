from fastapi import APIRouter

from app.api.routes import auth
from app.api.routes import agence

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(agence.router, prefix="/agence", tags=["agence"])
