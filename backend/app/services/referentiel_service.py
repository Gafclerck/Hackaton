from sqlalchemy.orm import Session

from app.models.TypeAffaire import TypeAffaire
from app.models.Specialite import Specialite


def lister_types_affaire(db: Session) -> list[TypeAffaire]:
    return db.query(TypeAffaire).all()


def lister_specialites(db: Session) -> list[Specialite]:
    return db.query(Specialite).all()
