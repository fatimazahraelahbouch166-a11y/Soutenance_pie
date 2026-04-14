// const cfg = {
//   draft:    { label: 'Brouillon',  cls: 'bg-gray-100 text-gray-500' },
//   pending:  { label: 'En attente', cls: 'bg-amber-50 text-amber-700' },
//   approved: { label: 'Approuvée',  cls: 'bg-emerald-50 text-emerald-700' },
//   rejected: { label: 'Refusée',    cls: 'bg-red-50 text-red-600' },
//   paid:     { label: 'Remboursée', cls: 'bg-indigo-50 text-indigo-700' },
// }
// export default function StatusBadge({ status }) {
//   const { label, cls } = cfg[status] ?? cfg.draft
//   return <span className={`badge ${cls}`}>{label}</span>
// }
const CONFIG = {
  pending:  { label: 'En attente',  cls: 'badge-pending'  },
  approved: { label: 'Approuvée',   cls: 'badge-approved' },
  paid:     { label: 'Payée',       cls: 'badge-paid'     },
  rejected: { label: 'Rejetée',     cls: 'badge-rejected' },
  draft:    { label: 'Brouillon',   cls: 'badge-draft'    },
  sent:     { label: 'Envoyée',     cls: 'badge-sent'     },
  accepted: { label: 'Acceptée',    cls: 'badge-accepted' },
  overdue:  { label: 'En retard',   cls: 'badge-overdue'  },
  received: { label: 'Reçue',       cls: 'badge-received' },
}

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] ?? { label: status, cls: 'badge-draft' }
  return (
    <span className={`badge ${cfg.cls}`}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', opacity: 0.7, display: 'inline-block' }} />
      {cfg.label}
    </span>
  )
}