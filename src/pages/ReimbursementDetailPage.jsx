/**
 * ReimbursementDetailPage.jsx
 * Full detail view for a single reimbursement.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, CreditCard, FileText, Paperclip, Download,
  MessageSquare, History, CheckCircle, XCircle, Pencil,
  Trash2, ExternalLink, AlertTriangle, Clock, User,
} from 'lucide-react'

import { ReimbursementStatusBadge, ReimbursementPriorityBadge, PaymentMethodBadge, SLABadge }
  from '../components/reimbursements/ReimbursementBadges'
import ReimbursementTimeline    from '../components/reimbursements/ReimbursementTimeline'
import ReimbursementComments    from '../components/reimbursements/ReimbursementComments'
import ReimbursementActivityLog from '../components/reimbursements/ReimbursementActivityLog'
import ReimbursementForm        from '../components/reimbursements/ReimbursementForm'
import RejectModal              from '../components/reimbursements/RejectModal'
import MarkReimbursedModal      from '../components/reimbursements/MarkReimbursedModal'

import { reimbursementService, PAYMENT_METHOD_LABELS } from '../services/reimbursementService'
import { fmt, fmtDate } from '../lib/helpers'
import { useToast } from '../contexts/ToastContext'
import { useGlobalStore } from '../store/GlobalStore'
import WorkflowActions from '../components/WorkflowActions'

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, icon, children, action }) {
  return (
    <div className="card-static" style={{ overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid var(--ivory)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--accent-light)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>{title}</h3>
        </div>
        {action}
      </div>
      <div style={{ padding: '18px 20px' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid var(--ivory)' }}>
      <span style={{ fontSize: 12, color: 'var(--silver)', fontWeight: 500, flexShrink: 0, minWidth: 140 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: accent ? 700 : 400, color: accent ?? 'var(--charcoal)', textAlign: 'right' }}>
        {value ?? '—'}
      </span>
    </div>
  )
}

// ─── Amount card ──────────────────────────────────────────────────────────────

function AmountCard({ label, value, color = 'var(--ink)', sub }) {
  return (
    <div style={{
      flex: 1, padding: '14px 16px', borderRadius: 10,
      background: 'var(--ivory)', border: '1px solid var(--pearl)',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 10.5, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 500, marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 20, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {fmt(value)}
      </p>
      {sub && <p style={{ fontSize: 10.5, color: 'var(--silver)', marginTop: 5 }}>{sub}</p>}
    </div>
  )
}

// ─── Attachment item ──────────────────────────────────────────────────────────

function AttachmentItem({ file }) {
  const isImage = file.type?.startsWith('image/')
  const ext = file.name.split('.').pop().toUpperCase()
  const sizeMB = (file.size / 1024 / 1024).toFixed(2)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 8,
      border: '1px solid var(--pearl)', background: 'var(--ivory)',
      cursor: 'pointer', transition: 'border-color .15s, background .15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-mid)'; e.currentTarget.style.background = 'var(--accent-light)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pearl)';      e.currentTarget.style.background = 'var(--ivory)' }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: isImage ? 'var(--success-bg)' : 'var(--danger-bg)',
        color: isImage ? 'var(--success)' : 'var(--danger)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700,
      }}>
        {ext}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 1 }}>{sizeMB} MB</p>
      </div>
      <Download size={13} style={{ color: 'var(--silver)', flexShrink: 0 }} />
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Breadcrumb skeleton */}
      <div style={{ height: 12, width: 200, borderRadius: 6, background: 'var(--pearl)' }} />
      {/* Header skeleton */}
      <div className="card-static" style={{ padding: 20, display: 'flex', gap: 16 }}>
        <div style={{ height: 50, width: 50, borderRadius: 14, background: 'var(--pearl)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 20, width: 180, borderRadius: 6, background: 'var(--pearl)', marginBottom: 8 }} />
          <div style={{ height: 12, width: 280, borderRadius: 6, background: 'var(--ivory)' }} />
        </div>
      </div>
      {[240, 180, 220].map((h, i) => (
        <div key={i} className="card-static" style={{ padding: 20, height: h }}>
          <div style={{ height: 12, width: '60%', borderRadius: 6, background: 'var(--pearl)', marginBottom: 14 }} />
          <div style={{ height: 12, width: '80%', borderRadius: 6, background: 'var(--ivory)', marginBottom: 10 }} />
          <div style={{ height: 12, width: '70%', borderRadius: 6, background: 'var(--ivory)' }} />
        </div>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReimbursementDetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const toast     = useToast()

  const { state } = useGlobalStore()

  const [item,       setItem]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab,  setActiveTab]  = useState('timeline')  // 'timeline' | 'comments' | 'activity'

  // Modals
  const [editOpen,   setEditOpen]   = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [paidOpen,   setPaidOpen]   = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await reimbursementService.getById(id)
      if (!data) { navigate('/app/reimbursements'); return }
      setItem(data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  // ── Actions ──

  const handleApprove = async () => {
    try {
      const updated = await reimbursementService.approve(item.id)
      setItem(updated)
      toast.success('Approuvée', `${item.reference} a été approuvée.`)
    } catch { toast.error('Erreur', "Approbation échouée.") }
  }

  const handleReject = async (reason) => {
    setSubmitting(true)
    try {
      const updated = await reimbursementService.reject(item.id, reason)
      setItem(updated)
      toast.warning('Rejetée', `${item.reference} a été rejetée.`)
      setRejectOpen(false)
    } catch { toast.error('Erreur', 'Rejet échoué.') }
    finally { setSubmitting(false) }
  }

  const handleMarkPaid = async (payload) => {
    setSubmitting(true)
    try {
      const updated = await reimbursementService.markReimbursed(item.id, payload)
      setItem(updated)
      toast.success('Paiement enregistré', `${item.reference} mise à jour.`)
      setPaidOpen(false)
    } catch { toast.error('Erreur', 'Enregistrement échoué.') }
    finally { setSubmitting(false) }
  }

  const handleEdit = async (payload) => {
    setSubmitting(true)
    try {
      const updated = await reimbursementService.update(item.id, payload)
      setItem(updated)
      toast.success('Modifiée', 'Demande mise à jour.')
      setEditOpen(false)
    } catch { toast.error('Erreur', 'Modification échouée.') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer ${item.reference} ? Cette action est irréversible.`)) return
    try {
      await reimbursementService.delete(item.id)
      toast.info('Supprimée', `${item.reference} supprimée.`)
      navigate('/app/reimbursements')
    } catch { toast.error('Erreur', 'Suppression échouée.') }
  }

  const handleAddComment = async (text) => {
    try {
      const updated = await reimbursementService.addComment(item.id, text)
      setItem(updated)
    } catch { toast.error('Erreur', 'Commentaire non envoyé.') }
  }

  // ─── Loading ──

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <DetailSkeleton />
    </div>
  )

  if (!item) return null

  const approvedAmt = item.approved_amount ?? item.requested_amount
  const pct = approvedAmt > 0 ? Math.round((item.reimbursed_amount / approvedAmt) * 100) : 0

  const canApprove  = ['draft','pending'].includes(item.status)
  const canReject   = item.status !== 'rejected'
  const canPay      = ['approved','partial'].includes(item.status)
  const canEdit     = item.status !== 'reimbursed'

  // ── Cross-module lookups ──
  const numId      = parseInt(id, 10)
  const expenseRef = state.expenses.find(
    e => e.id === (item.expense_id ?? item.expense?.id)
  )
  const accEntries = state.accountingEntries.filter(
    e => e.source_module === 'reimbursement' && e.source_id === numId
  )

  // ─── Render ──

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => navigate('/app/reimbursements')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 12.5, color: 'var(--silver)', padding: 0,
            fontFamily: 'var(--font-sans)',
            transition: 'color .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
        >
          <ArrowLeft size={13} /> Remboursements
        </button>
        <span style={{ color: 'var(--pearl)' }}>/</span>
        <span style={{ fontSize: 12.5, color: 'var(--charcoal)', fontWeight: 500 }}>{item.reference}</span>
      </div>

      {/* ── Hero header card ── */}
      <div className="card-static" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          {/* Left: icon + title + badges */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: 'var(--accent-light)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CreditCard size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                  {item.reference}
                </h1>
                <ReimbursementStatusBadge status={item.status} size="lg" />
                <ReimbursementPriorityBadge priority={item.priority} />
                <SLABadge due_date={item.due_date} status={item.status} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.6 }}>
                {item.description}
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--silver)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <User size={11} /> {item.employee} · {item.team}
                </span>
                <span style={{ fontSize: 12, color: 'var(--silver)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> Demandé le {fmtDate(item.requested_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: action buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {canApprove && (
              <button
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={handleApprove}
              >
                <CheckCircle size={14} /> Approuver
              </button>
            )}
            {canPay && (
              <button
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--success)' }}
                onClick={() => setPaidOpen(true)}
              >
                <CreditCard size={14} /> Enregistrer paiement
              </button>
            )}
            {canReject && (
              <button
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger)' }}
                onClick={() => setRejectOpen(true)}
              >
                <XCircle size={14} /> Rejeter
              </button>
            )}
            {canEdit && (
              <button
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => setEditOpen(true)}
              >
                <Pencil size={14} /> Modifier
              </button>
            )}
            <button
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger)' }}
              onClick={handleDelete}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main grid: left col (2/3) + right col (1/3) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Amounts ── */}
          <Section title="Montants" icon={<CreditCard size={14} />}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <AmountCard label="Demandé"    value={item.requested_amount}  color="var(--ink)" />
              <AmountCard label="Approuvé"   value={item.approved_amount}   color="var(--success)" sub={item.approved_amount == null ? 'En attente' : undefined} />
              <AmountCard label="Remboursé"  value={item.reimbursed_amount} color="var(--accent)" />
              <AmountCard
                label="Restant"
                value={item.remaining_amount}
                color={item.remaining_amount > 0 ? 'var(--warn)' : 'var(--success)'}
                sub={item.remaining_amount === 0 ? 'Soldé ✓' : undefined}
              />
            </div>

            {/* Progress bar */}
            {item.approved_amount && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--silver)' }}>Progression du remboursement</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? 'var(--success)' : 'var(--accent)' }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 6, background: 'var(--pearl)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 6,
                    width: `${pct}%`,
                    background: pct === 100
                      ? 'var(--success)'
                      : 'linear-gradient(90deg, var(--accent) 0%, var(--accent-dim) 100%)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            )}
          </Section>

          {/* ── Rejection reason (if rejected) ── */}
          {item.status === 'rejected' && item.rejection_reason && (
            <div style={{
              display: 'flex', gap: 12, padding: '14px 18px', borderRadius: 12,
              background: 'var(--danger-bg)', border: '1px solid var(--danger-mid)',
            }}>
              <AlertTriangle size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>
                  Motif du rejet
                </p>
                <p style={{ fontSize: 13, color: 'var(--danger)', lineHeight: 1.6, opacity: 0.85 }}>
                  {item.rejection_reason}
                </p>
              </div>
            </div>
          )}

          {/* ── Linked expense ── */}
          {item.expense && (
            <Section title="Dépense liée" icon={<FileText size={14} />}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', borderRadius: 10,
                background: 'var(--ivory)', border: '1px solid var(--pearl)',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'var(--accent-light)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>{item.expense.id}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--slate)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.expense.title}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 2 }}>
                    {item.expense.category} · {fmt(item.expense.amount)}
                  </p>
                </div>
                <Link
                  to={`/app/expenses/${item.expense_id}`}
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 12, fontWeight: 500, color: 'var(--accent)',
                    textDecoration: 'none', flexShrink: 0,
                  }}
                >
                  Voir <ExternalLink size={11} />
                </Link>
              </div>
            </Section>
          )}

          {/* ── Attachments ── */}
          <Section
            title={`Pièces jointes (${item.attachments?.length ?? 0})`}
            icon={<Paperclip size={14} />}
            action={
              <button className="btn-secondary" style={{ fontSize: 11, height: 28 }}>
                + Ajouter
              </button>
            }
          >
            {(item.attachments?.length ?? 0) === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: 12.5, color: 'var(--silver)' }}>Aucune pièce jointe</p>
                <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 4, opacity: .7 }}>
                  Ajoutez des factures ou justificatifs.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {item.attachments.map(f => (
                  <AttachmentItem key={f.id} file={f} />
                ))}
              </div>
            )}
          </Section>

          {/* ── Timeline / Comments / Activity tabs ── */}
          <div className="card-static" style={{ overflow: 'hidden' }}>
            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--ivory)' }}>
              {[
                { key: 'timeline', label: 'Timeline',     icon: <Clock size={13} /> },
                { key: 'comments', label: `Commentaires (${item.comments?.length ?? 0})`, icon: <MessageSquare size={13} /> },
                { key: 'activity', label: 'Activité',     icon: <History size={13} /> },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '12px 18px', border: 'none', background: 'transparent', cursor: 'pointer',
                    fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--font-sans)',
                    color: activeTab === tab.key ? 'var(--accent)' : 'var(--silver)',
                    borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                    transition: 'all .15s',
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '20px' }}>
              {activeTab === 'timeline' && (
                <ReimbursementTimeline status={item.status} activity_log={item.activity_log} />
              )}
              {activeTab === 'comments' && (
                <ReimbursementComments
                  comments={item.comments}
                  onAddComment={handleAddComment}
                />
              )}
              {activeTab === 'activity' && (
                <ReimbursementActivityLog activity_log={item.activity_log} />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── General info ── */}
          <Section title="Informations générales" icon={<User size={14} />}>
            <InfoRow label="Référence"    value={item.reference} accent="var(--accent)" />
            <InfoRow label="Employé"      value={item.employee} />
            <InfoRow label="Équipe"       value={item.team} />
            <InfoRow label="Dépense liée" value={item.expense_id} />
            <InfoRow label="Description"  value={null} />
            <p style={{ fontSize: 12.5, color: 'var(--slate)', lineHeight: 1.6, paddingTop: 4 }}>
              {item.description}
            </p>
          </Section>

          {/* ── Payment info ── */}
          <Section title="Informations de paiement" icon={<CreditCard size={14} />}>
            <InfoRow label="Mode de paiement"
              value={item.payment_method ? PAYMENT_METHOD_LABELS[item.payment_method] : null} />
            <InfoRow label="Référence paiement" value={item.payment_reference} />
            <InfoRow label="Date demande"        value={fmtDate(item.requested_date)} />
            <InfoRow label="Date approbation"    value={fmtDate(item.approval_date)} />
            <InfoRow label="Date paiement"       value={fmtDate(item.reimbursement_date)} />
            <InfoRow label="Échéance"
              value={
                item.due_date
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {fmtDate(item.due_date)}
                      <SLABadge due_date={item.due_date} status={item.status} />
                    </span>
                  : null
              }
            />
          </Section>

          {/* ── Quick actions ── */}
          <div className="card-static" style={{ padding: '16px 18px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 12 }}>
              Actions rapides
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {canApprove && (
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={handleApprove}
                >
                  <CheckCircle size={14} /> Approuver la demande
                </button>
              )}
              {canPay && (
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--success)' }}
                  onClick={() => setPaidOpen(true)}
                >
                  <CreditCard size={14} /> Enregistrer un paiement
                </button>
              )}
              {canReject && (
                <button
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger)' }}
                  onClick={() => setRejectOpen(true)}
                >
                  <XCircle size={14} /> Rejeter
                </button>
              )}
              {canEdit && (
                <button
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil size={14} /> Modifier
                </button>
              )}
              <button
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger)' }}
                onClick={handleDelete}
              >
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>

          {/* ── Cross-module links ── */}
          <WorkflowActions
            title="Éléments liés"
            items={[
              expenseRef && {
                type:   'expense',
                ref:    expenseRef.reference,
                label:  expenseRef.title,
                sub:    `${expenseRef.category} · ${expenseRef.status}`,
                to:     `/app/expenses/${expenseRef.id}`,
                amount: expenseRef.amount,
              },
              ...accEntries.map(entry => ({
                type:   'accounting',
                ref:    entry.reference,
                label:  entry.description,
                sub:    `Débit ${entry.debit_account} / Crédit ${entry.credit_account}`,
                to:     '/app/accounting/journal',
                amount: entry.amount,
              })),
            ].filter(Boolean)}
          />
        </div>
      </div>

      {/* ── Modals ── */}
      <ReimbursementForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
        initialData={item}
        loading={submitting}
      />

      <RejectModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        reference={item.reference}
        loading={submitting}
      />

      <MarkReimbursedModal
        open={paidOpen}
        onClose={() => setPaidOpen(false)}
        onConfirm={handleMarkPaid}
        reimbursement={item}
        loading={submitting}
      />
    </div>
  )
}
