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

**Raison** : evite la duplication des champs communs (nom, prenom, email, password, agence_id).
Chaque schema public ne contient que ce que le role peut effectivement controler.

## Dossier: creation avec auto-assignation

`POST /api/dossier/create` accepte uniquement `{ client_id, type_affaire_id, titre, description_initiale?, priorite? }`.
`agence_receptrice_id` et `avocat_en_chef_id` sont derives automatiquement du JWT:
- `agence_receptrice_id` = `user.agence_id`
- `avocat_en_chef_id` = chef_agence de la meme agence, ou self si l'utilisateur est chef_agence

**Raison** : le frontend ne connait pas toujours la structure organique. Deriver ces valeurs
cote serveur garantit la coherence et evite les erreurs d'assignation.

## Dossier: filtrage par role

Le endpoint `GET /api/dossier/all` retourne:
- Les dossiers de l'agence si l'utilisateur est `chef_agence`
- Les dossiers assigns si l'utilisateur est `avocat`
- Tous les dossiers si l'utilisateur est `chef_central`

**Raison** : chaque role a une visibilite differente. Le filtrage cote serveur
protege les donnees et evite de charger des dossiers inutilement.

## Dossier: transitions de statut

Les transitions de statut sont validees cote serveur via `PATCH /api/dossier/{id}/statut`.
Le statut "termine" est protege: seuls `chef_central` et `chef_agence` peuvent cloturer.
Un dossier peut etre transfere (`PATCH /api/dossier/{id}/transfer`) ce qui remet le statut
a `en_attente_affectation` et efface l'assignation.

**Raison** : en droit, la cloture d'un dossier est un acte administratif qui ne peut
etre fait que par un responsable. Le transfert libere le dossier pour re-assignation.
