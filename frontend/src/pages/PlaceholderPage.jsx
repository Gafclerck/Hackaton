import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const name = pathname.replace("/", "").replace(/-/g, " ");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
      <Construction size={40} strokeWidth={1.5} />
      <p className="text-sm font-medium capitalize">{name}</p>
      <p className="text-xs">Page en cours de construction</p>
    </div>
  );
}
