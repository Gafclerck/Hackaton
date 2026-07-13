import { useState, useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  Edit,
  UserPlus,
  RefreshCw,
  Upload,
  Calendar,
  Clock,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Tag,
  FileText,
  FileSpreadsheet,
  Image,
  File,
  MessageSquare,
  AlertCircle,
} from "lucide-react"
import { dossiers, clients, utilisateurs, agences, typesAffaire, specialites, historiqueDossier, documents } from "../data/mockData"
import DossierStatusBadge from "../components/dossiers/DossierStatusBadge"
import AffectationModal from "../components/dossiers/AffectationModal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Avatar, AvatarFallback } from "../components/ui/Avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table"
import { formatDate, formatDateTime, getInitials } from "../lib/utils"
import { STATUT_LABELS } from "../lib/constants"

const prioriteStyles = {
  haute: "bg-red-100 text-red-700 border-red-200",
  moyenne: "bg-amber-100 text-amber-700 border-amber-200",
  basse: "bg-gray-100 text-gray-600 border-gray-200",
}

const documentTypeIcons = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  png: Image,
  jpg: Image,
  default: File,
}

const historyColors = {
  "Création du dossier": "bg-blue-500",
  Affectation: "bg-purple-500",
  "Changement de statut": "bg-amber-500",
  "Document ajouté": "bg-emerald-500",
  Commentaire: "bg-gray-400",
}

export default function DossierDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [affectationOpen, setAffectationOpen] = useState(false)

  const dossier = dossiers.find((d) => d.id === Number(id))
  const client = dossier ? clients.find((c) => c.id === dossier.client_id) : null
  const avocat = dossier?.avocat_id ? utilisateurs.find((u) => u.id === dossier.avocat_id) : null
  const agence = dossier ? agences.find((a) => a.id === dossier.agence_id) : null
  const typeAffaire = dossier?.type_affaire_id ? typesAffaire.find((t) => t.id === dossier.type_affaire_id) : null
  const specialite = dossier?.specialite_id ? specialites.find((s) => s.id === dossier.specialite_id) : null

  const dossiersHistorique = useMemo(
    () => historiqueDossier.filter((h) => h.dossier_id === Number(id)).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [id]
  )

  const dossiersDocuments = useMemo(
    () => documents.filter((d) => d.dossier_id === Number(id)),
    [id]
  )

  if (!dossier) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dossier introuvable</h2>
        <p className="text-sm text-gray-500 mb-4">Le dossier demandé n'existe pas ou a été supprimé.</p>
        <Button asChild>
          <Link to="/dossiers">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  const handleAffectationSave = (updated) => {
    setAffectationOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dossiers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{dossier.reference}</h1>
            <DossierStatusBadge statut={dossier.statut} />
            <Badge className={prioriteStyles[dossier.priorite]}>
              <span className="capitalize">{dossier.priorite}</span>
            </Badge>
          </div>
          <p className="text-lg text-gray-600">{dossier.titre}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAffectationOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Affecter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Changer statut
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 lg:w-[65%]">
          <Tabs defaultValue="apercu">
            <TabsList>
              <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              <TabsTrigger value="documents">
                Documents ({dossiersDocuments.length})
              </TabsTrigger>
              <TabsTrigger value="historique">
                Historique ({dossiersHistorique.length})
              </TabsTrigger>
              <TabsTrigger value="messagerie">Messagerie</TabsTrigger>
            </TabsList>

            <TabsContent value="apercu" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">{dossier.description}</p>
                </CardContent>
              </Card>

              {client && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informations client</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{client.telephone}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 w-32">Ouverture:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(dossier.date_ouverture)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 w-32">Échéance:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(dossier.date_echeance)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Avocat affecté</CardTitle>
                </CardHeader>
                <CardContent>
                  {avocat ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(avocat.prenom, avocat.nom)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{avocat.prenom} {avocat.nom}</p>
                        <p className="text-xs text-gray-500">{avocat.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Aucun avocat affecté</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Documents</CardTitle>
                  <Button size="sm" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </CardHeader>
                <CardContent>
                  {dossiersDocuments.length === 0 ? (
                    <div className="py-8 text-center">
                      <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Aucun document pour ce dossier.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Taille</TableHead>
                          <TableHead>Ajouté par</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dossiersDocuments.map((doc) => {
                          const Icon = documentTypeIcons[doc.type] || documentTypeIcons.default
                          return (
                            <TableRow key={doc.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-900">{doc.nom}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">{doc.taille}</TableCell>
                              <TableCell className="text-sm text-gray-500">{doc.uploadé_par}</TableCell>
                              <TableCell className="text-sm text-gray-500">{formatDate(doc.date)}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historique">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Historique</CardTitle>
                </CardHeader>
                <CardContent>
                  {dossiersHistorique.length === 0 ? (
                    <div className="py-8 text-center">
                      <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Aucun historique pour ce dossier.</p>
                    </div>
                  ) : (
                    <div className="relative ml-3">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
                      <div className="space-y-6">
                        {dossiersHistorique.map((entry) => (
                          <div key={entry.id} className="relative pl-6">
                            <div
                              className={`absolute left-0 top-1.5 h-3 w-3 rounded-full -translate-x-1/2 ${
                                historyColors[entry.action] || "bg-gray-400"
                              }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                              <p className="text-xs text-gray-500">
                                {entry.auteur} &middot; {formatDateTime(entry.date)}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messagerie">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium text-gray-900">Module de messagerie</p>
                  <p className="text-sm text-gray-500">Bientôt disponible</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full lg:w-[35%] space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Agence</p>
                  <p className="text-sm font-medium text-gray-900">{agence?.nom || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Type d'affaire</p>
                  <p className="text-sm font-medium text-gray-900">{typeAffaire?.nom || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Spécialité</p>
                  <p className="text-sm font-medium text-gray-900">{specialite?.nom || "—"}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Avocat assigné</p>
                {avocat ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {getInitials(avocat.prenom, avocat.nom)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{avocat.prenom} {avocat.nom}</p>
                      <p className="text-xs text-gray-500">{avocat.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Non affecté</p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Dates importantes</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ouverture</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(dossier.date_ouverture)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Échéance</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(dossier.date_echeance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Créé le</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(dossier.created_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AffectationModal
        open={affectationOpen}
        onClose={() => setAffectationOpen(false)}
        dossier={dossier}
        onSave={handleAffectationSave}
      />
    </div>
  )
}
