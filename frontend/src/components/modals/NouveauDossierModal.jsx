import { useState, useRef, useEffect } from "react";
import {
  FiX, FiSearch, FiCheck, FiChevronRight, FiChevronLeft,
  FiUser, FiHome, FiFileText, FiList, FiPlus, FiAlertCircle,
} from "react-icons/fi";
import { clients, TYPES_AFFAIRE } from "../../data/mockData";

const STEPS = [
  { label: "Client", icon: FiUser },
  { label: "Dossier", icon: FiFileText },
  { label: "Récapitulatif", icon: FiList },
];

const PRIO_LABELS = { 1: "Très basse", 2: "Basse", 3: "Normale", 4: "Haute", 5: "Très haute" };
const PRIO_COLORS = { 1: "text-muted-foreground", 2: "text-muted-foreground", 3: "text-warning", 4: "text-[#D97706]", 5: "text-destructive" };
const PRIO_BORDER = { 1: "border-border", 2: "border-border", 3: "border-warning", 4: "border-[#D97706]", 5: "border-destructive" };
const PRIO_BG = { 1: "", 2: "", 3: "bg-warning/10", 4: "bg-[#D97706]/10", 5: "bg-destructive/10" };

function StepHeader({ current }) {
  return (
    <div className="flex items-center px-2">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = step.icon;
        return (
          <div key={i} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
                done ? "bg-success text-primary-foreground"
                : active ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
              }`}>
                {done ? <FiCheck size={14} /> : <Icon size={14} />}
              </div>
              <span className={`text-[11px] whitespace-nowrap ${
                active ? "text-primary font-semibold"
                : done ? "text-success font-medium"
                : "text-muted-foreground"
              }`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 self-start mt-[15px] ${
                done ? "bg-success" : "bg-border"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] font-medium text-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-muted-foreground m-0">{hint}</p>}
      {error && (
        <div className="flex items-center gap-1 text-destructive">
          <FiAlertCircle size={11} />
          <span className="text-[11px]">{error}</span>
        </div>
      )}
    </div>
  );
}

function PrioSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 h-10 rounded border-2 flex items-center justify-center cursor-pointer transition-all outline-none ${
              value === n
                ? `${PRIO_BORDER[n]} ${PRIO_BG[n]}`
                : "border-border bg-card"
            }`}
          >
            <span className={`text-base font-bold ${value === n ? PRIO_COLORS[n] : "text-muted-foreground"}`}>
              {n}
            </span>
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className={`text-xs font-medium m-0 ${PRIO_COLORS[value]}`}>
          {PRIO_LABELS[value]}
        </p>
      )}
    </div>
  );
}

function SummaryCard({ title, icon: Icon, children }) {
  return (
    <div className="border border-border rounded overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary border-b border-border">
        <Icon size={13} className="text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</span>
      </div>
      <div className="px-4 py-3.5">{children}</div>
    </div>
  );
}

function SRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="mb-2">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium m-0 mb-0.5">{label}</p>
      <p className="text-[13px] text-foreground font-medium m-0">{value}</p>
    </div>
  );
}

export default function NouveauDossierModal({ open, onClose, onCreated }) {
  const [step, setStep] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newClient, setNewClient] = useState({ type: "PHYSIQUE", nom: "", nin: "", rccm: "" });
  const [touched1, setTouched1] = useState({});
  const [dossier, setDossier] = useState({ titre: "", typeAffaire: "", description: "", priorite: 3 });
  const [touched2, setTouched2] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectFocused, setSelectFocused] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setStep(0); setSearchVal(""); setSearchOpen(false);
      setSelectedClient(null); setCreatingNew(false);
      setNewClient({ type: "PHYSIQUE", nom: "", nin: "", rccm: "" });
      setTouched1({}); setDossier({ titre: "", typeAffaire: "", description: "", priorite: 3 });
      setTouched2({}); setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setSearchOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!open) return null;

  const filteredClients = clients.filter((c) =>
    searchVal.length >= 1 && c.nom.toLowerCase().includes(searchVal.toLowerCase())
  );

  function clientSub(c) {
    return c.type_client === "PHYSIQUE" ? `Personne physique${c.nin ? ` · NIN ${c.nin}` : ""}` : `Personne morale${c.rccm ? ` · RCCM ${c.rccm}` : ""}`;
  }

  function selectClient(c) { setSelectedClient(c); setSearchVal(c.nom); setSearchOpen(false); setCreatingNew(false); }
  function clearClient() { setSelectedClient(null); setSearchVal(""); setCreatingNew(false); }

  const ncErrors = {};
  if (creatingNew && !newClient.nom.trim()) ncErrors.nom = newClient.type === "PHYSIQUE" ? "Nom complet requis" : "Raison sociale requise";
  if (creatingNew && newClient.type === "MORALE" && !newClient.rccm.trim()) ncErrors.rccm = "RCCM requis";

  const step1Valid = creatingNew ? Object.keys(ncErrors).length === 0 : selectedClient !== null;
  const step2Valid = dossier.titre.trim().length > 0 && dossier.typeAffaire !== "" && dossier.priorite > 0;

  function nc(field) { return (e) => setNewClient((p) => ({ ...p, [field]: e.target.value })); }
  function t1(field) { setTouched1((p) => ({ ...p, [field]: true })); }
  function t2(field) { setTouched2((p) => ({ ...p, [field]: true })); }

  function next() {
    if (step === 0) { if (creatingNew) setTouched1({ nom: true, rccm: true }); if (!step1Valid) return; }
    if (step === 1) { setTouched2({ titre: true, typeAffaire: true }); if (!step2Valid) return; }
    setStep((s) => s + 1);
  }

  function submit() {
    setSubmitting(true);
    const ref = `DOS-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
    setTimeout(() => { onCreated(ref); onClose(); }, 900);
  }

  const clientLabel = creatingNew ? newClient.nom : (selectedClient?.nom || "");
  const clientType = (creatingNew ? newClient.type : selectedClient?.type_client) === "PHYSIQUE" ? "Personne physique" : "Personne morale";

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-card w-full max-w-[680px] rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
            <div>
              <h2 className="text-base font-bold text-foreground m-0">Nouveau dossier</h2>
              <p className="text-xs text-muted-foreground m-0 mt-px">Étape {step + 1} sur {STEPS.length} — {STEPS[step].label}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-secondary transition-colors" aria-label="Fermer">
              <FiX size={18} />
            </button>
          </div>

          {/* Stepper */}
          <div className="px-6 pt-5 pb-0 shrink-0">
            <StepHeader current={step} />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">

            {/* STEP 0: Client */}
            {step === 0 && (
              <div className="flex flex-col gap-4">
                {!creatingNew && (
                  <>
                    <Field label="Rechercher un client existant" required>
                      <div className="relative" ref={dropdownRef}>
                        <div className="relative">
                          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          <input
                            ref={searchRef}
                            type="text"
                            placeholder="Nom, raison sociale…"
                            value={searchVal}
                            onChange={(e) => { setSearchVal(e.target.value); setSelectedClient(null); setSearchOpen(e.target.value.length >= 1); }}
                            onFocus={() => { if (searchVal.length >= 1) setSearchOpen(true); }}
                            className={`w-full h-10 pl-9 pr-3 rounded text-sm bg-card text-foreground outline-none border-[1.5px] transition-all ${
                              searchOpen || selectedClient ? "border-ring ring-2 ring-primary/10" : "border-border"
                            } ${selectedClient ? "pr-9" : ""}`}
                          />
                          {selectedClient && (
                            <button onClick={clearClient} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground bg-transparent border-none cursor-pointer p-0.5 flex">
                              <FiX size={14} />
                            </button>
                          )}
                        </div>
                        {searchOpen && filteredClients.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg z-10 overflow-hidden max-h-56 overflow-y-auto">
                            {filteredClients.map((c) => (
                              <button
                                key={c.id}
                                onMouseDown={() => selectClient(c)}
                                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 border-none bg-transparent cursor-pointer hover:bg-background transition-colors border-b border-border last:border-b-0"
                              >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                  c.type_client === "PHYSIQUE" ? "bg-blue-100" : "bg-purple-100"
                                }`}>
                                  {c.type_client === "PHYSIQUE"
                                    ? <FiUser size={12} className="text-primary" />
                                    : <FiHome size={12} className="text-purple-700" />
                                  }
                                </div>
                                <div>
                                  <div className="text-[13px] font-medium text-foreground">{c.nom}</div>
                                  <div className="text-[11px] text-muted-foreground">{clientSub(c)}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchOpen && searchVal.length >= 1 && filteredClients.length === 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg z-10 px-3.5 py-3">
                            <p className="text-[13px] text-muted-foreground m-0">Aucun client trouvé pour « {searchVal} »</p>
                          </div>
                        )}
                      </div>
                    </Field>

                    {selectedClient && (
                      <div className="flex items-center gap-3 p-3.5 rounded border-[1.5px] border-primary bg-primary/7">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          selectedClient.type_client === "PHYSIQUE" ? "bg-blue-100" : "bg-purple-100"
                        }`}>
                          {selectedClient.type_client === "PHYSIQUE"
                            ? <FiUser size={15} className="text-primary" />
                            : <FiHome size={15} className="text-purple-700" />
                          }
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-primary">{clientLabel}</div>
                          <div className="text-xs text-muted-foreground">{clientSub(selectedClient)}</div>
                        </div>
                        <FiCheck size={16} className="text-primary" />
                      </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">ou</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <button
                      onClick={() => { setCreatingNew(true); setSelectedClient(null); setSearchVal(""); }}
                      className="flex items-center justify-center gap-2 h-10 border border-dashed border-border rounded bg-transparent cursor-pointer text-[13px] text-primary font-medium transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <FiPlus size={14} />Créer un nouveau client
                    </button>
                  </>
                )}

                {creatingNew && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-foreground m-0">Nouveau client</p>
                      <button onClick={() => setCreatingNew(false)} className="bg-transparent border-none cursor-pointer text-xs text-muted-foreground flex items-center gap-1">
                        <FiX size={12} />Annuler
                      </button>
                    </div>

                    <Field label="Type de client" required>
                      <div className="flex gap-2">
                        {["PHYSIQUE", "MORALE"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewClient((p) => ({ ...p, type: t }))}
                            className={`flex-1 h-10 flex items-center justify-center gap-2 rounded border-[1.5px] cursor-pointer text-[13px] font-medium transition-all ${
                              newClient.type === t
                                ? "border-primary bg-primary/7 text-primary"
                                : "border-border bg-card text-muted-foreground"
                            }`}
                          >
                            {t === "PHYSIQUE" ? <FiUser size={14} /> : <FiHome size={14} />}
                            {t === "PHYSIQUE" ? "Personne physique" : "Personne morale"}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label={newClient.type === "PHYSIQUE" ? "Nom complet" : "Raison sociale"} required error={touched1.nom ? ncErrors.nom : undefined}>
                      <input
                        type="text"
                        value={newClient.nom}
                        onChange={nc("nom")}
                        onBlur={() => t1("nom")}
                        placeholder={newClient.type === "PHYSIQUE" ? "Prénom Nom" : "Ma Société SARL"}
                        className={`w-full h-10 px-3 rounded text-sm bg-card text-foreground outline-none border-[1.5px] transition-all ${
                          touched1.nom && ncErrors.nom ? "border-destructive ring-2 ring-destructive/10" : "border-border focus:border-ring focus:ring-2 focus:ring-primary/10"
                        }`}
                      />
                    </Field>

                    {newClient.type === "PHYSIQUE" && (
                      <Field label="NIN" hint="Numéro d'Identification National (optionnel)">
                        <input
                          type="text"
                          value={newClient.nin}
                          onChange={nc("nin")}
                          placeholder="1234567890123"
                          className="w-full h-10 px-3 rounded text-sm bg-card text-foreground outline-none border-[1.5px] border-border focus:border-ring focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </Field>
                    )}

                    {newClient.type === "MORALE" && (
                      <Field label="RCCM" required error={touched1.rccm ? ncErrors.rccm : undefined}>
                        <input
                          type="text"
                          value={newClient.rccm}
                          onChange={nc("rccm")}
                          onBlur={() => t1("rccm")}
                          placeholder="SN-DKR-2024-B-XXXXX"
                          className={`w-full h-10 px-3 rounded text-sm bg-card text-foreground outline-none border-[1.5px] transition-all ${
                            touched1.rccm && ncErrors.rccm ? "border-destructive ring-2 ring-destructive/10" : "border-border focus:border-ring focus:ring-2 focus:ring-primary/10"
                          }`}
                        />
                      </Field>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 1: Dossier */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <Field label="Titre du dossier" required error={touched2.titre && !dossier.titre.trim() ? "Titre requis" : undefined}>
                  <input
                    type="text"
                    value={dossier.titre}
                    onChange={(e) => setDossier((p) => ({ ...p, titre: e.target.value }))}
                    onBlur={() => t2("titre")}
                    placeholder="Ex. : Litige contractuel SENEGAL BTP"
                    className={`w-full h-10 px-3 rounded text-sm bg-card text-foreground outline-none border-[1.5px] transition-all ${
                      touched2.titre && !dossier.titre.trim() ? "border-destructive ring-2 ring-destructive/10" : "border-border focus:border-ring focus:ring-2 focus:ring-primary/10"
                    }`}
                  />
                </Field>

                <Field label="Type d'affaire" required error={touched2.typeAffaire && !dossier.typeAffaire ? "Type d'affaire requis" : undefined}>
                  <div className="relative">
                    <select
                      value={dossier.typeAffaire}
                      onChange={(e) => { setDossier((p) => ({ ...p, typeAffaire: e.target.value })); t2("typeAffaire"); }}
                      onFocus={() => setSelectFocused(true)}
                      onBlur={() => { setSelectFocused(false); t2("typeAffaire"); }}
                      className={`w-full h-10 px-3 pr-8 appearance-none rounded text-sm bg-card text-foreground outline-none border-[1.5px] cursor-pointer transition-all ${
                        touched2.typeAffaire && !dossier.typeAffaire ? "border-destructive ring-2 ring-destructive/10"
                        : selectFocused ? "border-ring ring-2 ring-primary/10"
                        : "border-border"
                      }`}
                    >
                      <option value="">Sélectionner…</option>
                      {TYPES_AFFAIRE.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <FiChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-muted-foreground" />
                  </div>
                </Field>

                <Field label="Description initiale" hint="Facultatif — résumé des faits, pièces disponibles…">
                  <textarea
                    value={dossier.description}
                    onChange={(e) => setDossier((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Décrivez brièvement la situation…"
                    rows={4}
                    className="w-full px-3 py-2.5 rounded text-sm bg-card text-foreground outline-none border-[1.5px] border-border focus:border-ring focus:ring-2 focus:ring-primary/10 transition-all resize-y min-h-[88px] leading-relaxed"
                  />
                </Field>

                <Field label="Priorité" required hint={`Niveau sélectionné : ${PRIO_LABELS[dossier.priorite]}`}>
                  <PrioSelector value={dossier.priorite} onChange={(v) => setDossier((p) => ({ ...p, priorite: v }))} />
                </Field>
              </div>
            )}

            {/* STEP 2: Récapitulatif */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <p className="text-[13px] text-muted-foreground m-0 leading-relaxed">
                  Vérifiez les informations avant de créer le dossier. Il sera placé en statut <strong className="text-foreground">Nouveau</strong> et soumis à l'analyse IA.
                </p>

                <SummaryCard title="Client" icon={FiUser}>
                  <SRow label="Nom / Raison sociale" value={clientLabel} />
                  <SRow label="Type" value={clientType} />
                  {selectedClient?.nin && <SRow label="NIN" value={selectedClient.nin} />}
                  {selectedClient?.rccm && <SRow label="RCCM" value={selectedClient.rccm} />}
                  {creatingNew && newClient.nin && <SRow label="NIN" value={newClient.nin} />}
                  {creatingNew && newClient.rccm && <SRow label="RCCM" value={newClient.rccm} />}
                </SummaryCard>

                <SummaryCard title="Dossier" icon={FiFileText}>
                  <SRow label="Titre" value={dossier.titre} />
                  <SRow label="Type d'affaire" value={dossier.typeAffaire} />
                  <div className="mb-2">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium m-0 mb-0.5">Priorité</p>
                    <p className={`text-[13px] font-semibold m-0 ${PRIO_COLORS[dossier.priorite]}`}>
                      {dossier.priorite} — {PRIO_LABELS[dossier.priorite]}
                    </p>
                  </div>
                  {dossier.description && <SRow label="Description" value={dossier.description} />}
                </SummaryCard>

                <div className="flex gap-2.5 items-start p-3 bg-accent/7 border border-accent/28 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground m-0 leading-relaxed">
                    Une analyse IA sera déclenchée après la création. La suggestion reste soumise à <strong className="text-foreground">validation humaine explicite</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
            <div>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  disabled={submitting}
                  className="flex items-center gap-1.5 h-10 px-4 border border-border rounded bg-transparent cursor-pointer text-[13px] text-muted-foreground hover:border-primary transition-all"
                >
                  <FiChevronLeft size={14} />Précédent
                </button>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={onClose}
                className="h-10 px-4 border-none rounded bg-transparent cursor-pointer text-[13px] text-muted-foreground"
              >
                Annuler
              </button>
              {step < 2 ? (
                <button
                  onClick={next}
                  disabled={step === 0 ? !step1Valid : !step2Valid}
                  className={`flex items-center gap-1.5 h-10 px-5 rounded border-none text-[13px] font-semibold transition-all ${
                    (step === 0 ? !step1Valid : !step2Valid)
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
                  }`}
                >
                  Suivant<FiChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={submitting}
                  className={`flex items-center gap-1.5 h-10 px-5 rounded border-none text-[13px] font-semibold transition-all ${
                    submitting
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
                  }`}
                >
                  {submitting ? "Création…" : "Créer le dossier"}{!submitting && <FiCheck size={14} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
