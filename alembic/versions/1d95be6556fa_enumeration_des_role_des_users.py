"""Enumeration des role des users

Revision ID: 1d95be6556fa
Revises: ceeb9073f44c
Create Date: 2026-07-12 10:32:29.284433

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '1d95be6556fa'
down_revision: Union[str, Sequence[str], None] = 'ceeb9073f44c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


userrole_enum = postgresql.ENUM(    
    "CHEF_CENTRAL",
    "CHEF_AGENCE",
    "AVOCAT",
    name="userrole",
)

def upgrade():
    bind = op.get_bind()

    userrole_enum.create(bind, checkfirst=True)

    op.alter_column(
        "user",
        "role",
        existing_type=sa.String(length=50),
        type_=userrole_enum,
        existing_nullable=False,
        postgresql_using="role::userrole",
    )


def downgrade():
    bind = op.get_bind()

    op.alter_column(
        "user",
        "role",
        existing_type=userrole_enum,
        type_=sa.String(length=50),
        existing_nullable=False,
        postgresql_using="role::text",
    )

    userrole_enum.drop(bind, checkfirst=True)