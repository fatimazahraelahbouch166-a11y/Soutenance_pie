// src/pages/dentiste/Ordonnances.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addOrdonnance } from '../../redux/dentisteActions';

const MEDICAMENTS_COMMUNS = [
  'Paracétamol 1g — 3x/jour pendant 5 jours',
  'Ibuprofène 400mg — après repas si douleur, max 3/jour',
  'Amoxicilline 1g — 2x/jour pendant 7 jours',
  'Amoxicilline + Acide clavulanique 1g — 2x/jour 7 jours',
  'Métronidazole 500mg — 3x/jour pendant 7 jours',
  'Chlorhexidine 0.12% bain de bouche — 2x/jour',
  'Gel fluoré — application quotidienne',
  'Ibuprofène 600mg — 3x/jour pendant 3 jours',
];

export default function Ordonnances() {
  const dispatch    = useDispatch();
  const dossiers    = useSelector(s => s.dossiers?.liste || []);
  const ordonnances = useSelector(s => s.ordonnances?.liste || []);

  const [form, setForm] = useState({ patient_id: '', medicaments: '', notes: '' });
  const [enregistre, setEnregistre] = useState(false);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const ajouterMedicament = (med) => {
    setForm(f => ({ ...f, medicaments: f.medicaments ? `${f.medicaments}\n${med}` : med }));
  };

  const soumettre = () => {
    if (!form.patient_id || !form.medicaments.trim()) return;
    const p = dossiers.find(d => d.id === Number(form.patient_id));
    dispatch(addOrdonnance({ patient: p?.nom || 'Inconnu', medicaments: form.medicaments, notes: form.notes }));
    setEnregistre(true);
    setForm({ patient_id: '', medicaments: '', notes: '' });
    setTimeout(() => setEnregistre(false), 2500);
  };

  return (
    <div>
      <div className="den-page-header">
        <div className="den-page-label">Ordonnances</div>
        <h1 className="den-page-title">Rédiger une <em>ordonnance</em></h1>
        <p className="den-page-sub">Génération et archivage des prescriptions</p>
      </div>

      <div className="den-grid-2">
        {/* Formulaire */}
        <div className="den-card">
          <div className="den-card-title">Nouvelle ordonnance</div>

          <div className="den-form-group">
            <label className="den-form-label">Patient *</label>
            <select className="den-form-control" name="patient_id" value={form.patient_id} onChange={onChange}>
              <option value="">-- Sélectionner un patient --</option>
              {dossiers.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
            </select>
          </div>

          {/* Médicaments communs */}
          <div className="den-form-group">
            <label className="den-form-label">Ajouter rapidement</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {MEDICAMENTS_COMMUNS.map(med => (
                <button key={med} onClick={() => ajouterMedicament(med)}
                  style={{ textAlign: 'left', background: 'var(--den-bg)', border: '0.5px solid var(--den-border)', borderRadius: 6, padding: '6px 10px', fontSize: 11, color: 'var(--den-dark)', cursor: 'pointer', transition: 'all .15s' }}
                  onMouseEnter={e => { e.target.style.background = 'var(--den-red-light)'; e.target.style.color = 'var(--den-red)'; }}
                  onMouseLeave={e => { e.target.style.background = 'var(--den-bg)'; e.target.style.color = 'var(--den-dark)'; }}
                >
                  + {med}
                </button>
              ))}
            </div>
          </div>

          <div className="den-form-group">
            <label className="den-form-label">Prescription complète *</label>
            <textarea className="den-form-control" name="medicaments" value={form.medicaments} onChange={onChange}
              placeholder="Rédigez ou cliquez sur les médicaments ci-dessus..." style={{ minHeight: 120, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7 }} />
          </div>

          <div className="den-form-group">
            <label className="den-form-label">Instructions particulières</label>
            <input className="den-form-control" name="notes" value={form.notes} onChange={onChange}
              placeholder="ex: Prendre après les repas, éviter l'alcool..." />
          </div>

          {enregistre ? (
            <div style={{ background: 'var(--den-green-light)', color: 'var(--den-green)', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 500, textAlign: 'center' }}>
              ✓ Ordonnance créée et archivée !
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="den-btn-primary" onClick={soumettre} style={{ flex: 1 }}>📝 Créer l'ordonnance</button>
              <button className="den-btn-secondary" onClick={() => setForm({ patient_id: '', medicaments: '', notes: '' })}>Effacer</button>
            </div>
          )}
        </div>

        {/* Ordonnances récentes */}
        <div className="den-card">
          <div className="den-card-title">Ordonnances récentes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ordonnances.map(o => (
              <div key={o.id} style={{ padding: '12px 14px', background: 'var(--den-bg)', borderRadius: 10, borderLeft: '3px solid var(--den-red)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--den-dark)' }}>{o.patient}</div>
                    <div style={{ fontSize: 10, color: 'var(--den-muted)' }}>{o.numero} — {o.date}</div>
                  </div>
                  <button className="den-btn-icon" title="Télécharger PDF">📄</button>
                </div>
                <div style={{ fontSize: 11, color: 'var(--den-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {o.medicaments.length > 120 ? o.medicaments.slice(0, 120) + '...' : o.medicaments}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}