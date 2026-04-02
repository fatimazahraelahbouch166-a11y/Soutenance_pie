import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">

      {/* Vague blanche */}
      <svg
        className="footer-wave"
        viewBox="0 0 900 90"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L900,0 L900,20 Q720,90 540,55 Q360,20 180,65 Q90,88 0,60 Z"
          fill="#fff"
        />
      </svg>

      <div className="footer-container">

        {/* ── Col 1 : Brand ── */}
        <div className="footer-section">
          <h3>Bright Smile</h3>
          <p>
            L'excellence au service de votre sourire. Des soins dentaires de qualité
            supérieure dans un cadre luxueux et accueillant.
          </p>

          <div className="social-links">

            {/* Facebook */}
            <a href="#" className="social-link" title="Facebook" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                  fill="rgba(255,255,255,0.9)"
                />
              </svg>
            </a>

            {/* X / Twitter */}
            <a href="#" className="social-link" title="X" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="social-link" title="Instagram" aria-label="Instagram">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="rgba(255,255,255,0.9)" stroke="none" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="#" className="social-link" title="LinkedIn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" className="social-link" title="YouTube" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="2" y="5" width="20" height="14" rx="4"
                  fill="rgba(255,255,255,0.1)"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.5"
                />
                <polygon points="10,9 16,12 10,15" fill="rgba(255,255,255,0.9)" />
              </svg>
            </a>

          </div>
        </div>

        {/* ── Col 2 : Contact ── */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>45 Boulevard Anfa<br />20100 Casablanca, Maroc</p>
          <p>+212 5 22 00 11 22<br />+212 6 61 00 11 22</p>
          <p>contact@bright-smile.ma</p>
        </div>

        {/* ── Col 3 : Horaires ── */}
        <div className="footer-section">
          <h4>Horaires</h4>
          <p>Lun – Ven : 9h – 13h / 15h – 19h</p>
          <p>Samedi : 9h – 13h</p>
          <p>Dimanche : Fermé</p>
        </div>

        {/* ── Col 4 : Liens ── */}
        <div className="footer-section">
          <h4>Liens utiles</h4>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Conditions d'utilisation</a>
          <a href="#">Mentions légales</a>
        </div>

      </div>

      {/* ── Copyright centré ── */}
      <div className="footer-bottom">
        <p>&copy; 2026 Bright Smile. Tous droits réservés.</p>
      </div>

    </footer>
  );
};

export default Footer;