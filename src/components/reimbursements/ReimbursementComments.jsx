/**
 * ReimbursementComments.jsx
 * Chat-style comment section between employee and manager.
 */
import { useState } from 'react'
import { Send, MessageSquare } from 'lucide-react'
import { fmtDate } from '../../lib/helpers'

const ROLE_COLORS = {
  owner:      { bg: 'var(--accent)',     text: '#fff' },
  chef_equipe:{ bg: 'var(--success)',    text: '#fff' },
  equipe:     { bg: 'var(--pearl)',      text: 'var(--charcoal)' },
}

const ROLE_LABELS = {
  owner:       'Directeur',
  chef_equipe: 'Chef d\'équipe',
  equipe:      'Employé',
}

function Avatar({ author, role }) {
  const cfg  = ROLE_COLORS[role] ?? ROLE_COLORS.equipe
  const init = author.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
      background: cfg.bg, color: cfg.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 700,
    }}>
      {init}
    </div>
  )
}

export default function ReimbursementComments({ comments = [], onAddComment, loading = false }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAddComment(trimmed)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Comment list */}
      {comments.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '28px 0', gap: 8,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: 'var(--ivory)', color: 'var(--champagne)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MessageSquare size={18} />
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--silver)' }}>Aucun commentaire pour l'instant</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {comments.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Avatar author={c.author} role={c.role} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--charcoal)' }}>
                    {c.author}
                  </span>
                  <span style={{
                    fontSize: 10, padding: '1px 6px', borderRadius: 4,
                    background: 'var(--ivory)', color: 'var(--silver)', fontWeight: 500,
                  }}>
                    {ROLE_LABELS[c.role] ?? c.role}
                  </span>
                  <span style={{ fontSize: 10.5, color: 'var(--silver)' }}>
                    {new Date(c.date).toLocaleString('fr-FR', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <div style={{
                  padding: '10px 14px', borderRadius: '4px 12px 12px 12px',
                  background: 'var(--ivory)', border: '1px solid var(--pearl)',
                  fontSize: 13, color: 'var(--slate)', lineHeight: 1.6,
                }}>
                  {c.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-end',
        padding: '12px', borderRadius: 12,
        background: 'var(--ivory)', border: '1px solid var(--pearl)',
      }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ajouter un commentaire… (Ctrl+Entrée pour envoyer)"
          rows={2}
          style={{
            flex: 1, border: 'none', background: 'transparent', resize: 'none',
            fontSize: 13, color: 'var(--charcoal)', fontFamily: 'var(--font-sans)',
            outline: 'none', lineHeight: 1.6,
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || loading}
          style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: text.trim() ? 'var(--accent)' : 'var(--pearl)',
            color: text.trim() ? '#fff' : 'var(--silver)',
            border: 'none', cursor: text.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          title="Envoyer (Ctrl+Entrée)"
        >
          <Send size={14} />
        </button>
      </div>
      <p style={{ fontSize: 10.5, color: 'var(--silver)', marginTop: -10 }}>
        Ctrl+Entrée pour envoyer rapidement
      </p>
    </div>
  )
}
