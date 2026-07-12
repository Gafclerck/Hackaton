from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL_DEV,
    echo=True,
    pool_pre_ping=True
)

session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# def init_db(session: Session):
#     from app.schemas.user import AdminRegistrationRequest
#     from app.models.user import UserRole
#     from app.services.auth_service import register_user
#     from fastapi import HTTPException

#     user_in = AdminRegistrationRequest(
#         name="Admin",
#         email=settings.FIRST_SUPERUSER,
#         password=settings.FIRST_SUPERUSER_PASSWORD,
#         role=UserRole.admin,
#         is_active=True,
#     )

#     try:
#         register_user(session, user_in)
#     except HTTPException:
#         # Superuser already exists - nothing to do
#         pass