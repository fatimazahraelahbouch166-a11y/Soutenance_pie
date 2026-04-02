// src/pages/dentiste/Planning.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPatientActif } from '../../redux/dentisteActions';
import { useNavigate } from 'react-router-dom';

const STATUT_CFG = {
  confirmed: { classe: 'confirmed', badge: 'den-badge-confirmed', label: 'Confirmé'  },
  pending:   { classe: 'pending',   badge: 'den-badge-pending',   label: 'En attente' },
  urgent:    { classe: 'urgent',    badge: 'den-badge-urgent',    label: 'Urgence'    },
  done:      { classe: 'done',      badge: 'den-badge-done',      label: 'Terminé'    },
};

// Mini calendrier mock
const JOURS = ['Lun 31','Mar 1','Mer 2','Jeu 3','Ven 4'];
const HEURES = ['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00'];
const RDV_SEMAINE = {
  'Lun 31-09:00': 'Tazi A.',    'Lun 31-14:00': 'El Fassi Y.',
  'Mar 1-09:00':  'Urgence',    'Mar 1-11:00': 'Chkouri S.',
  'Mer 2-10:00':  'Rachidi H.', 'Mer 2-15:00': 'Mansouri K.',
  'Jeu 3-09:00':  'Berrada N.', 'Ven 4-10:00': 'Zaki R.',
};

export default function Planning() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const planning  = useSelector(s => s.planning?.liste || []);
  const [vue, setVue]             = useState('jour');
  const [rdvSelectionne, setRdv]  = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const rdvDuJour = planning.filter(r => r.date === today);
  const dateLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const ouvrirDossier = (rdv) => {
    const dossier = { id: rdv.id, nom: rdv.patient };
    dispatch(setPatientActif(dossier));
    navigate('/dentiste/dossiers');
  };

  return (
    <div>
      <div className="den-page-header">
        <div className="den-page-label">Planning</div>
        <h1 className="den-page-title">Mon <em>agenda</em></h1>
        <p className="den-page-sub">{dateLabel}</p>
      </div>

      {/* KPIs */}
      <div className="den-stats-grid">
        <div className="den-stat-card">
          <div className="den-stat-val">{rdvDuJour.length}</div>
          <div className="den-stat-lbl">RDV aujourd'hui</div>
          <div className="den-stat-delta den-delta-up">{rdvDuJour.filter(r => r.statut === 'confirmed').length} confirmés</div>
        </div>
        <div className="den-stat-card">
          <div className="den-stat-val">{rdvDuJour.filter(r => r.statut === 'done').length}</div>
          <div className="den-stat-lbl">Consultations terminées</div>
          <div className="den-stat-delta den-delta-up">Aujourd'hui</div>
        </div>
        <div className="den-stat-card">
          <div className="den-stat-val" style={{ color: rdvDuJour.filter(r => r.statut === 'urgent').length > 0 ? 'var(--den-red)' : undefined }}>
            {rdvDuJour.filter(r => r.statut === 'urgent').length}
          </div>
          <div className="den-stat-lbl">Urgences</div>
          <div className={`den-stat-delta ${rdvDuJour.filter(r => r.statut === 'urgent').length > 0 ? 'den-delta-danger' : 'den-delta-up'}`}>
            {rdvDuJour.filter(r => r.statut === 'urgent').length > 0 ? 'À traiter' : 'Aucune'}
          </div>
        </div>
        <div className="den-stat-card">
          <div className="den-stat-val">2<span>h30</span></div>
          <div className="den-stat-lbl">Temps restant</div>
          <div className="den-stat-delta den-delta-warn">Chargé</div>
        </div>
      </div>

      {/* Sélecteur vue */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['jour','semaine'].map(v => (
            <button key={v} className={`den-btn-secondary ${vue === v ? 'den-btn-active' : ''}`} onClick={() => setVue(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Vue jour ── */}
      {vue === 'jour' && (
        <div className="den-grid-2">
          <div className="den-card">
            <div className="den-card-title">RDV du jour</div>
            <div className="den-rdv-list">
              {rdvDuJour.map(rdv => {
                const cfg = STATUT_CFG[rdv.statut] || STATUT_CFG.pending;
                return (
                  <div key={rdv.id} className={`den-rdv-item ${cfg.classe}`} onClick={() => setRdv(rdvSelectionne?.id === rdv.id ? null : rdv)}>
                    <div className="den-rdv-time">{rdv.heure}</div>
                    <div className="den-rdv-info">
                      <div className="den-rdv-patient">{rdv.patient}</div>
                      <div className="den-rdv-motif">{rdv.motif}</div>
                      {rdv.allergies && <div className="den-rdv-alert">⚠ {rdv.allergies}</div>}
                    </div>
                    <span className={`den-badge ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Détail RDV sélectionné */}
          <div className="den-card">
            {rdvSelectionne ? (
              <>
                <div className="den-card-title">
                  Détail — {rdvSelectionne.patient}
                  <button className="den-card-action" onClick={() => setRdv(null)}>✕</button>
                </div>
                <div className="den-info-row"><span className="den-info-key">Heure</span><span className="den-info-val">{rdvSelectionne.heure}</span></div>
                <div className="den-info-row"><span className="den-info-key">Motif</span><span className="den-info-val">{rdvSelectionne.motif}</span></div>
                <div className="den-info-row"><span className="den-info-key">Statut</span><span className={`den-badge den-badge-${rdvSelectionne.statut}`}>{STATUT_CFG[rdvSelectionne.statut]?.label}</span></div>
                {rdvSelectionne.allergies && (
                  <div className="den-info-row"><span className="den-info-key">Allergie</span><span className="den-info-val danger">⚠ {rdvSelectionne.allergies}</span></div>
                )}
                {rdvSelectionne.antecedents && (
                  <div className="den-info-row"><span className="den-info-key">Antécédents</span><span className="den-info-val">{rdvSelectionne.antecedents}</span></div>
                )}
                <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                  <button className="den-btn-primary" onClick={() => ouvrirDossier(rdvSelectionne)}>Ouvrir le dossier</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--den-muted)', fontSize: 13 }}>
                Cliquez sur un RDV pour voir le détail
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Vue semaine ── */}
      {vue === 'semaine' && (
        <div className="den-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '55px repeat(5,1fr)', border: '0.5px solid var(--den-border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: 'var(--den-bg)', borderBottom: '0.5px solid var(--den-border)', padding: '8px 4px' }} />
            {JOURS.map((j, i) => (
              <div key={j} style={{ background: 'var(--den-bg)', borderBottom: '0.5px solid var(--den-border)', padding: '8px 4px', textAlign: 'center', fontSize: 11, fontWeight: 500, color: i === 1 ? 'var(--den-red)' : 'var(--den-muted)' }}>{j}</div>
            ))}
            {HEURES.map(h => (
              <React.Fragment key={h}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44, borderBottom: '0.5px solid var(--den-border)', fontSize: 10, color: 'var(--den-muted)', background: 'var(--den-bg)' }}>{h}</div>
                {JOURS.map(j => {
                  const label = RDV_SEMAINE[`${j}-${h}`];
                  return (
                    <div key={j} style={{ height: 44, borderBottom: '0.5px solid var(--den-border)', borderRight: '0.5px solid var(--den-border)', padding: '3px 4px', cursor: 'pointer' }}>
                      {label && (
                        <div style={{ background: label === 'Urgence' ? 'var(--den-red)' : 'var(--den-green)', color: '#fff', borderRadius: 4, padding: '2px 5px', fontSize: 10, height: '100%', overflow: 'hidden' }}>
                          {label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}