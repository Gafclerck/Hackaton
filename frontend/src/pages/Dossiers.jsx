import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Briefcase,
  Clock,
  Hourglass,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  UserPlus,
  RefreshCw,
  Plus,
  ChevronUp,
  ChevronDown,
  FolderOpen,
} from "lucide-react"
import { dossiers, clients, utilisateurs, agences, typesAffaire } from "../data/mockData"
import DossierStatusBadge from "../components/dossiers/DossierStatusBadge"
import DossierFilters from "../components/dossiers/DossierFilters"
import NouveauDossierModal from "../components/dossiers/NouveauDossierModal"
import AffectationModal from "../components/dossiers/AffectationModal"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table"
import { Badge } from "../components/ui/Badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/DropdownMenu"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/Tooltip"
import { formatDate } from "../lib/utils"

const PAGE_SIZE = 8

const prioriteStyles = {
  haute: "bg-red-100 text-red-700 border-red-200",
  moyenne: "bg-amber-100 text-amber-700 border-amber-200",
  basse: "bg-gray-100 text-gray-600 border-gray-200",
}

export default function Dossiers() {
  const [dossierList, setDossierList] = useState(dossiers)
  const [filters, setFilters] = useState({
    search: "",
    statut: "",
    type_affaire: "",
    agence: "",
    priorite: "",
  })
  const [sortField, setSortField] = useState("created_at")
  const [sortDir, setSortDir] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [nouveauOpen, setNouveauOpen] = useState(false)
  const [affectationDossier, setAffectationDossier] = useState(null)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return sortDir === "asc" ? (
      <ChevronUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="inline h-4 w-4 ml-1" />
    )
  }

  const getClientName = (clientId) => {
    const c = clients.find((cl) => cl.id === clientId)
    if (!c) return "—"
    return c.type_personne === "MORALE" ? c.nom : `${c.prenom} ${c.nom}`
  }

  const getAvocatName = (avocatId) => {
    const u = utilisateurs.find((u) => u.id === avocatId)
    return u ? `${u.prenom} ${u.nom}` : "Non affecté"
  }

  const filtered = useMemo(() => {
    let result = [...dossierList]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (d) =>
          d.reference.toLowerCase().includes(q) ||
          d.titre.toLowerCase().includes(q) ||
          getClientName(d.client_id).toLowerCase().includes(q)
      )
    }
    if (filters.statut) result = result.filter((d) => d.statut === filters.statut)
    if (filters.type_affaire) result = result.filter((d) => String(d.type_affaire_id) === filters.type_affaire)
    if (filters.agence) result = result.filter((d) => String(d.agence_id) === filters.agence)
    if (filters.priorite) result = result.filter((d) => d.priorite === filters.priorite)

    result.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      if (sortField === "client_id") {
        aVal = getClientName(a.client_id)
        bVal = getClientName(b.client_id)
      }
      if (sortField === "avocat_id") {
        aVal = getAvocatName(a.avocat_id)
        bVal = getAvocatName(b.avocat_id)
      }
      if (typeof aVal === "string") aVal = aVal.toLowerCase()
      if (typeof bVal === "string") bVal = bVal.toLowerCase()
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [dossierList, filters, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const stats = useMemo(() => ({
    total: dossierList.length,
    enCours: dossierList.filter((d) => d.statut === "EN_COURS").length,
    enAttente: dossierList.filter((d) => d.statut === "EN_ATTENTE" || d.statut === "EN_REVUE").length,
    termines: dossierList.filter((d) => d.statut === "TERMINE" || d.statut === "ARCHIVE").length,
  }), [dossierList])

  const handleNewDossier = (newDossier) => {
    setDossierList((prev) => [newDossier, ...prev])
    setNouveauOpen(false)
  }

  const handleAffectation = (updated) => {
    setDossierList((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
    setAffectationDossier(null)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dossiers</h1>
            <p className="text-sm text-gray-500">Gestion des dossiers juridiques</p>
          </div>
          <Button onClick={() => setNouveauOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau dossier
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total dossiers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-indigo-100 p-3">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.enCours}</p>
                <p className="text-sm text-gray-500">En cours</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-amber-100 p-3">
                <Hourglass className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.enAttente}</p>
                <p className="text-sm text-gray-500">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-emerald-100 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.termines}</p>
                <p className="text-sm text-gray-500">Terminés</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DossierFilters filters={filters} onFilterChange={(f) => { setFilters(f); setCurrentPage(1) }} />

        {paginated.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderOpen className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">Aucun dossier trouvé</p>
              <p className="text-sm text-gray-500">Modifiez vos filtres ou créez un nouveau dossier.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("reference")}>
                    Référence<SortIcon field="reference" />
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("titre")}>
                    Titre<SortIcon field="titre" />
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("client_id")}>
                    Client<SortIcon field="client_id" />
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("statut")}>
                    Statut<SortIcon field="statut" />
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("avocat_id")}>
                    Avocat<SortIcon field="avocat_id" />
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("priorite")}>
                    Priorité<SortIcon field="priorite" />
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("date_ouverture")}>
                    Date ouverture<SortIcon field="date_ouverture" />
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <Link
                        to={`/dossiers/${d.id}`}
                        className="font-medium text-[#1a237e] hover:underline"
                      >
                        {d.reference}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{d.titre}</TableCell>
                    <TableCell>{getClientName(d.client_id)}</TableCell>
                    <TableCell>
                      <DossierStatusBadge statut={d.statut} />
                    </TableCell>
                    <TableCell>{getAvocatName(d.avocat_id)}</TableCell>
                    <TableCell>
                      <Badge className={prioriteStyles[d.priorite]}>
                        <span className="capitalize">{d.priorite}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(d.date_ouverture)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link to={`/dossiers/${d.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>Voir le dossier</TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setAffectationDossier(d)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Affecter un avocat
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Changer le statut
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">
                {(currentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} sur {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </Card>
        )}

        <NouveauDossierModal
          open={nouveauOpen}
          onClose={() => setNouveauOpen(false)}
          onSave={handleNewDossier}
        />

        {affectationDossier && (
          <AffectationModal
            open={!!affectationDossier}
            onClose={() => setAffectationDossier(null)}
            dossier={affectationDossier}
            onSave={handleAffectation}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
