import { Badge } from "../ui/Badge"
import { STATUT_LABELS, STATUT_COLORS } from "../../lib/constants"

export default function DossierStatusBadge({ statut }) {
  return (
    <Badge className={STATUT_COLORS[statut]}>
      {STATUT_LABELS[statut] || statut}
    </Badge>
  )
}
