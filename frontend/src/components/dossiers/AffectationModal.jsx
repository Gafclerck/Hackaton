import { useState, useMemo, useEffect } from "react";
import { Search, Building2, MapPin, Briefcase, UserCheck, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { cn } from "../../lib/utils";
import { ROLE_LABELS, STATUT_LABELS, STATUT_STYLES } from "../../lib/constants";
import { useAgences } from "../../hooks/useAgences";
import { agenceService } from "../../services/agenceService";
import { dossierService } from "../../services/dossierService";

function DossierReminder({ dossier }) {
  const statutStyle = STATUT_STYLES[dossier.statut] || STATUT_STYLES.en_attente;
  return (
    <div className="rounded-lg border border-border bg-background p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">{dossier.reference}</span>
        <span className={cn("text-[11px] font-semibold rounded-full px-2 py-0.5", statutStyle.bg, statutStyle.text)}>
          {STATUT_LABELS[dossier.statut]}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground line-clamp-2">{dossier.titre}</p>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-[10px]">{dossier.type_affaire_libelle}</Badge>
        <span className="text-[11px] text-muted-foreground">P{dossier.priorite}</span>
      </div>
    </div>
  );
}

export default function AffectationModal({ dossier, open, onClose, onConfirm, initialAgenceId, initialAvocatId }) {
  // Using a resetKey to force state remount when open toggles true,
  // avoiding setState-in-effect lint warnings while still resetting.
  const [resetKey, setResetKey] = useState(0);

  function handleOpenChange(v) {
    if (!v) {
      onClose();
    } else {
      setResetKey((k) => k + 1);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        {open && (
          <AffectationBody
            key={resetKey}
            dossier={dossier}
            onClose={onClose}
            onConfirm={onConfirm}
            initialAgenceId={initialAgenceId}
            initialAvocatId={initialAvocatId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AffectationBody({ dossier, onClose, onConfirm, initialAgenceId, initialAvocatId }) {
  const { data: agences = [] } = useAgences();
  const [selectedAgence, setSelectedAgence] = useState(initialAgenceId || null);
  const [selectedAvocat, setSelectedAvocat] = useState(initialAvocatId || null);
  const [agenceSearch, setAgenceSearch] = useState("");
  const [avocatSearch, setAvocatSearch] = useState("");
  const [agenceUsers, setAgenceUsers] = useState([]);

  const hasIASuggestion = Boolean(initialAgenceId || initialAvocatId);

  useEffect(() => {
    if (!selectedAgence) { setAgenceUsers([]); return; }
    let cancelled = false;
    agenceService.getUsers(selectedAgence)
      .then((users) => { if (!cancelled) setAgenceUsers(users); })
      .catch(() => { if (!cancelled) setAgenceUsers([]); });
    return () => { cancelled = true; };
  }, [selectedAgence]);

  const filteredAgences = useMemo(() => {
    if (!agenceSearch) return agences;
    const q = agenceSearch.toLowerCase();
    return agences.filter(
      (a) => a.nom.toLowerCase().includes(q) || a.ville.toLowerCase().includes(q)
    );
  }, [agences, agenceSearch]);

  const avocatsForAgence = useMemo(() => {
    const filtered = agenceUsers.filter(
      (u) => ["avocat", "chef_agence"].includes(u.role)
    );
    if (!avocatSearch) return filtered;
    const q = avocatSearch.toLowerCase();
    return filtered.filter(
      (u) => u.nom.toLowerCase().includes(q) || u.prenom.toLowerCase().includes(q)
    );
  }, [agenceUsers, avocatSearch]);

  const [submitting, setSubmitting] = useState(false);

  const canConfirm = selectedAgence && selectedAvocat && !submitting;

  async function handleConfirm() {
    if (!canConfirm || !dossier) return;
    setSubmitting(true);
    try {
      await dossierService.affecter(dossier.id, {
        agence_assigne_id: selectedAgence,
        avocat_assigne_id: selectedAvocat,
      });
      onConfirm(selectedAgence, selectedAvocat);
    } catch (err) {
      console.error("Erreur affectation:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Affecter le dossier</DialogTitle>
      </DialogHeader>

      <div className="px-6 py-4 space-y-5 overflow-y-auto max-h-[60vh]">
        {/* Dossier reminder */}
        {dossier && <DossierReminder dossier={dossier} />}

        {/* IA suggestion banner */}
        {hasIASuggestion && (
          <div className="flex items-center gap-2 rounded-md bg-accent/10 border border-accent/30 px-3 py-2">
            <Sparkles size={14} className="text-accent shrink-0" />
            <span className="text-xs text-accent font-medium">
              Pre-rempli selon la suggestion IA
            </span>
          </div>
        )}

        {/* Agency selector */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Agence
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une agence..."
              value={agenceSearch}
              onChange={(e) => setAgenceSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {filteredAgences.map((agence) => (
              <button
                key={agence.id}
                onClick={() => { setSelectedAgence(agence.id); setSelectedAvocat(null); }}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                  selectedAgence === agence.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-secondary"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md",
                  selectedAgence === agence.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}>
                  <Building2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{agence.nom}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin size={10} className="text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{agence.ville}</span>
                  </div>
                </div>
                {agence.est_siege && (
                  <Badge variant="info" className="text-[9px] shrink-0">Siege</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Avocat selector */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Avocat
          </label>
          {selectedAgence ? (
            <>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un avocat..."
                  value={avocatSearch}
                  onChange={(e) => setAvocatSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {avocatsForAgence.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-3">
                    Aucun avocat disponible
                  </p>
                ) : (
                  avocatsForAgence.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setSelectedAvocat(u.id)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                        selectedAvocat === u.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-secondary"
                      )}
                    >
                      <Avatar nom={u.nom} size={32} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {u.prenom} {u.nom}
                        </p>
                        <span className="text-[11px] text-muted-foreground">
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      </div>
                      {u.charge_actuelle != null && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Briefcase size={10} className="text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">{u.charge_actuelle}</span>
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border py-8">
              <p className="text-xs text-muted-foreground">
                Selectionnez d'abord une agence
              </p>
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={handleConfirm} disabled={!canConfirm}>
          <UserCheck size={14} />
            Confirmer
        </Button>
      </DialogFooter>
    </>
  );
}
