# Backend TODO

## Completed

- [x] Auth system (JWT, login, register, refresh, me)
- [x] User CRUD (list, get by id, update by id, chef_central only)
- [x] Client CRUD (create, list, get, update, uniqueness check)
- [x] Agence CRUD (create, list, get, update)
- [x] Referentiel endpoints (type_affaires, specialites)
- [x] Dossier CRUD (create, list, get, affecter, statut, transfer)
- [x] Role-based dossier filtering (chef_central: all, chef_agence: agence, avocat: assigned)
- [x] Auto-assign agence/avocat on dossier creation from JWT
- [x] Status transition validation (termine restricted to chef_central/chef_agence)
- [x] Agence user list endpoint (`GET /api/agence/{id}/users`)

## Pending (requires DB migration)

- [ ] Run `alembic upgrade head` to apply pending migration

## Future (hors MVP)

- [ ] UserSpecialite assignment (specialites per user with level)
- [ ] Document upload endpoints
- [ ] HistoriqueAction audit trail
- [ ] Discussion/messagerie endpoints
- [ ] Notification endpoints
- [ ] AnalyseIa CRUD endpoints
- [ ] Password reset flow
- [ ] SlowAPI rate limiting tuning
