"""
Script one-shot pour peupler les tables de reference.
Lancer avec : python -m app.seed_referentiels
"""
from app.core.db import session
from app.models.TypeAffaire import TypeAffaire
from app.models.Specialite import Specialite

TYPES_AFFAIRE = [
    "Droit des societes",
    "Droit du travail",
    "Contentieux",
    "Recouvrement de creances",
    "Propriete intellectuelle",
    "Droit immobilier",
    "Droit civil",
    "Droit de la famille",
    "Droit de l'immigration",
]

SPECIALITES = [
    "Droit des societes",
    "Droit du travail",
    "Contentieux",
    "Recouvrement de creances",
    "Propriete intellectuelle",
    "Droit immobilier",
    "Droit civil",
    "Droit de la famille",
    "Droit de l'immigration",
]


def run():
    db = session()
    try:
        for libelle in TYPES_AFFAIRE:
            if not db.query(TypeAffaire).filter_by(libelle=libelle).first():
                db.add(TypeAffaire(libelle=libelle))

        for libelle in SPECIALITES:
            if not db.query(Specialite).filter_by(libelle=libelle).first():
                db.add(Specialite(libelle=libelle))

        db.commit()
        print("Referentiels peuples avec succes.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
