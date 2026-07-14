import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock, FiHome, FiUserCheck, FiZap,
  FiCheckCircle, FiAlertCircle, FiChevronRight, FiList,
} from "react-icons/fi";
import { dossiers, getClient, getAgence, getUtilisateur } from "../../data/mockData";
import { ROLE_LABELS } from "../../utils/helpers";
import StatusBadge from "../../components/ui/StatusBadge";
import PrioriteStars from "../../components/ui/PrioriteStars";
import ConfidenceBar from "../../components/ui/ConfidenceBar";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";
import AffectationModal from "../../components/modals/AffectationModal";

const PRIORITE_LABELS = { 1: "P1", 2: "P2", 3: "P3", 4: "P4", 5: "P5" };

const ATTENTE_JOURS = { "DOS-2026-003": 7 };

function attenteLabel(ref) {
  const j = ATTENTE_JOURS[ref] || 1;
  return `${j} jour${j > 1 ? "s" : ""} d'attente`;
}

function chargeColor(n) {
  if (n === undefined) return "text-muted-foreground";
  if (n <= 3) return "text-success";
  if (n <= 5) return "text-warning";
  return "text-destructive";
}

function DossierCard({ dossier, onAffecter }) {
  const navigate = useNavigate();
  const ia = dossier.analyse_ia;
  const client = getClient(dossier.client_id);
  const agenceSuggeree = ia ? getAgence(ia.agence_suggeree_id) : null;
  const avocatSuggere = ia ? getUtilisateur(ia.avocat_suggere_id) : null;
  const prioriteHaute = dossier.priorite >= 4;

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">

      {/* Card header */}
      <div className="px-6 pt-5 pb-4 border-b border-border">
        <div className="flex items-start gap-3 flex-wrap mb-3">
          <StatusBadge statut={dossier.statut} />
          <span className="text-[11px] font-bold text-muted-foreground tabular-nums tracking-wide">
            {dossier.reference}
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <FiClock size={12} className={prioriteHaute ? "text-warning" : "text-muted-foreground"} />
            <span className={`text-[11px] ${prioriteHaute ? "text-warning font-semibold" : "text-muted-foreground"}`}>
              {attenteLabel(dossier.reference)}
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-1.5 leading-snug">
          {dossier.titre}
        </h3>
        <div className="flex items-center gap-2 flex-wrap text-[13px] text-muted-foreground">
          <span>{dossier.type_affaire}</span>
          {client && (
            <>
              <span className="text-border">·</span>
              <span>{client.nom}</span>
            </>
          )}
          <span className="text-border ml-1">·</span>
          <PrioriteStars priorite={dossier.priorite} />
          <span className="text-[11px] text-muted-foreground ml-1">{PRIORITE_LABELS[dossier.priorite]}</span>
        </div>
      </div>

      {/* IA analysis section */}
      {ia ? (
        <div className="px-6 py-5 bg-accent/[0.04] border-b border-border">

          {/* IA label + score */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5">
              <div className="w-[22px] h-[22px] rounded-full bg-accent/10 flex items-center justify-center">
                <FiZap size={11} className="text-accent" />
              </div>
              <span className="text-[11px] font-bold text-accent uppercase tracking-widest">
                Analyse IA
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">Score de confiance</span>
          </div>

          <ConfidenceBar score={ia.score_confiance} />

          {/* Summary — 2 lines clamp */}
          <p className="text-[13px] text-foreground mt-3.5 mb-3 leading-relaxed line-clamp-2">
            {ia.resume_genere}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-1.5 mb-4.5">
            {ia.mots_cles.map((kw) => (
              <span key={kw} className="text-[11px] font-medium bg-secondary text-foreground rounded px-2 py-0.5 border border-border">
                {kw}
              </span>
            ))}
          </div>

          {/* Suggestion */}
          <div className="bg-card border border-accent/25 rounded p-3.5">
            <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-3">
              Suggestion d'affectation
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
              {/* Agence suggérée */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-accent/[0.08] flex items-center justify-center shrink-0">
                  <FiHome size={15} className="text-accent" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-px">Agence suggérée</div>
                  <div className="text-[13px] font-semibold text-foreground">{agenceSuggeree?.ville || "—"}</div>
                  <div className="text-[11px] text-muted-foreground">{agenceSuggeree?.nom}</div>
                </div>
              </div>

              {/* Avocat suggéré */}
              {avocatSuggere && (
                <div className="flex items-center gap-2.5">
                  <Avatar nom={avocatSuggere.nom} size={36} />
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-px">Avocat suggéré</div>
                    <div className="text-[13px] font-semibold text-foreground">{avocatSuggere.nom}</div>
                    <div className={`text-[11px] ${chargeColor(avocatSuggere.charge_actuelle)}`}>
                      {ROLE_LABELS[avocatSuggere.role]}
                      {avocatSuggere.charge_actuelle != null && (
                        <span> · {avocatSuggere.charge_actuelle} dossier{avocatSuggere.charge_actuelle !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Justifications */}
            <div className="flex flex-col gap-1.5">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                Justification
              </div>
              {ia.justification?.map((j) => (
                <div key={j} className="flex items-start gap-1.5">
                  <FiCheckCircle size={12} className="text-accent shrink-0 mt-px" />
                  <span className="text-[12px] text-foreground leading-relaxed">{j}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* No IA */
        <div className="px-6 py-5 bg-background border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <FiAlertCircle size={15} className="text-muted-foreground" />
          </div>
          <div>
            <span className="text-[11px] font-semibold bg-secondary text-muted-foreground rounded-full px-2.5 py-0.5 inline-block mb-1">
              Non analysé
            </span>
            <p className="text-[12px] text-muted-foreground m-0 leading-relaxed">
              Ce dossier n'a pas encore fait l'objet d'une analyse automatique. L'affectation sera entièrement manuelle.
            </p>
          </div>
        </div>
      )}

      {/* Card footer — actions */}
      <div className="px-6 py-4 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/dossiers/${dossier.reference}`)}
          className="flex items-center gap-1.5 text-[13px] font-medium text-foreground bg-transparent border border-border rounded px-4 py-2.5 cursor-pointer hover:bg-secondary transition-colors min-h-[44px]"
        >
          Voir le dossier <FiChevronRight size={13} />
        </button>

        <button
          onClick={() => onAffecter(dossier)}
          className="flex items-center gap-2 text-[13px] font-semibold text-primary-foreground bg-primary border-none rounded px-5 py-2.5 cursor-pointer shadow-md hover:opacity-90 transition-all min-h-[44px]"
        >
          <FiUserCheck size={14} />
          {ia ? "Affecter" : "Affecter manuellement"}
        </button>
      </div>
    </div>
  );
}

export default function FileAffectation() {
  const [affectationTarget, setAffectationTarget] = useState(null);
  const [affectedRefs, setAffectedRefs] = useState(new Set());

  // Dossiers waiting for assignment
  const dossiersEnAttente = useMemo(() =>
    dossiers
      .filter((d) => d.statut === "en_attente" && !affectedRefs.has(d.reference))
      .sort((a, b) => b.priorite - a.priorite),
    [affectedRefs]
  );

  function handleAffecter(d) {
    setAffectationTarget(d);
  }

  function handleConfirm(agenceId, avocatId) {
    if (!affectationTarget) return;
    setAffectedRefs((prev) => new Set([...prev, affectationTarget.reference]));
    setAffectationTarget(null);
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <div className="max-w-[800px] mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between mb-7 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                <FiList size={15} className="text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground m-0">
                File d'affectation
              </h1>
            </div>
            <p className="text-[13px] text-muted-foreground m-0">
              {dossiersEnAttente.length > 0
                ? `${dossiersEnAttente.length} dossier${dossiersEnAttente.length > 1 ? "s" : ""} en attente · triés par priorité`
                : "File vide"}
            </p>
          </div>

          {dossiersEnAttente.length > 0 && (
            <div className="flex items-center gap-2 bg-status-attente-bg text-status-attente-text rounded-full px-4 py-2 shrink-0">
              <FiClock size={13} />
              <span className="text-[13px] font-semibold tabular-nums">
                {dossiersEnAttente.length} en attente
              </span>
            </div>
          )}
        </div>

        {/* Cards or empty */}
        {dossiersEnAttente.length === 0 ? (
          <EmptyState
            icon={FiCheckCircle}
            title="Aucun dossier en attente — bon travail !"
            description="Tous les dossiers reçus ont été affectés. Repassez plus tard ou consultez la liste complète des dossiers."
          />
        ) : (
          <div className="flex flex-col gap-6">
            {dossiersEnAttente.map((d) => (
              <DossierCard key={d.reference} dossier={d} onAffecter={handleAffecter} />
            ))}
          </div>
        )}
      </div>

      {/* Affectation modal */}
      {affectationTarget && (
        <AffectationModal
          dossier={affectationTarget}
          open={!!affectationTarget}
          onClose={() => setAffectationTarget(null)}
          onConfirm={(agenceId, avocatId) => handleConfirm(agenceId, avocatId)}
          initialAgenceId={affectationTarget.analyse_ia?.agence_suggeree_id}
          initialAvocatId={affectationTarget.analyse_ia?.avocat_suggere_id}
        />
      )}
    </div>
  );
}
