// ─── Rôles (backend enum) ─────────────────────────────────────────────────────
export const ROLES = {
  chef_central: "chef_central",
  chef_agence: "chef_agence",
  avocat: "avocat",
};

export const ROLE_LABELS = {
  chef_central: "Gérant Central",
  chef_agence: "Avocat en Chef",
  avocat: "Avocat",
};

// ─── Statuts dossier (backend enum) ───────────────────────────────────────────
export const STATUT_DOSSIER = {
  nouveau: "nouveau",
  en_analyse_ia: "en_analyse_ia",
  en_attente: "en_attente",
  affecte: "affecte",
  en_cours: "en_cours",
  transfert_demande: "transfert_demande",
  cloture: "cloture",
  archive: "archive",
};

export const STATUT_LABELS = {
  nouveau: "Nouveau",
  en_analyse_ia: "Analyse IA",
  en_attente: "En attente",
  affecte: "Affecté",
  en_cours: "En cours",
  transfert_demande: "Transfert",
  cloture: "Clôturé",
  archive: "Archivé",
};

export const STATUT_STYLES = {
  nouveau:                { bg: "bg-status-nouveau-bg",   text: "text-status-nouveau-text" },
  en_analyse_ia:          { bg: "bg-status-ia-bg",        text: "text-status-ia-text" },
  en_attente:             { bg: "bg-status-attente-bg",   text: "text-status-attente-text" },
  affecte:                { bg: "bg-status-affecte-bg",   text: "text-status-affecte-text" },
  en_cours:               { bg: "bg-status-en-cours-bg",  text: "text-status-en-cours-text" },
  transfert_demande:      { bg: "bg-status-transfert-bg", text: "text-status-transfert-text" },
  cloture:                { bg: "bg-status-cloture-bg",   text: "text-status-cloture-text" },
  archive:                { bg: "bg-status-archive-bg",   text: "text-status-archive-text" },
};

export const STATUTS_ACTIFS = [
  "en_attente", "en_analyse_ia", "en_cours",
  "affecte", "transfert_demande", "nouveau",
];

export function isActif(statut) {
  return STATUTS_ACTIFS.includes(statut);
}

// ─── Priorité ─────────────────────────────────────────────────────────────────
export const PRIORITE_LABELS = {
  1: "Très basse",
  2: "Basse",
  3: "Normale",
  4: "Haute",
  5: "Très haute",
};

export const PRIORITE_SHORT = {
  1: "P1", 2: "P2", 3: "P3", 4: "P4", 5: "P5",
};

// ─── Types d'affaire ──────────────────────────────────────────────────────────
export const TYPES_AFFAIRE = [
  "Droit commercial", "Droit des sociétés", "Droit du travail",
  "Droit de la famille", "Droit immobilier", "Droit foncier",
  "Droit maritime", "Droit pénal économique", "Droit pénal",
  "Propriété intellectuelle", "Procédures collectives",
  "Recouvrement de créances", "Droit des successions",
  "Droit administratif", "Arbitrage OHADA",
];

// ─── Types de client ──────────────────────────────────────────────────────────
export const TYPE_CLIENT = {
  PHYSIQUE: "PHYSIQUE",
  MORALE: "MORALE",
};

export const TYPE_CLIENT_LABELS = {
  PHYSIQUE: "Personne physique",
  MORALE: "Personne morale",
};

// ─── UI constants ─────────────────────────────────────────────────────────────
export const SIDEBAR_WIDTH = 232;
