# Nom du Projet

## Présentation

Description courte du projet.

---

# Structure du projet

```text
project/
│
├── frontend/        # Application cliente React
├── backend/         # API FastAPI
├── docs/            # Documentation du projet
└── README.md
```

---

# Documentation

Chaque partie possède sa propre documentation :

| Partie   | Documentation        |
| -------- | -------------------- |
| Frontend | `frontend/README.md` |
| Backend  | `backend/README.md`  |

---

# Prérequis

- Git
- Node.js
- Python 3.12+
- npm

---

# Récupération du projet

Cloner le dépôt :

```bash
git clone https://github.com/Gafclerck/Hackaton.git
cd Hackaton
```

---

# Workflow Git

## Branches principales

### main

Branche de production.

Règles :

- Aucun développement direct.
- Aucun commit direct.
- Aucun push direct.

---

### develop

Branche d'intégration.

Toutes les fonctionnalités validées sont fusionnées dans cette branche avant d'arriver sur `main`.

---

## Création d'une branche

Toujours partir de `develop`.

```bash
git checkout develop
git pull origin develop

git checkout -b feature/nom-fonctionnalite
```

Exemples :

```bash
git checkout -b feature/authentication
git checkout -b feature/dashboard
git checkout -b feature/user-management
```

---

## Développement

Vérifier les modifications :

```bash
git status
```

---

## Commit

Ajouter les fichiers :

```bash
git add .
```

Créer un commit :

```bash
git commit -m "feat(auth): add login endpoint"
```

---

## Push

```bash
git push origin feature/authentication
```

---

## Pull Request

Créer une Pull Request :

```text
feature/*
        ↓
develop
```

Les Pull Requests vers `main` sont interdites sauf validation du projet.

---

# Convention de commits

## Nouvelle fonctionnalité

```text
feat: add login feature
```

## Correction

```text
fix: resolve authentication bug
```

## Documentation

```text
docs: update README
```

## Refactoring

```text
refactor: simplify service layer
```

## Tests

```text
test: add authentication tests
```

---

# Ce qu'il ne faut PAS faire

❌ Commit directement sur `main`

❌ Développer directement sur `develop`

❌ Push du code non testé

❌ Modifier le travail d'un autre membre sans concertation

❌ Committer les fichiers suivants :

```text
.env
node_modules/
dist/
.venv/
__pycache__/
```

❌ Utiliser des messages de commit non explicites :

```text
update
test
aaa
modification
```

---

# Erreurs fréquentes à éviter

## Oublier de synchroniser sa branche

Toujours commencer par :

```bash
git checkout develop
git pull origin develop
```

---

## Travailler plusieurs jours sans pull

Synchroniser régulièrement avec `develop`.

---

## Faire des commits trop volumineux

Préférer plusieurs petits commits cohérents.

---

## Mélanger plusieurs fonctionnalités

Une branche = une fonctionnalité.

---

## Ignorer les conflits Git

Comprendre les conflits avant de les résoudre.

Ne jamais exécuter de commandes de résolution automatique sans comprendre leur impact.

---

# Bonnes pratiques

- Faire des commits fréquents.
- Tester avant chaque push.
- Garder les branches courtes.
- Documenter les décisions importantes.
- Relire son code avant une Pull Request.
- Prévenir l'équipe lorsqu'une modification impacte plusieurs modules.

---

# Support

Pour les détails techniques :

- Voir `frontend/README.md`
- Voir `backend/README.md`
