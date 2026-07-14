import { useState, useMemo } from "react";
import { Search, Check, ChevronRight, ChevronLeft, User, FileText, ClipboardList, Plus, Building2, UserCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { cn, generateReference } from "../../lib/utils";
import { TYPES_AFFAIRE, PRIORITE_LABELS, TYPE_CLIENT_LABELS } from "../../lib/constants";
import { clients } from "../../data/mockData";

/* ── Step indicator ─────────────────────────────────────────────────────────── */
function StepIndicator({ currentStep }) {
  const steps = [
    { label: "Client", icon: User },
    { label: "Dossier", icon: FileText },
    { label: "Recapitulatif", icon: ClipboardList },
  ];

  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {steps.map((s, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        const Icon = s.icon;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors text-xs font-semibold",
                done ? "bg-success border-success text-success-foreground"
                  : active ? "bg-primary border-primary text-primary-foreground"
                    : "bg-secondary border-border text-muted-foreground"
              )}>
                {done ? <Check size={14} /> : <Icon size={14} />}
              </div>
              <span className={cn("text-[10px] font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-12 h-0.5 mx-1 mb-4",
                i < currentStep ? "bg-success" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Step 0: Client ─────────────────────────────────────────────────────────── */
function StepClient({ selectedClientId, setSelectedClientId, creatingNew, setCreatingNew, newClient, setNewClient }) {
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    if (!search) return clients;
    const q = search.toLowerCase();
    return clients.filter((c) => c.nom.toLowerCase().includes(q));
  }, [search]);

  function updateNewClient(field, value) {
    setNewClient((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-4">
      {/* Search existing client */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Client existant
        </label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="space-y-1 max-h-36 overflow-y-auto">
          {filteredClients.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelectedClientId(c.id); setCreatingNew(false); }}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                selectedClientId === c.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-secondary"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md",
                selectedClientId === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                {c.type_client === "MORALE" ? <Building2 size={14} /> : <UserCircle size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.nom}</p>
                <span className="text-[11px] text-muted-foreground">{TYPE_CLIENT_LABELS[c.type_client]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted-foreground font-medium">ou</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Create new client */}
      <div className="space-y-3">
        {!creatingNew ? (
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setCreatingNew(true)}
          >
            <Plus size={14} />
            Creer un nouveau client
          </Button>
        ) : (
          <div className="rounded-lg border border-border bg-background p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">Nouveau client</span>
              <button
                onClick={() => setCreatingNew(false)}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Annuler
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2">
              {["PHYSIQUE", "MORALE"].map((t) => (
                <button
                  key={t}
                  onClick={() => updateNewClient("type_client", t)}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                    newClient.type_client === t
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {TYPE_CLIENT_LABELS[t]}
                </button>
              ))}
            </div>

            {/* Nom */}
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">
                {newClient.type_client === "MORALE" ? "Raison sociale" : "Nom complet"} *
              </label>
              <Input
                value={newClient.nom}
                onChange={(e) => updateNewClient("nom", e.target.value)}
                placeholder={newClient.type_client === "MORALE" ? "Raison sociale" : "Nom et prenom"}
                className="h-9 text-xs"
              />
            </div>

            {/* NIN for PHYSIQUE */}
            {newClient.type_client === "PHYSIQUE" && (
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">NIN (optionnel)</label>
                <Input
                  value={newClient.nin}
                  onChange={(e) => updateNewClient("nin", e.target.value)}
                  placeholder="Numero d'identification nationale"
                  className="h-9 text-xs"
                />
              </div>
            )}

            {/* RCCM for MORALE */}
            {newClient.type_client === "MORALE" && (
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">RCCM *</label>
                <Input
                  value={newClient.rccm}
                  onChange={(e) => updateNewClient("rccm", e.target.value)}
                  placeholder="Registre du Commerce et du Credit Mobilier"
                  className="h-9 text-xs"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Step 1: Dossier ────────────────────────────────────────────────────────── */
function StepDossier({ dossier, setDossier }) {
  function update(field, value) {
    setDossier((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-4">
      {/* Titre */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Titre *
        </label>
        <Input
          value={dossier.titre}
          onChange={(e) => update("titre", e.target.value)}
          placeholder="Titre du dossier"
          className="text-sm"
        />
      </div>

      {/* Type d'affaire */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Type d'affaire *
        </label>
        <select
          value={dossier.type_affaire}
          onChange={(e) => update("type_affaire", e.target.value)}
          className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          <option value="">Selectionner un type</option>
          {TYPES_AFFAIRE.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Description
        </label>
        <Textarea
          value={dossier.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Description du dossier (optionnel)"
          rows={3}
          className="text-sm"
        />
      </div>

      {/* Priorite */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Priorite
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((p) => {
            const isSelected = dossier.priorite === p;
            const colorClass = p <= 2
              ? "border-border text-muted-foreground"
              : p === 3
                ? "border-warning text-warning"
                : p === 4
                  ? "border-amber-600 text-amber-600"
                  : "border-destructive text-destructive";
            const selectedBg = p <= 2
              ? "bg-secondary"
              : p === 3
                ? "bg-warning/10"
                : p === 4
                  ? "bg-amber-600/10"
                  : "bg-destructive/10";
            return (
              <button
                key={p}
                onClick={() => update("priorite", p)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 rounded-md border-2 py-2 transition-colors",
                  isSelected ? cn(colorClass, selectedBg) : "border-border text-muted-foreground hover:bg-secondary"
                )}
              >
                <span className="text-sm font-bold">P{p}</span>
                <span className="text-[9px] leading-tight">{PRIORITE_LABELS[p]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Recap ──────────────────────────────────────────────────────────── */
function StepRecap({ selectedClientId, creatingNew, newClient, dossier }) {
  const client = creatingNew ? newClient : clients.find((c) => c.id === selectedClientId);

  return (
    <div className="space-y-4">
      {/* Client card */}
      <div className="rounded-lg border border-border bg-background p-4 space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</h4>
        {client ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{client.nom}</p>
            {client.type_client && (
              <Badge variant="secondary" className="text-[10px]">{TYPE_CLIENT_LABELS[client.type_client]}</Badge>
            )}
            {client.nin && <p className="text-[11px] text-muted-foreground">NIN: {client.nin}</p>}
            {client.rccm && <p className="text-[11px] text-muted-foreground">RCCM: {client.rccm}</p>}
            {client.email && <p className="text-[11px] text-muted-foreground">{client.email}</p>}
            {client.telephone && <p className="text-[11px] text-muted-foreground">{client.telephone}</p>}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Aucun client selectionne</p>
        )}
      </div>

      {/* Dossier card */}
      <div className="rounded-lg border border-border bg-background p-4 space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dossier</h4>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{dossier.titre}</p>
          {dossier.type_affaire && <Badge variant="secondary" className="text-[10px]">{dossier.type_affaire}</Badge>}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Priorite:</span>
            <Badge
              variant={dossier.priorite <= 2 ? "secondary" : dossier.priorite === 3 ? "warning" : "destructive"}
              className="text-[10px]"
            >
              P{dossier.priorite} - {PRIORITE_LABELS[dossier.priorite]}
            </Badge>
          </div>
          {dossier.description && (
            <p className="text-xs text-muted-foreground mt-1">{dossier.description}</p>
          )}
        </div>
      </div>

      {/* IA info note */}
      <div className="rounded-md bg-accent/10 border border-accent/30 px-3 py-2">
        <p className="text-[11px] text-accent font-medium">
          Analyse IA sera declenchee apres creation
        </p>
      </div>
    </div>
  );
}

/* ── Main modal ─────────────────────────────────────────────────────────────── */
export default function NouveauDossierModal({ open, onClose, onCreated }) {
  const [step, setStep] = useState(0);

  // Client state
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newClient, setNewClient] = useState({
    type_client: "PHYSIQUE",
    nom: "",
    nin: "",
    rccm: "",
  });

  // Dossier state
  const [dossier, setDossier] = useState({
    titre: "",
    type_affaire: "",
    description: "",
    priorite: 3,
  });

  function resetState() {
    setStep(0);
    setSelectedClientId(null);
    setCreatingNew(false);
    setNewClient({ type_client: "PHYSIQUE", nom: "", nin: "", rccm: "" });
    setDossier({ titre: "", type_affaire: "", description: "", priorite: 3 });
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function handleNext() {
    if (step < 2) setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleCreate() {
    const ref = generateReference();
    resetState();
    onCreated(ref);
  }

  const step0Valid = selectedClientId || (creatingNew && newClient.nom && (newClient.type_client === "PHYSIQUE" || newClient.rccm));
  const step1Valid = dossier.titre && dossier.type_affaire;
  const canNext = step === 0 ? step0Valid : step === 1 ? step1Valid : true;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouveau dossier</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-2 space-y-4 overflow-y-auto max-h-[60vh]">
          <StepIndicator currentStep={step} />

          {step === 0 && (
            <StepClient
              selectedClientId={selectedClientId}
              setSelectedClientId={setSelectedClientId}
              creatingNew={creatingNew}
              setCreatingNew={setCreatingNew}
              newClient={newClient}
              setNewClient={setNewClient}
            />
          )}
          {step === 1 && (
            <StepDossier dossier={dossier} setDossier={setDossier} />
          )}
          {step === 2 && (
            <StepRecap
              selectedClientId={selectedClientId}
              creatingNew={creatingNew}
              newClient={newClient}
              dossier={dossier}
            />
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div>
              {step > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft size={14} />
                  Precedent
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              {step < 2 ? (
                <Button onClick={handleNext} disabled={!canNext}>
                  Suivant
                  <ChevronRight size={14} />
                </Button>
              ) : (
                <Button onClick={handleCreate}>
                  <Check size={14} />
                  Creer le dossier
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
