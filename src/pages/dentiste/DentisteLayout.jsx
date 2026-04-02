// src/pages/dentiste/DentisteLayout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authActions';
import './dentiste.css';

const LINKS = [
  { to: '/dentiste',               icon: '📅', label: 'Mon planning'      },
  { to: '/dentiste/dossiers',      icon: '📋', label: 'Dossiers médicaux' },
  { to: '/dentiste/traitements',   icon: '🦷', label: 'Traitements'       },
  { to: '/dentiste/ordonnances',   icon: '📝', label: 'Ordonnances'       },
  { to: '/dentiste/statistiques',  icon: '📊', label: 'Statistiques'      },
];

export default function DentisteLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(s => s.auth?.user);

  const initiales = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : 'DR';

  return (
    <div className="den-layout">

      {/* ── Navbar ── */}
      <nav className="den-navbar">
        <div className="den-navbar-brand">
          <div className="den-navbar-logo">BS</div>
          <div className="den-navbar-title">Bright <em>Smile</em></div>
        </div>
        <div className="den-navbar-right">
          <div className="den-avatar">{initiales}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--den-dark)' }}>
              {user?.name || 'Dr. Benali'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--den-muted)' }}>Chirurgien-dentiste</div>
          </div>
        </div>
      </nav>

      <div className="den-body">

        {/* ── Sidebar ── */}
        <aside className="den-sidebar">
          <div className="den-sidebar-label">Navigation</div>
          {LINKS.map(({ to, icon, label }) => (
            <NavLink
              key={to} to={to} end={to === '/dentiste'}
              className={({ isActive }) => `den-nav-link${isActive ? ' den-active' : ''}`}
            >
              <span className="den-nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
          <div style={{ flex: 1 }} />
          <div className="den-sidebar-label">Compte</div>
          <button
            className="den-nav-link"
            onClick={() => { dispatch(logout()); navigate('/login'); }}
            style={{ color: 'var(--den-red)' }}
          >
            <span className="den-nav-icon">🚪</span> Déconnexion
          </button>
        </aside>

        {/* ── Contenu ── */}
        <main className="den-main">
          <Outlet />
        </main>

      </div>
    </div>
  );
}