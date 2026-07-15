# OUT_OF_SCOPE.md — Fonctionnalités hors périmètre MVP

> Ce document recense les fonctionnalités prévues dans le prototype Figma mais
> délibérément exclues du MVP pour des raisons de temps (hackathon) ou de
> complexité backend. Elles seront implémentées dans une itération ultérieure.

---

## 1. Spécialités par utilisateur (UserSpecialite)

**Figma spec** (Prompt 4.2) : multi-sélection de spécialités avec niveau de compétence
par utilisateur, affichée en tags sur la liste et en formulaire sur la création/édition.

**Ce qui existe** :
- Modèle `UserSpecialite` dans `backend/app/models/UserSpecialite.py` (PK composite
  `user_id` + `specialite_id`, champ `niveau`)
- Modèle `Specialite` dans `backend/app/models/Specialite.py` (id, libelle, description)
- Endpoint `GET /api/specialites` et `POST /api/specialites/create` (référentiel)

**Ce qui manque** :
- Endpoint `GET /api/user/{id}/specialites` — lister les spécialités d'un utilisateur
- Endpoint `POST /api/user/{id}/specialites` — assigner des spécialités
- Endpoint `DELETE /api/user/{id}/specialites/{specialite_id}` — retirer une spécialité
- Frontend : multi-select avec niveau dans le formulaire utilisateur
- Frontend : tags de spécialités sur les cartes et le détail utilisateur

**Impact UI** : La liste et le détail utilisateur affichent actuellement le rôle et
l'agence mais pas les spécialités. Le formulaire de création n'inclut pas la
sélection de spécialités.

---

## 2. Réinitialisation du mot de passe

**Figma spec** (Prompt 4.2) : bouton dédié "Réinitialiser le mot de passe" dans
l'édition utilisateur, réservé au Gérant central.

**Ce qui manque** :
- Endpoint `POST /api/user/{id}/reset-password` (génère un mot de passe temporaire
  ou accepte un nouveau mot de passe, envoie par email si service email configuré)
- Frontend : bouton "Réinitialiser le mot de passe" dans le détail/édition utilisateur
- Frontend : dialog de confirmation avant reset

**Impact UI** : Aucun moyen actuellement de réinitialiser le mot de passe d'un
utilisateur depuis l'interface admin.

---

## 3. Système de 5 rôles

**Figma spec** : le prototype initial prévoyait 5 rôles — Gérant central, Avocat en
chef, Avocat, Assistant juridique, Secrétaire.

**Backend actuel** : 3 rôles — `chef_central`, `chef_agence`, `avocat`.

**Impact** : Le sélecteur de rôle dans le formulaire de création utilisateur n'offre
que 3 options. Les rôles "Assistant juridique" et "Secrétaire" auraient pu avoir
des permissions intermédiaires (ex: l'assistant peut voir les dossiers de son agence
sans pouvoir affecter, le secrétaire peut créer des dossiers mais pas les affecter).

---

## 4. Notifications push temps réel

**Figma spec** : badge de notifications (cloche + compteur) dans la topbar.

**Backend actuel** : Modèle `Notification` existe mais aucun endpoint CRUD.

**Workaround MVP** : Pas de notifications. Le compteur de messages non lus sur le
dashboard avocat est recalculé au chargement de page.

---

## 5. Messagerie intra-dossier

**Figma spec** (Prompt 3.3) : fil de messages chronologique plat par dossier,
champ de saisie, badge d'agence sur les messages externes.

**Backend actuel** : Modèles `Discussion` et `MessageDiscussion` existent mais aucun
endpoint.

**Workaround MVP** : L'onglet Messagerie dans la fiche dossier affiche une coquille
vide avec un message d'invitation.

---

## 6. Système de toast / notifications visuelles

**Figma spec** (Design System skill) : "succès (toast transitoire 4 secondes)".

**Frontend actuel** : Pas de composant Toast. Les succès sont gérés par fermeture
de dialog et rafraîchissement de la liste. Les erreurs sont affichées inline dans
les formulaires.

---

## 7. Skeleton loading

**Figma spec** (Design System skill) : "chargement (squelette/skeleton, jamais un
spinner plein écran)".

**Frontend actuel** : Texte "Chargement..." centré pendant le fetch.

---

## 8. Responsive mobile

**Figma spec** (Sprint Design 5) : Adaptations mobile pour les écrans prioritaires
(connexion, liste dossiers, fiche dossier, messagerie, dashboard avocat). Les écrans
admin (agences, utilisateurs) sont desktop-only.

---

## 9. Documents upload / preview

**Figma spec** (Prompt 3.1) : zone de glisser-déposer, liste de documents, aperçu
PDF inline, case confidentiel.

---

## 10. Historique / audit trail

**Figma spec** (Prompt 3.2) : timeline verticale chronologique avec icônes par type
d'action, valeur avant→après.

---

*Document créé le 15 juillet 2026 — MVP*
