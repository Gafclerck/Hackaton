import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/Dialog"
import { Button } from "../ui/Button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/Select"
import { Avatar, AvatarFallback } from "../ui/Avatar"
import { Card, CardContent } from "../ui/Card"
import { agences, utilisateurs, dossiers } from "../../data/mockData"
import { getInitials } from "../../lib/utils"
import { ROLE_LABELS } from "../../lib/constants"

export default function AffectationModal({ open, onClose, dossier, onSave }) {
  const [agenceId, setAgenceId] = useState(String(dossier?.agence_id || ""))
  const [avocatId, setAvocatId] = useState(String(dossier?.avocat_id || ""))

  const filteredAvocats = useMemo(
    () => utilisateurs.filter((u) => u.role.includes("AVOCAT") && String(u.agence_id) === agenceId),
    [agenceId]
  )

  const getDossierCount = (userId) => {
    return dossiers.filter(
      (d) => d.avocat_id === userId && d.statut !== "TERMINE" && d.statut !== "ARCHIVE"
    ).length
  }

  const handleAgenceChange = (value) => {
    setAgenceId(value === "none" ? "" : value)
    setAvocatId("")
  }

  const handleSave = () => {
    onSave({
      ...dossier,
      agence_id: Number(agenceId),
      avocat_id: Number(avocatId) || null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Affecter un avocat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {dossier && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-900">{dossier.reference}</p>
              <p className="text-sm text-gray-500">{dossier.titre}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Agence</label>
            <Select value={agenceId || "none"} onValueChange={handleAgenceChange}>
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
            <label className="text-sm font-medium text-gray-700 mb-1 block">Avocat</label>
            {agenceId ? (
              <div className="grid gap-2">
                {filteredAvocats.length > 0 ? (
                  filteredAvocats.map((u) => (
                    <Card
                      key={u.id}
                      className={`cursor-pointer transition-colors ${
                        avocatId === String(u.id) ? "border-[#1a237e] bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setAvocatId(String(u.id))}
                    >
                      <CardContent className="flex items-center gap-3 p-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">
                            {getInitials(u.prenom, u.nom)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {u.prenom} {u.nom}
                          </p>
                          <p className="text-xs text-gray-500">{ROLE_LABELS[u.role]}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {getDossierCount(u.id)} dossier{getDossierCount(u.id) > 1 ? "s" : ""}
                        </span>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucun avocat disponible dans cette agence.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Sélectionnez une agence pour voir les avocats.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!avocatId}>
            Confirmer l'affectation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
