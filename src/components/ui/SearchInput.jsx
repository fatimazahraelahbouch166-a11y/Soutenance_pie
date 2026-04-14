/**
 * SearchInput — styled search field with clear button.
 * Usage:
 *   <SearchInput value={search} onChange={setSearch} placeholder="Rechercher…" />
 */
import { Search, X } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Rechercher…', width = 240 }) {
  return (
    <div style={{ position: 'relative', width }}>
      <Search size={13} style={{
        position: 'absolute', left: 11, top: '50%',
        transform: 'translateY(-50%)', color: 'var(--silver)',
        pointerEvents: 'none',
      }} />
      <input
        className="input-premium"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ paddingLeft: 32, paddingRight: value ? 32 : 12, width: '100%' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--silver)', display: 'flex', padding: 2,
          }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
