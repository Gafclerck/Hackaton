import { Search, X } from "lucide-react"
import { Input } from "../ui/Input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/Select"
import { Button } from "../ui/Button"
import { STATUT_LABELS, STATUT_DOSSIER } from "../../lib/constants"
import { agences, typesAffaire } from "../../data/mockData"

const priorites = [
  { value: "haute", label: "Haute" },
  { value: "moyenne", label: "Moyenne" },
  { value: "basse", label: "Basse" },
]

export default function DossierFilters({ filters, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    filters.search || filters.statut || filters.type_affaire || filters.agence || filters.priorite

  const resetFilters = () => {
    onFilterChange({
      search: "",
      statut: "",
      type_affaire: "",
      agence: "",
      priorite: "",
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-4 top-1/2 h-[20px] w-[20px] -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          placeholder="Rechercher un dossier..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="pl-[52px]"
        />
      </div>

      <Select value={filters.statut || "all"} onValueChange={(v) => handleChange("statut", v === "all" ? "" : v)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {Object.entries(STATUT_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.type_affaire || "all"} onValueChange={(v) => handleChange("type_affaire", v === "all" ? "" : v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type d'affaire" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          {typesAffaire.map((t) => (
            <SelectItem key={t.id} value={String(t.id)}>{t.nom}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.agence || "all"} onValueChange={(v) => handleChange("agence", v === "all" ? "" : v)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Agence" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les agences</SelectItem>
          {agences.map((a) => (
            <SelectItem key={a.id} value={String(a.id)}>{a.nom}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.priorite || "all"} onValueChange={(v) => handleChange("priorite", v === "all" ? "" : v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priorité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes</SelectItem>
          {priorites.map((p) => (
            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <X className="mr-1 h-4 w-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  )
}
