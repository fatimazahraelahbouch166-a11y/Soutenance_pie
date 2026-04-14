/**
 * FilterBar — collapsible advanced filter panel.
 * Usage:
 *   <FilterBar open={showFilters} onClose={() => setShowFilters(false)} count={activeCount}>
 *     <FilterBar.Field label="Catégorie">
 *       <select ...>...</select>
 *     </FilterBar.Field>
 *   </FilterBar>
 */
import { X, SlidersHorizontal } from 'lucide-react'

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function FilterBar({ open, children, onApply, onReset, count = 0 }) {
  if (!open) return null

  return (
    <div className="card-static animate-fade-up" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <SlidersHorizontal size={13} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--charcoal)' }}>Filtres avancés</span>
        {count > 0 && (
          <span style={{
            background: 'var(--accent)', color: '#fff',
            borderRadius: 20, fontSize: 10.5, fontWeight: 600,
            padding: '1px 7px', marginLeft: 2,
          }}>
            {count} actif{count > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 14,
        marginBottom: 16,
      }}>
        {children}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--ivory)' }}>
        {onApply && (
          <button className="btn-primary" onClick={onApply} style={{ height: 34, padding: '0 16px', fontSize: 12.5 }}>
            Appliquer les filtres
          </button>
        )}
        {onReset && (
          <button className="btn-ghost" onClick={onReset} style={{ height: 34, fontSize: 12.5 }}>
            <X size={12} /> Réinitialiser
          </button>
        )}
      </div>
    </div>
  )
}

FilterBar.Field = Field
