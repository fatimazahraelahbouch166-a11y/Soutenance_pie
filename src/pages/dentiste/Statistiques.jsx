// src/pages/dentiste/Statistiques.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const MAX_BAR = 38700;

export default function Statistiques() {
  const stats = useSelector(s => s.stats);

  return (
    <div>
      <div className="den-page-header">
        <div className="den-page-label">Statistiques</div>
        <h1 className="den-page-title">Mes <em>performances</em></h1>
        <p className="den-page-sub">Tableau de bord personnel — Avril 2025</p>
      </div>

      {/* KPIs */}
      <div className="den-stats-grid">
        <div className="den-stat-card">
          <div className="den-stat-val">{stats.patients_mois}</div>
          <div className="den-stat-lbl">Patients ce mois</div>
          <div className="den-stat-delta den-delta-up">+18% vs mars</div>
        </div>
        <div className="den-stat-card">
          <div className="den-stat-val">{(stats.ca_mois / 1000).toFixed(0)}<span>K</span></div>
          <div className="den-stat-lbl">Chiffre d'affaires (MAD)</div>
          <div className="den-stat-delta den-delta-up">+12% vs mars</div>
        </div>
        <div className="den-stat-card">
          <div className="den-stat-val">{stats.taux_presence}<span>%</span></div>
          <div className="den-stat-lbl">Taux de présence</div>
          <div className="den-stat-delta den-delta-up">Excellent</div>
        </div>
        <div className="den-stat-card">
          <div className="den-stat-val">{stats.satisfaction}</div>
          <div className="den-stat-lbl">Satisfaction patients</div>
          <div className="den-stat-delta den-delta-up">/ 5 ⭐</div>
        </div>
      </div>

      <div className="den-grid-2">
        {/* Actes les plus pratiqués */}
        <div className="den-card">
          <div className="den-card-title">Actes les plus pratiqués</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.actes.map(a => (
              <div key={a.nom} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--den-muted)', width: 110, textAlign: 'right' }}>{a.nom}</div>
                <div style={{ flex: 1, height: 8, background: 'var(--den-border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${a.pct}%`, height: '100%', background: 'var(--den-red)', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--den-dark)', minWidth: 28 }}>{a.nb}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recettes par mois */}
        <div className="den-card">
          <div className="den-card-title">Recettes mensuelles (MAD)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 140, padding: '0 8px' }}>
            {stats.recettes.map((r, i) => (
              <div key={r.mois} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--den-muted)' }}>{(r.v / 1000).toFixed(0)}K</div>
                <div style={{
                  width: '100%',
                  height: `${Math.round((r.v / MAX_BAR) * 100)}px`,
                  background: i === stats.recettes.length - 1 ? 'var(--den-red-mid)' : 'var(--den-red)',
                  borderRadius: '4px 4px 0 0',
                }} />
                <div style={{ fontSize: 11, color: 'var(--den-muted)' }}>{r.mois}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Résumé textuel */}
      <div className="den-card">
        <div className="den-card-title">Résumé du mois</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { label: 'Acte le plus fréquent',  valeur: 'Détartrage (48 actes)',       icon: '🏆' },
            { label: 'Meilleur jour',           valeur: 'Mardi (28 consultations)',    icon: '📅' },
            { label: 'Patient fidèle',          valeur: 'Amina Tazi (5 visites)',      icon: '⭐' },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--den-bg)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--den-dark)', marginBottom: 4 }}>{item.valeur}</div>
              <div style={{ fontSize: 11, color: 'var(--den-muted)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}