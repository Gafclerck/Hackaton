import { FiGrid } from "react-icons/fi";

const LABELS = {
  agences:      "Agences",
  utilisateurs: "Utilisateurs",
  specialites:  "Spécialités",
  parametres:   "Paramètres",
};

export default function PlaceholderPage({ pageId }) {
  const label = LABELS[pageId] || pageId;
  return (
    <div className="flex-1 flex items-center justify-center h-full bg-background">
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <FiGrid size={28} />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-1.5">{label}</h2>
        <p className="text-sm text-muted-foreground">Cet écran sera implémenté dans la prochaine itération.</p>
      </div>
    </div>
  );
}
