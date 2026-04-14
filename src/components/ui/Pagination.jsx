/**
 * Pagination — standard prev/next with page info.
 * Usage:
 *   <Pagination page={page} total={meta.total} perPage={20} onChange={setPage} />
 */
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, total, perPage = 20, onChange }) {
  const lastPage = Math.ceil(total / perPage)
  if (lastPage <= 1) return null

  const from = (page - 1) * perPage + 1
  const to   = Math.min(page * perPage, total)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px', borderTop: '1px solid var(--ivory)',
    }}>
      <span style={{ fontSize: 12, color: 'var(--silver)' }}>
        {from}–{to} sur <strong style={{ color: 'var(--charcoal)' }}>{total}</strong>
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1px solid var(--pearl)', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            opacity: page === 1 ? 0.4 : 1, color: 'var(--slate)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (page !== 1) e.currentTarget.style.background = 'var(--ivory)' }}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers (up to 5 visible) */}
        {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
          let p
          if (lastPage <= 5) {
            p = i + 1
          } else if (page <= 3) {
            p = i + 1
          } else if (page >= lastPage - 2) {
            p = lastPage - 4 + i
          } else {
            p = page - 2 + i
          }
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: p === page ? 'none' : '1px solid var(--pearl)',
                background: p === page ? 'var(--accent)' : '#fff',
                color: p === page ? '#fff' : 'var(--slate)',
                fontSize: 12, fontWeight: p === page ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {p}
            </button>
          )
        })}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === lastPage}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1px solid var(--pearl)', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: page === lastPage ? 'not-allowed' : 'pointer',
            opacity: page === lastPage ? 0.4 : 1, color: 'var(--slate)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (page !== lastPage) e.currentTarget.style.background = 'var(--ivory)' }}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
