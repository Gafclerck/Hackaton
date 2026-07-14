export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-10">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3 text-muted-foreground">
          <Icon size={24} />
        </div>
      )}
      {title && <p className="text-sm font-medium text-foreground mb-1">{title}</p>}
      {description && <p className="text-[13px] text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
