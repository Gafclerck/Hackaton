export default function Chip({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    outline: "bg-background text-foreground border border-border",
    warning: "bg-status-transfert-bg text-status-transfert-text",
    success: "bg-success text-success-foreground",
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-medium rounded-md px-2 py-0.5 ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
