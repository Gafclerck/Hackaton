import { STATUT_LABELS, STATUT_STYLES } from "../../lib/constants";

export default function StatusBadge({ statut }) {
  const s = STATUT_STYLES[statut] || STATUT_STYLES.nouveau;
  const label = STATUT_LABELS[statut] || statut;
  return (
    <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 whitespace-nowrap ${s.bg} ${s.text}`}>
      {label}
    </span>
  );
}
