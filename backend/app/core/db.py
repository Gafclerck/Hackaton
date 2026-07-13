from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL_DEV,
    echo=settings.DEBUG,
    pool_pre_ping=True
)

session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)