import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/Dialog"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { generateReference } from "../../lib/utils"
import { STATUT_LABELS } from "../../lib/constants"
import { clients, agences, typesAffaire, specialites } from "../../data/mockData"
import { CheckCircle2, FileText, User, Building2 } from "lucide-react"

const priorites = [
  { value: "basse", label: "Basse" },
  { value: "moyenne", label: "Moyenne" },
  { value: "haute", label: "Haute" },
]

const steps = ["Informations", "Client & Agence", "Confirmation"]

export default function NouveauDossierModal({ open, onClose, onSave }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    titre: "",
    description: "",
    type_affaire_id: "",
    specialite_id: "",
    priorite: "moyenne",
    client_id: "",
    agence_id: "",
    date_echeance: "",
  })

  const filteredSpecialites = useMemo(
    () => specialites.filter((s) => String(s.type_affaire_id) === form.type_affaire_id),
    [form.type_affaire_id]
  )

  const selectedClient = clients.find((c) => String(c.id) === form.client_id)
  const selectedType = typesAffaire.find((t) => String(t.id) === form.type_affaire_id)
  const selectedSpecialite = specialites.find((s) => String(s.id) === form.specialite_id)
  const selectedAgence = agences.find((a) => String(a.id) === form.agence_id)

  const handleChange = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === "type_affaire_id") next.specialite_id = ""
      return next
    })
  }

  const canAdvance = () => {
    if (step === 0) return form.titre.trim().length > 0
    if (step === 1) return form.client_id && form.agence_id
    return true
  }

  const handleNext = () => {
    if (step < steps.length - 1 && canAdvance()) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const handleSave = () => {
    const newDossier = {
      id: Date.now(),
      reference: generateReference(),
      titre: form.titre,
      description: form.description,
      statut: "EN_ATTENTE",
      priorite: form.priorite,
      client_id: Number(form.client_id),
      agence_id: Number(form.agence_id),
      avocat_id: null,
      type_affaire_id: Number(form.type_affaire_id) || null,
      specialite_id: Number(form.specialite_id) || null,
      date_ouverture: new Date().toISOString(),
      date_echeance: form.date_echeance ? new Date(form.date_echeance).toISOString() : null,
      created_at: new Date().toISOString(),
    }
    onSave(newDossier)
    setStep(0)
    setForm({
      titre: "",
      description: "",
      type_affaire_id: "",
      specialite_id: "",
      priorite: "moyenne",
      client_id: "",
      agence_id: "",
      date_echeance: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau dossier</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 py-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i < step
                    ? "bg-[#1a237e] text-white"
                    : i === step
                    ? "bg-[#1a237e] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i === step ? "font-medium text-gray-900" : "text-gray-500"}`}>
                {s}
              </span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-gray-300" />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Titre *</label>
              <Input
                placeholder="Titre du dossier"
                value={form.titre}
                onChange={(e) => handleChange("titre", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <Textarea
                placeholder="Description du dossier..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Type d'affaire</label>
                <Select value={form.type_affaire_id || "none"} onValueChange={(v) => handleChange("type_affaire_id", v === "none" ? "" : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun type</SelectItem>
                    {typesAffaire.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Spécialité</label>
                <Select
                  value={form.specialite_id || "none"}
                  onValueChange={(v) => handleChange("specialite_id", v === "none" ? "" : v)}
                  disabled={!form.type_affaire_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune spécialité</SelectItem>
                    {filteredSpecialites.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Priorité</label>
              <Select value={form.priorite} onValueChange={(v) => handleChange("priorite", v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorites.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Client *</label>
              <Select value={form.client_id || "none"} onValueChange={(v) => handleChange("client_id", v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun client</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.type_personne === "MORALE" ? c.nom : `${c.prenom} ${c.nom}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Agence *</label>
              <Select value={form.agence_id || "none"} onValueChange={(v) => handleChange("agence_id", v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une agence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune agence</SelectItem>
                  {agences.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>{a.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Date d'échéance</label>
              <Input
                type="date"
                value={form.date_echeance}
                onChange={(e) => handleChange("date_echeance", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{form.titre || "—"}</p>
                  <p className="text-sm text-gray-500">{form.description || "Aucune description"}</p>
                  {selectedType && <p className="text-sm text-gray-500">Type: {selectedType.nom}</p>}
                  {selectedSpecialite && <p className="text-sm text-gray-500">Spécialité: {selectedSpecialite.nom}</p>}
                  <p className="text-sm text-gray-500">
                    Priorité: <span className="capitalize">{form.priorite}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Client</p>
                  <p className="text-sm text-gray-500">
                    {selectedClient
                      ? selectedClient.type_personne === "MORALE"
                        ? selectedClient.nom
                        : `${selectedClient.prenom} ${selectedClient.nom}`
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Agence</p>
                  <p className="text-sm text-gray-500">{selectedAgence?.nom || "—"}</p>
                  {form.date_echeance && (
                    <p className="text-sm text-gray-500">Échéance: {new Date(form.date_echeance).toLocaleDateString("fr-FR")}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {step > 0 && (
            <Button variant="outline" onClick={handleBack}>
              Précédent
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!canAdvance()}>
              Suivant
            </Button>
          ) : (
            <Button onClick={handleSave}>
              Confirmer & Créer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
