from pydantic_settings import BaseSettings
from dotenv import load_dotenv
load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str
    
    # PROJECT_NAME: str 
    # API_STR: str
    # ENVIRONMENT: str = "local"

    # SECRET_KEY: str
    # ALGORITHM: str 
    # ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # VERIFICATION_CODE_EXPIRE_MINUTES: int = 15
    # all_cors_origins: list = ["*"]

    # FIRST_SUPERUSER: str
    # FIRST_SUPERUSER_PASSWORD: str

    # STRIPE_SECRET_KEY: str
    # STRIPE_PUBLISHABLE_KEY: str
    # STRIPE_WEBHOOK_SECRET: str
    # FRONTEND_URL: str

settings = Settings()