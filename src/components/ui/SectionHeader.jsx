/**
 * SectionHeader — titled section with optional subtitle and action link.
 * Usage:
 *   <SectionHeader title="Dépenses récentes" subtitle="Les 5 dernières" action={<Link ...>Voir tout</Link>} />
 */
export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      marginBottom: 16,
    }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>{title}</p>
        {subtitle && <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {action && (
        <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          {action}
        </div>
      )}
    </div>
  )
}
