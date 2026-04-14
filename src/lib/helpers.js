export const fmt = (value, currency = 'MAD') =>
  Number(value ?? 0).toLocaleString('fr-MA', { style: 'currency', currency, maximumFractionDigits: 0 })

export const fmtDate = (date) =>
  date ? new Date(date).toLocaleDateString('fr-FR') : '—'

export const initials = (first, last) =>
  `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase()
