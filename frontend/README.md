# Frontend Documentation

## Présentation

Le frontend est développé avec React et Vite.

Il est responsable de :

- L'interface utilisateur
- La navigation
- Les interactions utilisateur
- La communication avec l'API backend

---

# Installation

## Prérequis

- Node.js
- npm

Vérification :

```bash
node --version
npm --version
```

---

# Installation des dépendances

```bash
npm install
```

---

# Lancement du projet

Mode développement :

```bash
npm run dev
```

Application accessible sur :

```text
http://localhost:5173
```

---

# Build de production

```bash
npm run build
```

Les fichiers générés seront disponibles dans :

```text
dist/
```

---

# Structure du projet

```text
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── layouts/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

# Description des dossiers

## public/

Contient les ressources statiques :

- favicon
- images publiques
- fichiers accessibles directement

---

## assets/

Contient :

- images
- icônes
- styles
- ressources utilisées par React

---

## components/

Composants réutilisables.

Exemples :

```text
Button.jsx
Navbar.jsx
Sidebar.jsx
Modal.jsx
```

---

## pages/

Pages complètes de l'application.

Exemples :

```text
Login.jsx
Dashboard.jsx
Profile.jsx
```

---

## services/

Communication avec le backend.

Exemples :

```text
authService.js
userService.js
api.js
```

Aucune logique d'affichage ne doit être placée ici.

---

## hooks/

Hooks React personnalisés.

Exemples :

```text
useAuth.js
useFetch.js
```

---

## layouts/

Structures communes aux pages.

Exemples :

```text
MainLayout.jsx
AuthLayout.jsx
```

---

## routes/

Configuration des routes de l'application.

Exemples :

```text
index.jsx
ProtectedRoute.jsx
```

---

# Bonnes pratiques

- Un composant = une responsabilité.
- Éviter les composants trop volumineux.
- Réutiliser les composants existants.
- Centraliser les appels API dans `services/`.
- Utiliser des noms explicites.

---

# Ce qu'il ne faut PAS faire

❌ Faire des appels API directement dans plusieurs composants.

❌ Dupliquer du code.

❌ Mélanger logique métier et affichage.

❌ Stocker des secrets dans le frontend.

❌ Modifier la structure globale sans validation de l'équipe.

---

# Avant de créer une Pull Request

Vérifier :

- Le projet compile.
- Aucun warning important.
- Aucun fichier inutile n'est ajouté.
- Le code est relu.
