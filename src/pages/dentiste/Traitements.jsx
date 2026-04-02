// src/pages/dentiste/Traitements.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addActe } from '../../redux/dentisteActions';

const ACTES_CATALOGUE = [
  'Détartrage', 'Polissage', 'Obturation composite', 'Obturation amalgame',
  'Couronne céramique', 'Couronne provisoire', 'Extraction simple',
  'Extraction chirurgicale', 'Implant (pose)', 'Implant (suivi)',
  'Blanchiment', 'Radiographie rétro-alvéolaire', 'Panoramique',
  'Détartrage + polissage', 'Traitement canalaire',
];

function NouvelActeModal({ onClose }) {
  const dispatch = useDispatch();
  const dossiers = useSelector(s => s.dossiers?.liste || []);
  const [form, setForm] = useState({ patient_id: '', acte: '', dent: '', notes: '' });
  const onChange  = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const soumettre = () => {
    if (!form.patient_id || !form.acte) return;
    const p = dossiers.find(d => d.id === Number(form.patient_id));
    dispatch(addActe({ ...form, patient: p?.nom || 'Inconnu' }));
    onClose();
  };

  return (
    <div className="den-modal-overlay">
      <div className="den-modal-box">
        <div className="den-card-title" style={{ marginBottom: 18 }}>
          Enregistrer un acte <button className="den-card-action" onClick={onClose}>✕</button>
        </div>
        <div className="den-form-group">
          <label className="den-form-label">Patient *</label>
          <select className="den-form-control" name="patient_id" value={form.patient_id} onChange={onChange}>
            <option value="">-- Sélectionner --</option>
            {dossiers.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
          </select>
        </div>
        <div className="den-form-group">
          <label className="den-form-label">Acte réalisé *</label>
          <select className="den-form-control" name="acte" value={form.acte} onChange={onChange}>
            <option value="">-- Sélectionner --</option>
            {ACTES_CATALOGUE.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div className="den-form-group">
          <label className="den-form-label">Dent(s) concernée(s)</label>
          <input className="den-form-control" name="dent" value={form.dent} onChange={onChange} placeholder="ex: 36, 37 — laisser vide si non applicable" />
        </div>
        <div className="den-form-group">
          <label className="den-form-label">Notes</label>
          <textarea className="den-form-control" name="notes" value={form.notes} onChange={onChange} placeholder="Observations post-acte..." />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="den-btn-primary" onClick={soumettre} style={{ flex: 1 }}>Enregistrer l'acte</button>
          <button className="den-btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default function Traitements() {
  const dispatch      = useDispatch();
  const dossiers      = useSelector(s => s.dossiers?.liste || []);
  const actes         = useSelector(s => s.traitements?.actes_realises || []);
  const [showModal, setModal] = useState(false);

  // Plans de traitement actifs extraits des dossiers
  const plansActifs = dossiers.flatMap(d =>
    d.traitements
      .filter(t => t.statut === 'en_cours')
      .map(t => ({ ...t, patient: d.nom }))
  );

  return (
    <div>
      <div className="den-page-header">
        <div className="den-page-label">Traitements</div>
        <h1 className="den-page-title">Plans & <em>actes</em></h1>
        <p className="den-page-sub">Suivi des traitements multi-séances et actes réalisés</p>
      </div>

      <div className="den-grid-2">
        {/* Plans de traitement en cours */}
        <div className="den-card">
          <div className="den-card-title">Plans de traitement actifs</div>
          {plansActifs.length === 0
            ? <p style={{ fontSize: 13, color: 'var(--den-muted)', textAlign: 'center', padding: 20 }}>Aucun plan actif.</p>
            : plansActifs.map((t, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: '0.5px solid var(--den-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--den-dark)' }}>{t.patient}</div>
                      <div style={{ fontSize: 12, color: 'var(--den-muted)' }}>{t.intitule}</div>
                    </div>
                    <span className="den-badge den-badge-en_cours">En cours</span>
                  </div>
                  {t.seances && (
                    <>
                      <div style={{ fontSize: 11, color: 'var(--den-muted)', marginBottom: 4 }}>
                        Séance {t.seance_actuelle}/{t.seances} — Début : {t.date_debut}
                      </div>
                      <div className="den-progress-bar">
                        <div className="den-progress-fill" style={{ width: `${Math.round((t.seance_actuelle / t.seances) * 100)}%` }} />
                      </div>
                    </>
                  )}
                </div>
              ))
          }
        </div>

        {/* Enregistrer un acte */}
        <div className="den-card">
          <div className="den-card-title">
            Actes réalisés aujourd'hui
            <button className="den-btn-primary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setModal(true)}>
              + Ajouter un acte
            </button>
          </div>
          {actes.length === 0
            ? <p style={{ fontSize: 13, color: 'var(--den-muted)', textAlign: 'center', padding: 30 }}>Aucun acte enregistré aujourd'hui.</p>
            : actes.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '0.5px solid var(--den-border)' }}>
                  <div style={{ width: 36, height: 36, background: 'var(--den-red-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🦷</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--den-dark)' }}>{a.patient}</div>
                    <div style={{ fontSize: 11, color: 'var(--den-muted)' }}>{a.acte}{a.dent ? ` — Dent ${a.dent}` : ''}</div>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--den-muted)' }}>{a.date}</div>
                </div>
              ))
          }
        </div>
      </div>

      {showModal && <NouvelActeModal onClose={() => setModal(false)} />}
    </div>
  );
}