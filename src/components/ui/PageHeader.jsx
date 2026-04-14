/**
 * PageHeader — top section for every page.
 * Usage:
 *   <PageHeader
 *     title="Dépenses"
 *     subtitle="Gérez et suivez toutes vos dépenses"
 *     icon={<DollarSign size={18} />}
 *     actions={<button className="btn-primary">...</button>}
 *   />
 */
export default function PageHeader({ title, subtitle, icon, actions, badge }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon && (
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--accent-light)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{
              fontSize: 18, fontWeight: 700, color: 'var(--ink)',
              letterSpacing: '-0.02em', lineHeight: 1.2,
            }}>
              {title}
            </h1>
            {badge && (
              <span style={{
                padding: '2px 8px', borderRadius: 20,
                fontSize: 11, fontWeight: 600,
                background: 'var(--accent-light)', color: 'var(--accent)',
              }}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: 12.5, color: 'var(--silver)', marginTop: 2 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  )
}
