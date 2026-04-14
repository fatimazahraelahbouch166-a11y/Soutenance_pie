import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, ChevronDown } from 'lucide-react'
import { MOCK_MESSAGES } from '../../hooks/useEquipeData'
import { fmtDate } from '../../lib/helpers'

export default function EquipeChat({ expenses }) {
  const [selected, setSelected] = useState(null)
  const [threads, setThreads]   = useState(MOCK_MESSAGES)
  const [text, setText]         = useState('')
  const bottomRef               = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected, threads])

  const msgs = selected ? (threads[selected] ?? []) : []

  const sendMsg = () => {
    if (!text.trim() || !selected) return
    const newMsg = { id: Date.now(), author: 'Moi', role: 'equipe', text, date: new Date().toLocaleString('fr-FR'), is_me: true }
    setThreads(p => ({ ...p, [selected]: [...(p[selected] ?? []), newMsg] }))
    setText('')
  }

  return (
    <div className="grid grid-cols-3 gap-4 h-[520px]">
      {/* Liste dépenses */}
      <div className="col-span-1 card overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dépenses</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {expenses.map(e => {
            const hasMsg  = (threads[e.id]?.length ?? 0) > 0
            const isActive = selected === e.id
            return (
              <button key={e.id} onClick={() => setSelected(e.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition ${
                  isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'
                }`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  e.status === 'rejected' ? 'bg-red-400' :
                  e.status === 'pending'  ? 'bg-amber-400' :
                  e.status === 'paid'     ? 'bg-emerald-400' : 'bg-gray-200'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>{e.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{e.expense_date}</p>
                </div>
                {hasMsg && (
                  <span className="w-4 h-4 bg-indigo-500 text-white text-[9px] rounded-full flex items-center justify-center shrink-0">
                    {threads[e.id]?.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Zone messages */}
      <div className="col-span-2 card overflow-hidden flex flex-col">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
            <MessageSquare size={32} className="mb-3 opacity-30" />
            <p>Sélectionnez une dépense pour voir les messages</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {expenses.find(e => e.id === selected)?.title}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.length === 0 && (
                <p className="text-xs text-center text-gray-400 py-8">Aucun message — démarrez la conversation</p>
              )}
              {msgs.map(m => (
                <div key={m.id} className={`flex ${m.is_me ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${m.is_me ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    {!m.is_me && (
                      <p className="text-[10px] text-gray-400 px-1">{m.author}</p>
                    )}
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      m.is_me
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      {m.text}
                    </div>
                    <p className="text-[10px] text-gray-400 px-1">{m.date}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-50 flex gap-2">
              <input type="text" value={text} onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
                className="input flex-1 text-sm" placeholder="Votre message…" />
              <button onClick={sendMsg} disabled={!text.trim()}
                className="btn-primary px-3 disabled:opacity-40">
                <Send size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
