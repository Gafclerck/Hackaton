# Architecture Decisions — Backend

## Auth: ALGORITHM hardcodé (pas en .env)

`ALGORITHM = "HS256"` est hardcodé dans `config.py`, pas exposé comme variable d'environnement.

**Raison** : PyJWT avec `algorithm="none"` désactive toute vérification de signature.
Un attaquant avec accès au `.env` pourraitfabriquer des tokens arbitraires avec le payload de son choix.
C'est une CVE classique (CVE-2022-29217). L'algorithm est un choix technique de sécurité,
pas une configuration déployable.

## Auth: Deux routes d'inscription séparées

- `POST /api/auth/chef_central/register` — protégée, permet d'assigner tout rôle
- `POST /api/auth/chef_agence/register` — protégée, force le rôle AVOCAT

**Raison** : l'ancienne route `/register` était publique et acceptait un champ `role`,
permettant à n'importe qui de s'auto-promouvoir `chef_central`. La séparation garantit
que seuls les utilisateurs autorisés peuvent créer des comptes, et que le rôle est
toujours assigné par un supérieur hiérarchique.

La route `/register` publique est conservée uniquement pour les tests.

## Auth: Types de retour explicites

`authenticate_user` et `get_user_from_token` retournent `User | None` (pas `bool`, pas `False`).

**Raison** : le code original retournait `User | bool` ce qui causait des bugs silencieux.
Par exemple, `get_user_from_token` retournait `False` quand l'utilisateur n'existait pas,
et le code marchait par accident car `if not user` catch les deux. Les types explicites
rendent le code lisible et évitent ces pièges.

## CORS: ALLOWED_ORIGINS en .env

Les origines autorisées sont configurées via `ALLOWED_ORIGINS` dans `.env` (format JSON array).

**Raison** : permet de changer les origines sans rebuild, utile quand le frontend
est déployé sur un domaine différent en prod. Le format JSON array est nativement
supporté par pydantic-settings.

## Schémas: héritage pour les registrations

`ChefCentralRegisterRequest` et `ChefAgenceRegisterRequest` héritent de
`BaseRegistrationRequest` (champs communs). La classe `RegistrationRequest` est
conservée pour les tests.

**Raison** : évite la duplication des champs communs (nom, prenom, email, password, agence_id).
Chaque schéma public ne contient que ce que le rôle peut effectivement contrôler.
