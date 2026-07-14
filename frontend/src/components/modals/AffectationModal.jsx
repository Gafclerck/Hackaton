import { useState, useEffect, useRef } from "react";
import { FiSearch, FiHome, FiCheck, FiAlertCircle, FiZap, FiX } from "react-icons/fi";
import { agences, utilisateurs } from "../../data/mockData";
import { ROLE_LABELS, getInitials } from "../../utils/helpers";
import StatusBadge from "../ui/StatusBadge";
import Avatar from "../ui/Avatar";

function chargeColor(n) {
  if (n === undefined) return "text-muted-foreground";
  if (n <= 3) return "text-success";
  if (n <= 5) return "text-warning";
  return "text-destructive";
}

export default function AffectationModal({ dossier, open, onClose, onConfirm, initialAgenceId, initialAvocatId }) {
  const hasIASuggestion = !!(initialAgenceId && initialAvocatId);

  const [selectedAgence, setSelectedAgence] = useState(initialAgenceId || "");
  const [selectedAvocat, setSelectedAvocat] = useState(initialAvocatId || "");
  const [agenceSearch, setAgenceSearch] = useState("");
  const [avocatSearch, setAvocatSearch] = useState("");
  const agenceSearchRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setSelectedAgence(initialAgenceId || "");
      setSelectedAvocat(initialAvocatId || "");
      setAgenceSearch("");
      setAvocatSearch("");
      setTimeout(() => agenceSearchRef.current?.focus(), 80);
    }
  }, [open, initialAgenceId, initialAvocatId]);

  if (!open) return null;

  const filteredAgences = agences.filter((a) =>
    !agenceSearch || a.nom.toLowerCase().includes(agenceSearch.toLowerCase()) || a.ville.toLowerCase().includes(agenceSearch.toLowerCase())
  );

  const avocatsDisponibles = utilisateurs
    .filter((u) => ["avocat", "chef_agence"].includes(u.role) && u.agence_id === selectedAgence)
    .filter((u) => !avocatSearch || u.nom.toLowerCase().includes(avocatSearch.toLowerCase()));

  function handleSelectAgence(id) {
    setSelectedAgence(id);
    setSelectedAvocat("");
    setAvocatSearch("");
  }

  function handleConfirm() {
    if (selectedAgence && selectedAvocat) onConfirm(selectedAgence, selectedAvocat);
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-card w-full max-w-[720px] rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-48px)] pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-5 pb-4 border-b border-border shrink-0">
            <div>
              <h2 className="text-base font-bold text-foreground m-0">Affecter le dossier</h2>
              <p className="text-xs text-muted-foreground m-0 mt-0.5">Sélectionnez une agence puis un avocat disponible</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-secondary transition-colors" aria-label="Fermer">
              <FiX size={18} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-7 py-5">

            {/* Dossier reminder */}
            <div className="bg-background border border-border rounded-lg px-4.5 py-3.5 mb-6">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-[11px] font-bold text-primary tabular-nums tracking-wide">{dossier.reference}</span>
                <StatusBadge statut={dossier.statut} />
                <span className="text-[11px] text-muted-foreground">P{dossier.priorite}</span>
              </div>
              <p className="text-sm font-semibold text-foreground m-0 mb-0.5">{dossier.titre}</p>
              <p className="text-xs text-muted-foreground m-0">{dossier.type_affaire}</p>
            </div>

            {/* IA pre-fill hint */}
            {hasIASuggestion && (
              <div className="flex items-start gap-2.5 p-3 bg-accent/[0.06] border border-accent/30 rounded mb-6">
                <FiZap size={13} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-accent">Pré-rempli selon la suggestion IA</span>
                  <span className="text-xs text-muted-foreground ml-1.5">— modifiable librement avant confirmation.</span>
                </div>
              </div>
            )}

            {/* Agence selector */}
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-foreground mb-2">
                Agence assignée <span className="text-destructive">*</span>
              </label>

              <div className="relative mb-2">
                <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  ref={agenceSearchRef}
                  type="text"
                  value={agenceSearch}
                  onChange={(e) => setAgenceSearch(e.target.value)}
                  placeholder="Rechercher une agence…"
                  className="w-full h-10 pl-9 pr-3 border border-border rounded text-sm bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                {filteredAgences.length === 0 && (
                  <p className="text-[13px] text-muted-foreground py-2 m-0">Aucune agence trouvée.</p>
                )}
                {filteredAgences.map((a) => {
                  const isSelected = a.id === selectedAgence;
                  return (
                    <button
                      key={a.id}
                      onClick={() => handleSelectAgence(a.id)}
                      className={`flex items-center gap-3 p-3 rounded border text-left transition-all min-h-[44px] ${
                        isSelected
                          ? "border-primary bg-primary/7"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-[34px] h-[34px] rounded flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-primary/10" : "bg-secondary"
                      }`}>
                        <FiHome size={15} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-foreground leading-tight">{a.nom}</div>
                        <div className="text-[11px] text-muted-foreground">{a.ville}{a.est_siege ? " · Siège" : ""}</div>
                      </div>
                      {isSelected && <FiCheck size={16} className="text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avocat selector */}
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">
                Avocat assigné <span className="text-destructive">*</span>
              </label>

              {!selectedAgence ? (
                <div className="flex items-center gap-2 p-3.5 bg-background border border-dashed border-border rounded">
                  <FiAlertCircle size={14} className="text-muted-foreground" />
                  <p className="text-[13px] text-muted-foreground m-0">Sélectionnez d'abord une agence pour voir les avocats disponibles.</p>
                </div>
              ) : (
                <>
                  <div className="relative mb-2">
                    <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={avocatSearch}
                      onChange={(e) => setAvocatSearch(e.target.value)}
                      placeholder="Rechercher un avocat…"
                      className="w-full h-10 pl-9 pr-3 border border-border rounded text-sm bg-card text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {avocatsDisponibles.length === 0 && (
                      <p className="text-[13px] text-muted-foreground py-2 m-0">
                        {avocatSearch ? "Aucun avocat trouvé." : "Aucun avocat disponible dans cette agence."}
                      </p>
                    )}
                    {avocatsDisponibles.map((u) => {
                      const isSelected = u.id === selectedAvocat;
                      const charge = u.charge_actuelle;
                      return (
                        <button
                          key={u.id}
                          onClick={() => setSelectedAvocat(u.id)}
                          className={`flex items-center gap-3 p-3 rounded border text-left transition-all min-h-[44px] ${
                            isSelected
                              ? "border-primary bg-primary/7"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <Avatar nom={u.nom} size={34} />
                          <div className="flex-1">
                            <div className="text-[13px] font-medium text-foreground leading-tight">{u.nom}</div>
                            <div className="text-[11px] text-muted-foreground">{ROLE_LABELS[u.role]}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className={`text-[11px] font-semibold tabular-nums ${chargeColor(charge)}`}>
                              {charge != null ? `${charge} dossier${charge !== 1 ? "s" : ""}` : "—"}
                            </div>
                            <div className="text-[10px] text-muted-foreground">en cours</div>
                          </div>
                          {isSelected && <FiCheck size={16} className="text-primary shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-7 py-4 border-t border-border shrink-0">
            <button
              onClick={onClose}
              className="h-[42px] px-5 border border-border rounded text-sm text-muted-foreground bg-transparent cursor-pointer hover:border-foreground hover:text-foreground transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAgence || !selectedAvocat}
              className={`h-[42px] px-6 rounded text-sm font-semibold border-none transition-all ${
                selectedAgence && selectedAvocat
                  ? "bg-primary text-primary-foreground cursor-pointer hover:bg-sidebar-accent"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Confirmer l'affectation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
