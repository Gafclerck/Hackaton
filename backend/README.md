# Backend Documentation

## Présentation

Le backend est développé avec FastAPI.

Il est responsable de :

- L'exposition des APIs
- L'authentification
- La logique métier
- L'accès aux données
- La sécurité

---

# Installation

## Création de l'environnement virtuel

```bash
python -m venv .venv
```

---

## Activation

### Windows

```bash
.venv\Scripts\activate
```

### Linux / WSL

```bash
source .venv/bin/activate
```

---

## Installation des dépendances

```bash
pip install -r requirements.txt
```

---

# Variables d'environnement

Créer un fichier :

```text
.env
```

Y placer les variables nécessaires au projet.

Exemple :

```env
DATABASE_URL=
SECRET_KEY=
ACCESS_TOKEN_EXPIRE_MINUTES=
```

⚠️ Le fichier `.env` ne doit jamais être commit.

---

# Lancement du projet

```bash
uvicorn app.main:app --reload
```

Accès :

```text
API : http://localhost:8000
Swagger : http://localhost:8000/docs
ReDoc : http://localhost:8000/redoc
```

---

# Architecture

```text
backend/
│
├── app/
│   │
│   ├── api/
│   │   └── routes/
│   │
│   ├── core/
│   │   ├── base.py
│   │   ├── config.py
│   │   ├── db.py
│   │   └── deps.py
│   │
│   ├── models/
│   ├── schemas/
│   ├── services/
│   │
│   └── main.py
│
├── .env
├── requirements.txt
└── README.md
```

---

# Description des dossiers

## api/routes/

Définition des endpoints HTTP.

Responsabilités :

- recevoir les requêtes
- appeler les services
- retourner les réponses

---

## core/

Contient les éléments centraux du projet.

### base.py

Configuration de la classe Base SQLAlchemy.

### config.py

Gestion des variables de configuration.

### db.py

Connexion à la base de données.

### deps.py

Dépendances réutilisables FastAPI.

---

## models/

Modèles ORM représentant les tables.

Exemples :

```text
User
Role
Appointment
```

---

## schemas/

Schémas Pydantic.

Responsabilités :

- validation des données
- sérialisation des réponses

---

## services/

Logique métier de l'application.

Les routes doivent rester légères.

Toute logique métier doit être placée ici.

---

## app/main.py

Point d'entrée principal de FastAPI.

Responsabilités :

- création de l'application
- enregistrement des routes
- configuration globale

---

# Règles d'architecture

## Flux recommandé

```text
Route
  ↓
Service
  ↓
Model / Database
```

---

## Ce qu'il ne faut PAS faire

❌ Mettre la logique métier dans les routes.

❌ Faire des requêtes SQL directement dans les routes.

❌ Accéder à la base depuis plusieurs couches sans passer par les services.

❌ Dupliquer les schémas ou modèles.

❌ Hardcoder des secrets dans le code.

---

# Bonnes pratiques

- Une responsabilité par fichier.
- Des services courts et cohérents.
- Des schémas explicites.
- Des routes légères.
- Des noms clairs pour les modèles et services.
- Utiliser les dépendances FastAPI pour l'injection des ressources.

---

# Avant de créer une Pull Request

Vérifier :

- L'application démarre correctement.
- Les endpoints testés fonctionnent.
- Aucun secret n'est commité.
- Les imports inutilisés sont supprimés.
- Les dépendances ajoutées sont documentées dans `requirements.txt`.
