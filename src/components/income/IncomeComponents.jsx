// src/components/income/IncomeComponents.jsx
// ── TagsInput · CategoryManager · ExportButton · NotificationBell ──
import { useState, useEffect } from 'react'
import {
  X, Hash, Plus, Pencil, Trash2, Check,
  Download, FileText, Table, CheckCircle,
  Bell, AlertTriangle, DollarSign,
} from 'lucide-react'
import api from '../../lib/api'
import { fmt, fmtDate } from '../../lib/helpers'

// ══════════════════════════════════════════════════════════
//  src/components/income/TagsInput.jsx
//  Input pour ajouter/supprimer des tags (#urgent, #client…)
// ══════════════════════════════════════════════════════════

const PRESET_TAGS = ['#urgent', '#client', '#fixe', '#variable', '#retard', '#pro', '#perso']

export function TagsInput({ value = [], onChange }) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  const add = (tag) => {
    const clean = tag.startsWith('#') ? tag : `#${tag}`
    if (clean.length > 1 && !value.includes(clean)) {
      onChange([...value, clean])
    }
    setInput('')
  }

  const remove = (tag) => onChange(value.filter(t => t !== tag))

  const onKey = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && input.trim()) {
      e.preventDefault()
      add(input.trim())
    }
    if (e.key === 'Backspace' && !input && value.length) {
      remove(value[value.length - 1])
    }
  }

  return (
    <div>
      {/* Tags container */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
        padding: '7px 10px', borderRadius: 10, minHeight: 40,
        border: `1.5px solid ${focused ? '#284E7B' : '#e5e7eb'}`,
        background: '#fff', cursor: 'text',
        boxShadow: focused ? '0 0 0 3px #284E7B20' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
        onClick={() => document.getElementById('tag-input')?.focus()}
      >
        {value.map(tag => (
          <span key={tag} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: '#EFF3F5', color: '#284E7B', border: '1px solid #ADD4F3',
          }}>
            {tag}
            <button onClick={() => remove(tag)}
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                color: '#659ABD', display: 'flex', padding: 0, lineHeight: 1 }}>
              <X size={11} />
            </button>
          </span>
        ))}
        <input id="tag-input" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={value.length === 0 ? 'Ajouter un tag… (ex: #client)' : ''}
          style={{
            border: 'none', outline: 'none', fontSize: 13, flex: 1,
            minWidth: 120, background: 'transparent', color: '#374151',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        />
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7 }}>
        {PRESET_TAGS.filter(t => !value.includes(t)).map(tag => (
          <button key={tag} onClick={() => add(tag)}
            style={{
              padding: '2px 9px', borderRadius: 20, fontSize: 11.5, cursor: 'pointer',
              border: '1px dashed #d1d5db', background: '#f9fafb', color: '#6b7280',
              fontWeight: 500, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#284E7B'; e.target.style.color = '#284E7B' }}
            onMouseLeave={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.color = '#6b7280' }}
          >
            + {tag}
          </button>
        ))}
      </div>
    </div>
  )
}


// ══════════════════════════════════════════════════════════
//  src/components/income/CategoryManager.jsx
//  Modal CRUD pour gérer les catégories de revenus
// ══════════════════════════════════════════════════════════

const DEFAULT_COLORS = ['#284E7B','#16a34a','#d97706','#dc2626','#7c3aed','#0891b2','#db2777','#65a30d']

export function CategoryManager({ categories, onCreate, onUpdate, onDelete }) {
  const [editId,    setEditId]    = useState(null)
  const [newMode,   setNewMode]   = useState(false)
  const [form,      setForm]      = useState({ name: '', color: DEFAULT_COLORS[0], icon: '💼' })

  const reset = () => { setEditId(null); setNewMode(false); setForm({ name: '', color: DEFAULT_COLORS[0], icon: '💼' }) }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editId) { onUpdate(editId, form); reset() }
    else        { onCreate(form);         reset() }
  }

  const startEdit = (cat) => {
    setEditId(cat.id)
    setForm({ name: cat.name, color: cat.color, icon: cat.icon })
    setNewMode(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Existing categories */}
      {categories.map(cat => (
        <div key={cat.id} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 10, border: '1px solid #e5e7eb',
          background: editId === cat.id ? '#f9fafb' : '#fff',
        }}>
          {editId === cat.id ? (
            // Edit mode
            <>
              <input value={form.icon} onChange={e => setForm(f=>({...f,icon:e.target.value}))}
                style={{ width: 36, textAlign: 'center', fontSize: 18, border: '1px solid #e5e7eb',
                  borderRadius: 8, padding: '2px 4px', background: '#f9fafb' }} />
              <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1.5px solid #284E7B',
                  fontSize: 13, outline: 'none' }} />
              <div style={{ display: 'flex', gap: 4 }}>
                {DEFAULT_COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f=>({...f,color:c}))}
                    style={{ width: 20, height: 20, borderRadius: '50%', background: c,
                      border: form.color === c ? '2px solid #111' : '2px solid transparent',
                      cursor: 'pointer', padding: 0 }} />
                ))}
              </div>
              <button onClick={handleSave}
                style={{ width: 28, height: 28, borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={13} />
              </button>
              <button onClick={reset}
                style={{ width: 28, height: 28, borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: '#f3f4f6', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XIcon size={13} />
              </button>
            </>
          ) : (
            // View mode
            <>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{cat.icon}</span>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#374151' }}>{cat.name}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{cat.count || 0} revenus</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => startEdit(cat)}
                  style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e5e7eb',
                    background: '#fff', color: '#6b7280', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer' }}>
                  <Pencil size={11} />
                </button>
                <button onClick={() => onDelete(cat.id)}
                  style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #fecaca',
                    background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer' }}>
                  <Trash2 size={11} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Add new */}
      {newMode ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          borderRadius: 10, border: '1.5px solid #284E7B', background: '#EFF3F5' }}>
          <input value={form.icon} onChange={e => setForm(f=>({...f,icon:e.target.value}))}
            style={{ width: 36, textAlign: 'center', fontSize: 18, border: '1px solid #e5e7eb',
              borderRadius: 8, padding: '2px 4px' }} placeholder="💼" />
          <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
            placeholder="Nom de la catégorie" autoFocus
            style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #ADD4F3',
              fontSize: 13, outline: 'none' }}
            onKeyDown={e => e.key === 'Enter' && handleSave()} />
          <div style={{ display: 'flex', gap: 4 }}>
            {DEFAULT_COLORS.map(c => (
              <button key={c} onClick={() => setForm(f=>({...f,color:c}))}
                style={{ width: 18, height: 18, borderRadius: '50%', background: c,
                  border: form.color === c ? '2px solid #111' : '2px solid transparent',
                  cursor: 'pointer', padding: 0 }} />
            ))}
          </div>
          <button onClick={handleSave}
            style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#284E7B',
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Ajouter
          </button>
          <button onClick={reset}
            style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: '#f3f4f6',
              color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <XIcon size={13} />
          </button>
        </div>
      ) : (
        <button onClick={() => setNewMode(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
            borderRadius: 10, border: '1.5px dashed #d1d5db', background: 'transparent',
            color: '#9ca3af', fontSize: 13, cursor: 'pointer', width: '100%',
            transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#284E7B'; e.currentTarget.style.color = '#284E7B'; e.currentTarget.style.background = '#EFF3F5' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent' }}
        >
          <Plus size={14} /> Nouvelle catégorie
        </button>
      )}
    </div>
  )
}


// ══════════════════════════════════════════════════════════
//  src/components/income/ExportButton.jsx
//  Bouton export CSV / PDF avec sélection filtres
// ══════════════════════════════════════════════════════════

export function ExportButton({ data = [], totalRows = 0 }) {
  const [open, setOpen] = useState(false)

  // ── Téléchargement CSV directement ──────────────────
  const downloadCSV = () => {
    const headers = ['Date','Description','Source','Type','Statut','Montant (MAD)','Client','Tags']
    const rows = data.map(i => [
      i.date,
      `"${(i.description || '').replace(/"/g, '""')}"`,
      i.source || '',
      i.category || '',
      i.status || '',
      i.amount || 0,
      `"${(i.client_name || '').replace(/"/g, '""')}"`,
      `"${(i.tags || []).join('; ')}"`,
    ])
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href     = url
    link.download = `revenus_${new Date().toISOString().slice(0,10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  // ── Impression PDF ───────────────────────────────────
  const printPDF = () => {
    const total = data.reduce((s, i) => s + +i.amount, 0)
    const rows  = data.map(i => `
      <tr>
        <td>${i.date || ''}</td>
        <td>${i.description || ''}</td>
        <td>${i.source || ''}</td>
        <td>${i.status || ''}</td>
        <td style="text-align:right;font-weight:600">
          ${Number(i.amount || 0).toLocaleString('fr-MA')} MAD
        </td>
      </tr>`).join('')

    const html = `<!DOCTYPE html><html><head>
      <title>Revenus — Taadbiir</title>
      <style>
        body  { font-family: Arial, sans-serif; padding: 32px; color: #111; }
        h1    { color: #284E7B; font-size: 22px; margin-bottom: 4px; }
        p.sub { color: #888; font-size: 13px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th    { background: #EFF3F5; padding: 10px 12px; text-align: left;
                font-size: 11px; text-transform: uppercase; color: #284E7B; }
        td    { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; }
        .tot  { text-align: right; font-size: 16px; font-weight: bold;
                margin-top: 20px; color: #284E7B; }
      </style>
    </head><body>
      <h1>Revenus — Taadbiir</h1>
      <p class="sub">Exporté le ${new Date().toLocaleDateString('fr-FR')} · ${data.length} entrée${data.length > 1 ? 's' : ''}</p>
      <table>
        <thead><tr>
          <th>Date</th><th>Description</th><th>Source</th><th>Statut</th><th>Montant</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="tot">Total : ${total.toLocaleString('fr-MA')} MAD</p>
    </body></html>`

    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) { alert('Activez les popups pour imprimer.'); return }
    win.document.write(html)
    win.document.close()
    setTimeout(() => { win.focus(); win.print() }, 400)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 10, fontSize: 13,
          border: '1.5px solid #e5e7eb', background: '#fff',
          color: '#4b5563', cursor: 'pointer',
          fontFamily: 'Inter, system-ui, sans-serif',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#284E7B'; e.currentTarget.style.color = '#284E7B' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#4b5563' }}
      >
        <Download size={14} />
        Exporter {totalRows > 0 && <span style={{ color: '#9ca3af', fontSize: 12 }}>({totalRows})</span>}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 49 }} />

          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 220, background: '#fff', borderRadius: 14, zIndex: 50,
            border: '1px solid #e5e7eb',
            boxShadow: '0 8px 24px rgba(40,78,123,0.14)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>
                Exporter {totalRows} entrée{totalRows > 1 ? 's' : ''}
              </p>
            </div>

            {[
              { label: 'Télécharger CSV', sub: 'Excel, Google Sheets', icon: Table,    action: downloadCSV },
              { label: 'Imprimer PDF',    sub: 'Aperçu avant impression', icon: FileText, action: printPDF },
            ].map(opt => (
              <button key={opt.label} onClick={opt.action}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
                  borderBottom: '1px solid #f9fafb',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: '#EFF3F5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <opt.icon size={14} style={{ color: '#284E7B' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', margin: 0 }}>{opt.label}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{opt.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


export function NotificationBell() {
  const [open,   setOpen]   = useState(false)
  const [notifs, setNotifs] = useState([])

  const load = () =>
    api.get('/incomes/notifications').then(r => setNotifs(r.data || [])).catch(() => {})

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t) }, [])

  const unread = notifs.filter(n => !n.read).length

  const markRead = async (id) => {
    await api.post(`/incomes/notifications/${id}/read`)
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    notifs.forEach(n => !n.read && markRead(n.id))
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell button */}
      <button onClick={() => setOpen(v => !v)}
        style={{
          position: 'relative', width: 36, height: 36, borderRadius: 10,
          border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#284E7B'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
      >
        <Bell size={16} style={{ color: '#4b5563' }} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4, width: 18, height: 18,
            borderRadius: '50%', background: '#dc2626', color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 49 }} />

          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 320, maxHeight: 400, overflow: 'hidden',
            background: '#fff', borderRadius: 14, zIndex: 50,
            border: '1px solid #e5e7eb',
            boxShadow: '0 8px 24px rgba(40,78,123,0.14)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>
                Notifications {unread > 0 && <span style={{ color: '#dc2626' }}>({unread})</span>}
              </p>
              {unread > 0 && (
                <button onClick={markAllRead}
                  style={{ fontSize: 11.5, color: '#284E7B', background: 'none', border: 'none',
                    cursor: 'pointer', fontWeight: 600 }}>
                  Tout marquer lu
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {notifs.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9ca3af' }}>
                  <Bell size={24} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                  <p style={{ fontSize: 13 }}>Aucune notification</p>
                </div>
              ) : notifs.map(n => {
                const cfg = ICONS[n.type] || ICONS.default
                const Icon = cfg.icon
                return (
                  <div key={n.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '10px 16px',
                      background: n.read ? '#fff' : '#f9fafb',
                      borderBottom: '1px solid #f9fafb',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={e => e.currentTarget.style.background = n.read ? '#fff' : '#f9fafb'}
                    onClick={() => markRead(n.id)}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} style={{ color: cfg.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12.5, color: '#1f2937', fontWeight: n.read ? 400 : 600,
                        lineHeight: 1.4 }}>{n.message}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                        {fmtDate(n.created_at?.slice(0, 10))}
                      </p>
                    </div>
                    {!n.read && (
                      <div style={{ width: 7, height: 7, borderRadius: '50%',
                        background: '#284E7B', flexShrink: 0, marginTop: 5 }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}