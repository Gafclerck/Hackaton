from fastapi import APIRouter

from app.api.routes import auth
from app.api.routes import clients

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(clients.api_router,prefix="/client", tags=["client"])
