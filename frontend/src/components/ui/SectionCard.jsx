export default function SectionCard({ title, subtitle, action, children, className = "" }) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-6 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
