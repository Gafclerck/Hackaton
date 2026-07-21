from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.core.deps import limiter
from fastapi.staticfiles import StaticFiles
from app.core.storage import UPLOAD_DIR

app = FastAPI()
app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Trop de requetes. Reessayez plus tard."},
    )


from app.api.main import api_router
app.include_router(api_router, prefix=settings.API_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="localhost", port=8000, reload=True)
