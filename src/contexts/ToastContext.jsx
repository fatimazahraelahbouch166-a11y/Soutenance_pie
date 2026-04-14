import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

const STYLES = {
  success: { bg: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-600', text: 'text-emerald-800' },
  error:   { bg: 'bg-red-50 border-red-200',         icon: 'text-red-600',     text: 'text-red-800' },
  warning: { bg: 'bg-amber-50 border-amber-200',     icon: 'text-amber-600',   text: 'text-amber-800' },
  info:    { bg: 'bg-indigo-50 border-indigo-200',   icon: 'text-indigo-600',  text: 'text-indigo-800' },
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration || 3500)
    return () => clearTimeout(t)
  }, [])

  const s = STYLES[toast.type] || STYLES.info
  const Icon = ICONS[toast.type] || Info

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-sm
      transition-all duration-300 max-w-sm w-full
      ${s.bg}
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <Icon size={16} className={`${s.icon} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-semibold ${s.text}`}>{toast.title}</p>
        )}
        {toast.message && (
          <p className={`text-xs mt-0.5 ${s.text} opacity-80`}>{toast.message}</p>
        )}
      </div>
      <button onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300) }}
        className={`${s.icon} opacity-60 hover:opacity-100 transition shrink-0`}>
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((type, title, message, duration) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, title, message, duration }])
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (title, message, duration) => add('success', title, message, duration),
    error:   (title, message, duration) => add('error',   title, message, duration),
    warning: (title, message, duration) => add('warning', title, message, duration),
    info:    (title, message, duration) => add('info',    title, message, duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
