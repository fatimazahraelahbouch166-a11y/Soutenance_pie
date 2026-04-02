import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authActions';
import '../styles/Navbar.css';

/* ── SVG Tooth icon (fallback logo) ── */
const ToothIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C9 2 6 4 6 7c0 2 .5 3.5 1 5l1 6c.2 1 1 2 2 2h4c1 0 1.8-1 2-2l1-6c.5-1.5 1-3 1-5 0-3-3-5-6-5Z"/>
  </svg>
);

/* ── Cart SVG ── */
const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const Navbar = ({ logoSrc = null }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => dispatch(logout());

  const toggleCart = () => {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) cartSidebar.classList.toggle('active');
  };

  const links = [
    { label: 'Accueil',          to: '/'             },
    { label: 'A propos',         to: '/about'        },
    { label: 'Services',         to: '/services'     },
    { label: 'Mes Reservations', to: '/reservations' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="nav-container">

        <Link to="/" className="nav-logo">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo Sourire Excellence" className="nav-logo-img" />
          ) : (
            <div className="nav-logo-circle">
              <ToothIcon />
            </div>
          )}
          <div className="nav-logo-text">
            <span className="nav-logo-name">BRIGHT SMILE</span>
            <span className="nav-logo-tagline">Clinique Dentaire</span>
          </div>
        </Link>

        <div className={`nav-menu${menuOpen ? ' open' : ''}`}>
          {links.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link${location.pathname === to ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}

          <div className="cart-icon" onClick={toggleCart} role="button" aria-label="Panier">
            <CartIcon />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </div>

          {isAuthenticated ? (
            <div className="nav-auth">
              <span className="user-name">Bonjour, {user?.name}</span>
              <button onClick={handleLogout} className="btn-nav-outline">
                Deconnexion
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-nav">
              Connexion
            </Link>
          )}
        </div>

        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Ouvrir le menu"
        >
          <span /><span /><span />
        </button>

      </div>
    </nav>
  );
};

export default Navbar;