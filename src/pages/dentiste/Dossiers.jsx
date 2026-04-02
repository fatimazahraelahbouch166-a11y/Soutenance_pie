// src/pages/dentiste/Dossiers.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPatientActif, addConsultation } from '../../redux/dentisteActions';

const initiales = nom => nom.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

const TABS = [
  { id: 'infos',         label: 'Infos' },
  { id: 'antecedents',   label: 'Antécédents' },
  { id: 'consultations', label: 'Consultations' },
  { id: 'traitements',   label: 'Traitements' },
];

function NouvelleConsultationModal({ patient, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ motif: '', diagnostic: '', notes: '' });
  const onChange  = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const soumettre = () => {
    if (!form.motif.trim()) return;
    dispatch(addConsultation({ ...form, patient_id: patient.id }));
    onClose();
  };

  return (
    <div className="den-modal-overlay">
      <div className="den-modal-box">
        <div className="den-card-title" style={{ marginBottom: 18 }}>
          Nouvelle consultation — {patient.nom}
          <button className="den-card-action" onClick={onClose}>✕</button>
        </div>
        {[
          { name: 'motif',      label: 'Motif *',      tag: 'input'    },
          { name: 'diagnostic', label: 'Diagnostic',   tag: 'input'    },
          { name: 'notes',      label: 'Notes cliniques', tag: 'textarea' },
        ].map(({ name, label, tag }) => (
          <div className="den-form-group" key={name}>
            <label className="den-form-label">{label}</label>
            {tag === 'input'
              ? <input className="den-form-control" name={name} value={form[name]} onChange={onChange} placeholder={label.replace(' *', '')} />
              : <textarea className="den-form-control" name={name} value={form[name]} onChange={onChange} placeholder="Observations, prescriptions..." />
            }
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="den-btn-primary" onClick={soumettre} style={{ flex: 1 }}>Enregistrer</button>
          <button className="den-btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default function Dossiers() {
  const dispatch       = useDispatch();
  const { liste, patientActif } = useSelector(s => s.dossiers);
  const [recherche, setRecherche]     = useState('');
  const [tabActive, setTab]           = useState('infos');
  const [showModal, setModal]         = useState(false);

  const filtres = recherche
    ? liste.filter(p => p.nom.toLowerCase().includes(recherche.toLowerCase()))
    : liste;

  const dossier = patientActif ? liste.find(d => d.id === patientActif.id) : null;

  return (
    <div>
      <div className="den-page-header">
        <div className="den-page-label">Dossiers médicaux</div>
        <h1 className="den-page-title">Mes <em>patients</em></h1>
        <p className="den-page-sub">Consultation et gestion des dossiers</p>
      </div>

      <div className="den-grid-2">
        {/* Liste patients */}
        <div>
          <div className="den-search-bar">
            <input className="den-input" placeholder="🔍 Rechercher un patient..."
              value={recherche} onChange={e => setRecherche(e.target.value)} />
          </div>
          <div className="den-card">
            <div className="den-card-title">Patients ({filtres.length})</div>
            <div className="den-patient-list">
              {filtres.map(p => (
                <div
                  key={p.id}
                  className="den-patient-row"
                  onClick={() => { dispatch(setPatientActif(p)); setTab('infos'); }}
                  style={{ background: patientActif?.id === p.id ? 'var(--den-red-light)' : undefined }}
                >
                  <div className="den-pat-avatar">{initiales(p.nom)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--den-dark)' }}>{p.nom}</div>
                    <div style={{ fontSize: 11, color: 'var(--den-muted)' }}>
                      {p.age} ans
                      {p.allergies && <span style={{ color: 'var(--den-red)', marginLeft: 6 }}>⚠ {p.allergies}</span>}
                    </div>
                  </div>
                  {patientActif?.id === p.id && (
                    <span style={{ fontSize: 10, color: 'var(--den-red)', fontWeight: 500 }}>Ouvert</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dossier détail */}
        <div>
          {dossier ? (
            <div className="den-card">
              <div className="den-card-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="den-pat-avatar" style={{ width: 38, height: 38, fontSize: 13 }}>{initiales(dossier.nom)}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{dossier.nom}</div>
                    <div style={{ fontSize: 11, color: 'var(--den-muted)' }}>{dossier.age} ans — {dossier.groupe_sanguin}</div>
                  </div>
                </div>
                <button className="den-btn-primary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setModal(true)}>
                  + Consultation
                </button>
              </div>

              {/* Onglets */}
              <div className="den-tab-bar">
                {TABS.map(t => (
                  <button key={t.id} className={`den-tab ${tabActive === t.id ? 'den-tab-active' : ''}`} onClick={() => setTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab: Infos */}
              {tabActive === 'infos' && (
                <>
                  <div className="den-info-row"><span className="den-info-key">Téléphone</span><span className="den-info-val">{dossier.telephone}</span></div>
                  <div className="den-info-row"><span className="den-info-key">Email</span><span className="den-info-val">{dossier.email}</span></div>
                  <div className="den-info-row"><span className="den-info-key">Groupe sanguin</span><span className="den-info-val">{dossier.groupe_sanguin}</span></div>
                  <div className="den-info-row">
                    <span className="den-info-key">Allergie</span>
                    <span className={`den-info-val ${dossier.allergies ? 'danger' : ''}`}>
                      {dossier.allergies ? `⚠ ${dossier.allergies}` : 'Aucune'}
                    </span>
                  </div>
                </>
              )}

              {/* Tab: Antécédents */}
              {tabActive === 'antecedents' && (
                <div style={{ fontSize: 13, color: 'var(--den-dark)', lineHeight: 1.7, background: 'var(--den-bg)', padding: 14, borderRadius: 8 }}>
                  {dossier.antecedents || 'Aucun antécédent renseigné.'}
                </div>
              )}

              {/* Tab: Consultations */}
              {tabActive === 'consultations' && (
                <div className="den-timeline">
                  {dossier.consultations.length === 0
                    ? <p style={{ fontSize: 13, color: 'var(--den-muted)', textAlign: 'center', padding: 20 }}>Aucune consultation enregistrée.</p>
                    : dossier.consultations.map(c => (
                        <div key={c.id} className="den-timeline-item">
                          <div className="den-timeline-dot done" />
                          <div className="den-timeline-body">
                            <div className="den-timeline-title">{c.motif}</div>
                            <div className="den-timeline-date">{c.date}</div>
                            {c.diagnostic && <div style={{ fontSize: 12, color: 'var(--den-muted)', marginTop: 3 }}>Diagnostic : {c.diagnostic}</div>}
                            {c.notes      && <div style={{ fontSize: 12, color: 'var(--den-muted)', marginTop: 2 }}>{c.notes}</div>}
                          </div>
                        </div>
                      ))
                  }
                </div>
              )}

              {/* Tab: Traitements */}
              {tabActive === 'traitements' && (
                <div className="den-timeline">
                  {dossier.traitements.length === 0
                    ? <p style={{ fontSize: 13, color: 'var(--den-muted)', textAlign: 'center', padding: 20 }}>Aucun traitement en cours.</p>
                    : dossier.traitements.map(t => (
                        <div key={t.id} className="den-timeline-item">
                          <div className={`den-timeline-dot ${t.statut === 'termine' ? 'done' : ''}`} />
                          <div className="den-timeline-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div className="den-timeline-title">{t.intitule}</div>
                              <span className={`den-badge den-badge-${t.statut}`}>
                                {t.statut === 'termine' ? 'Terminé' : 'En cours'}
                              </span>
                            </div>
                            <div className="den-timeline-date">Début : {t.date_debut}</div>
                            {t.seances && (
                              <>
                                <div style={{ fontSize: 11, color: 'var(--den-muted)', marginTop: 4 }}>
                                  Séance {t.seance_actuelle}/{t.seances}
                                </div>
                                <div className="den-progress-bar">
                                  <div className="den-progress-fill" style={{ width: `${Math.round((t.seance_actuelle / t.seances) * 100)}%` }} />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                  }
                </div>
              )}
            </div>
          ) : (
            <div className="den-card" style={{ textAlign: 'center', padding: 60, color: 'var(--den-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <p style={{ fontSize: 14 }}>Sélectionnez un patient pour voir son dossier</p>
            </div>
          )}
        </div>
      </div>

      {showModal && dossier && <NouvelleConsultationModal patient={dossier} onClose={() => setModal(false)} />}
    </div>
  );
}