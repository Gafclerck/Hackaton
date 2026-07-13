from fastapi import APIRouter

from app.core.deps import SessionDep
from app.schemas.schemas.client import ClientCreate
from app.services.clients_service import getAllClient,clientCreate
api_router = APIRouter()

@api_router.post("/create")
def create(client : ClientCreate,db: SessionDep):
    return clientCreate(client , db)

@api_router.get("/liste")
def read(db: SessionDep):
    return getAllClient(db)