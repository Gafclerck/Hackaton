export const agences = [
  { id: "ag-1", nom: "Cabinet Diop & Associés — Siège", ville: "Dakar", est_siege: true },
  { id: "ag-2", nom: "Antenne Thiès", ville: "Thiès", est_siege: false },
  { id: "ag-3", nom: "Antenne Saint-Louis", ville: "Saint-Louis", est_siege: false },
];

export const utilisateurs = [
  { id: "u-1", nom: "Fatou Diop", prenom: "Fatou", role: "chef_central", agence_id: "ag-1", email: "f.diop@cabinet.sn" },
  { id: "u-2", nom: "Moussa Sow", prenom: "Moussa", role: "chef_agence", agence_id: "ag-1", email: "m.sow@cabinet.sn" },
  { id: "u-3", nom: "Aïssatou Ba", prenom: "Aïssatou", role: "avocat", agence_id: "ag-1", email: "a.ba@cabinet.sn", specialites: ["Droit commercial"], charge_actuelle: 4 },
  { id: "u-4", nom: "Ibrahima Fall", prenom: "Ibrahima", role: "avocat", agence_id: "ag-2", email: "i.fall@cabinet.sn", specialites: ["Droit du travail"], charge_actuelle: 2 },
  { id: "u-5", nom: "Khady Ndiaye", prenom: "Khady", role: "avocat", agence_id: "ag-3", email: "k.ndiaye@cabinet.sn", specialites: ["Droit de la famille"], charge_actuelle: 6 },
  { id: "u-6", nom: "Cheikh Gueye", prenom: "Cheikh", role: "avocat", agence_id: "ag-1", email: "c.gueye@cabinet.sn" },
  { id: "u-7", nom: "Mariama Diallo", prenom: "Mariama", role: "avocat", agence_id: "ag-1", email: "m.diallo@cabinet.sn" },
];

export const clients = [
  { id: "c-1", type_client: "PHYSIQUE", nom: "Ousmane Kane", telephone: "+221 77 123 45 67", email: "o.kane@email.sn", nin: "1234567890123" },
  { id: "c-2", type_client: "MORALE", nom: "SENEGAL BTP SARL", telephone: "+221 33 456 78 90", email: "contact@senegalbtp.sn", rccm: "SN-DKR-2019-B-1234" },
];

export const dossiers = [
  {
    id: 1, reference: "DOS-2026-001", titre: "Litige contractuel SENEGAL BTP",
    client_id: "c-2", type_affaire: "Droit commercial",
    statut: "nouveau", priorite: 3, agence_receptrice_id: "ag-1",
    description_initiale: "Litige portant sur l'exécution d'un contrat de construction.",
    date_reception: "2026-07-10T09:00:00Z",
  },
  {
    id: 2, reference: "DOS-2026-002", titre: "Rupture de contrat de travail",
    client_id: "c-1", type_affaire: "Droit du travail",
    statut: "en_analyse_ia", priorite: 4, agence_receptrice_id: "ag-1",
    description_initiale: "Employé licencié sans motif valable, demande d'indemnisation.",
    date_reception: "2026-07-08T14:30:00Z",
  },
  {
    id: 3, reference: "DOS-2026-003", titre: "Succession familiale Kane",
    client_id: "c-1", type_affaire: "Droit de la famille",
    statut: "en_attente", priorite: 2, agence_receptrice_id: "ag-1",
    description_initiale: "Succession de M. Kane senior, répartition des biens immobiliers entre héritiers.",
    date_reception: "2026-07-05T11:00:00Z",
    analyse_ia: {
      resume_genere: "Litige successoral portant sur la répartition de biens immobiliers entre héritiers. Absence de testament formel.",
      type_detecte: "Droit de la famille",
      mots_cles: ["succession", "indivision", "biens immobiliers"],
      agence_suggeree_id: "ag-3",
      avocat_suggere_id: "u-5",
      score_confiance: 0.82,
      modele_ia: "gpt-4",
      validee: false,
    },
  },
  {
    id: 4, reference: "DOS-2026-004", titre: "Contentieux fournisseur",
    client_id: "c-2", type_affaire: "Droit commercial",
    statut: "affecte", priorite: 3,
    agence_receptrice_id: "ag-1", agence_assigne_id: "ag-1", avocat_assigne_id: "u-3",
    date_reception: "2026-07-03T08:00:00Z", date_affectation: "2026-07-04T10:00:00Z",
  },
  {
    id: 5, reference: "DOS-2026-005", titre: "Licenciement abusif",
    client_id: "c-1", type_affaire: "Droit du travail",
    statut: "en_cours", priorite: 5,
    agence_receptrice_id: "ag-1", agence_assigne_id: "ag-2", avocat_assigne_id: "u-4",
    date_reception: "2026-06-25T09:00:00Z", date_affectation: "2026-06-26T14:00:00Z",
  },
  {
    id: 6, reference: "DOS-2026-006", titre: "Contentieux bail commercial",
    client_id: "c-2", type_affaire: "Droit commercial",
    statut: "transfert_demande", priorite: 3,
    agence_receptrice_id: "ag-1", agence_assigne_id: "ag-1", avocat_assigne_id: "u-3",
    motif_transfert: "Client basé à Saint-Louis, suivi plus efficace localement",
    date_reception: "2026-07-01T10:00:00Z", date_affectation: "2026-07-02T09:00:00Z",
  },
  {
    id: 7, reference: "DOS-2025-098", titre: "Divorce par consentement",
    client_id: "c-1", type_affaire: "Droit de la famille",
    statut: "cloture", priorite: 1,
    agence_receptrice_id: "ag-3", agence_assigne_id: "ag-3", avocat_assigne_id: "u-5",
    date_reception: "2025-11-10T08:00:00Z", date_cloture: "2026-02-15T16:00:00Z",
  },
  {
    id: 8, reference: "DOS-2025-045", titre: "Recouvrement de créance",
    client_id: "c-2", type_affaire: "Droit commercial",
    statut: "archive", priorite: 2,
    agence_receptrice_id: "ag-1", agence_assigne_id: "ag-1", avocat_assigne_id: "u-3",
    date_reception: "2025-06-20T08:00:00Z", date_cloture: "2025-09-30T16:00:00Z",
  },
];

export const TYPES_AFFAIRE = [
  "Droit commercial", "Droit des sociétés", "Droit du travail",
  "Droit de la famille", "Droit immobilier", "Droit foncier",
  "Droit maritime", "Droit pénal économique", "Droit pénal",
  "Propriété intellectuelle", "Procédures collectives",
  "Recouvrement de créances", "Droit des successions",
  "Droit administratif", "Arbitrage OHADA",
];

export function getClient(id) {
  return clients.find((c) => c.id === id);
}

export function getAgence(id) {
  return agences.find((a) => a.id === id);
}

export function getUtilisateur(id) {
  return utilisateurs.find((u) => u.id === id);
}

export function getDossier(ref) {
  return dossiers.find((d) => d.reference === ref);
}
