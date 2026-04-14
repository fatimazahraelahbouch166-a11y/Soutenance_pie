/**
 * ActionMenu — dropdown kebab/dots menu for row actions.
 * Usage:
 *   <ActionMenu items={[
 *     { label: 'Modifier', icon: <Pencil size={13} />, onClick: () => {} },
 *     { label: 'Supprimer', icon: <Trash2 size={13} />, onClick: () => {}, danger: true },
 *   ]} />
 */
import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

export default function ActionMenu({ items = [], align = 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        style={{
          width: 28, height: 28, borderRadius: 7,
          border: '1px solid transparent', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--silver)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--ivory)'
          e.currentTarget.style.borderColor = 'var(--pearl)'
          e.currentTarget.style.color = 'var(--charcoal)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
          e.currentTarget.style.color = 'var(--silver)'
        }}
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          [align === 'right' ? 'right' : 'left']: 0,
          top: 'calc(100% + 4px)',
          zIndex: 100,
          background: '#fff',
          border: '1px solid var(--pearl)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(26,25,23,0.12)',
          minWidth: 160,
          overflow: 'hidden',
          animation: 'fadeIn 0.12s ease',
        }}>
          {items.map((item, i) => (
            item === 'divider' ? (
              <div key={i} style={{ height: 1, background: 'var(--ivory)', margin: '3px 0' }} />
            ) : (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); item.onClick(); setOpen(false) }}
                disabled={item.disabled}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 14px',
                  background: 'transparent',
                  border: 'none', cursor: item.disabled ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 400,
                  color: item.danger ? 'var(--danger)' : 'var(--charcoal)',
                  opacity: item.disabled ? 0.4 : 1,
                  transition: 'background 0.12s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  if (!item.disabled) {
                    e.currentTarget.style.background = item.danger ? 'var(--danger-bg)' : 'var(--ivory)'
                  }
                }}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {item.icon && <span style={{ flexShrink: 0 }}>{item.icon}</span>}
                {item.label}
              </button>
            )
          ))}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
