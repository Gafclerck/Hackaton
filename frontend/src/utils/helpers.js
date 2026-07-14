export const ROLE_LABELS = {
  chef_central: "Gérant Central",
  chef_agence: "Avocat en Chef",
  avocat: "Avocat",
};

export const STATUT_LABELS = {
  en_attente: "En attente",
  en_cours: "En cours",
  en_analyse_ia: "Analyse IA",
  affecte: "Affecté",
  transfert_demande: "Transfert",
  cloture: "Clôturé",
  archive: "Archivé",
  nouveau: "Nouveau",
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

export function getInitials(nom) {
  if (!nom) return "?";
  return nom
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "#1B2A4A", "#2F7A54", "#9C7A3C", "#B7791F", "#4A6FA5", "#6B4E71",
];

export function getAvatarColor(name) {
  const hash = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function formatBytes(octets) {
  if (!octets) return "—";
  if (octets < 1024) return octets + " o";
  if (octets < 1048576) return (octets / 1024).toFixed(1) + " Ko";
  return (octets / 1048576).toFixed(1) + " Mo";
}

export function getPrioriteColor(p) {
  if (p >= 4) return "text-warning";
  if (p >= 3) return "text-primary";
  return "text-muted-foreground";
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}
