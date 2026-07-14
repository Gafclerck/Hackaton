export default function KpiCard({ label, value, icon: Icon, accent, warn }) {
  const bg = accent
    ? "bg-primary"
    : warn && value > 0
      ? "bg-status-transfert-bg"
      : "bg-card";
  const fg = accent
    ? "text-primary-foreground"
    : warn && value > 0
      ? "text-status-transfert-text"
      : "text-foreground";
  const sub = accent
    ? "text-primary-foreground/65"
    : warn && value > 0
      ? "text-status-transfert-text"
      : "text-muted-foreground";
  const iconBg = accent
    ? "bg-primary-foreground/12"
    : warn && value > 0
      ? "bg-black/6"
      : "bg-secondary";
  const iconColor = accent
    ? "text-primary-foreground"
    : warn && value > 0
      ? "text-status-transfert-text"
      : "text-primary";
  const border = accent || (warn && value > 0) ? "" : "border border-border";
  const shadow = accent ? "shadow-md" : "shadow-sm";

  return (
    <div className={`${bg} ${fg} ${border} ${shadow} rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`w-11 h-11 rounded ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        {Icon && <Icon size={20} />}
      </div>
      <div>
        <div className="text-[28px] font-bold leading-none tabular-nums">{value}</div>
        <div className={`text-xs ${sub} mt-1`}>{label}</div>
      </div>
    </div>
  );
}
