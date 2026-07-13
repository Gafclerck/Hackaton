from fastapi import APIRouter

api_router = APIRouter()

@api_router.get("/clients")
def clientCreate(client : clientRead):
    pass

@api_router.post("/clients")
def clientRead():
    pass