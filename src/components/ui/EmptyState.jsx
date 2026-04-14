/**
 * EmptyState — shown when a list has no items.
 * Usage:
 *   <EmptyState
 *     icon={<FileText size={32} />}
 *     title="Aucune dépense"
 *     description="Commencez par créer votre première dépense."
 *     action={<button className="btn-primary">Créer</button>}
 *   />
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '56px 24px', textAlign: 'center',
      gap: 12,
    }}>
      {icon && (
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'var(--ivory)', color: 'var(--champagne)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 4,
        }}>
          {icon}
        </div>
      )}
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>{title}</p>
      {description && (
        <p style={{ fontSize: 12.5, color: 'var(--silver)', maxWidth: 320, lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 4 }}>{action}</div>}
    </div>
  )
}
