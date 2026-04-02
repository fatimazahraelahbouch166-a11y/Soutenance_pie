import React from 'react';
import '../styles/About.css';

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.81 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconCar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17H5v-5l2-6h10l2 6v5Z"/>
    <circle cx="7.5" cy="17.5" r="1.5"/>
    <circle cx="16.5" cy="17.5" r="1.5"/>
    <path d="M5 12h14"/>
  </svg>
);

/* ── Composant ── */
const About = () => {
  return (
    <div className="about-page">
      <section className="about-section">

        {/* ── Header ── */}
        <div className="section-header">
          <div className="section-badge">Notre Histoire</div>
          <h2 className="section-title">
            À propos <em>de nous</em>
          </h2>
          <p className="section-subtitle">
            Une passion pour l'excellence dentaire depuis plus de 20 ans
          </p>
        </div>

       

        {/* ── Mission & valeurs ── */}
        <div className="about-grid">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&q=85"
              alt="Notre cabinet dentaire à Casablanca"
            />
          </div>
          <div className="about-text">
            <h2>Notre mission</h2>
            <p>
              Depuis notre création, nous nous engageons à offrir des soins dentaires d'exception
              en combinant expertise médicale, technologies avancées et approche humaine.
              Chaque patient bénéficie d'un traitement personnalisé dans un environnement
              moderne et apaisant.
            </p>

            <h2>Nos valeurs</h2>
            <ul className="values-list">
              <li>Excellence et précision dans chaque intervention</li>
              <li>Écoute attentive et accompagnement personnalisé</li>
              <li>Innovation et formation continue</li>
              <li>Éthique professionnelle irréprochable</li>
            </ul>
          </div>
        </div>

        {/* ── Localisation ── */}
        <div className="location-section">
          <div className="section-header">
            <div className="section-badge">Nous Trouver</div>
            <h2 className="section-title">
              Notre <em>emplacement</em>
            </h2>
            <p className="section-subtitle">
              Un cabinet moderne au cœur de Casablanca, facilement accessible
            </p>
          </div>

          <div className="location-container">
            <div className="location-info">
              <h3>Informations pratiques</h3>

              <div className="info-item">
                <div className="info-icon"><IconMapPin /></div>
                <div className="info-content">
                  <h4>Adresse</h4>
                  <p>45 Boulevard Anfa<br />20100 Casablanca, Maroc</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><IconPhone /></div>
                <div className="info-content">
                  <h4>Téléphone</h4>
                  <p>+212 5 22 00 11 22<br />+212 6 61 00 11 22</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><IconMail /></div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p>contact@bright-smile.ma</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><IconClock /></div>
                <div className="info-content">
                  <h4>Horaires d'ouverture</h4>
                  <p>
                    Lundi – Vendredi : <br />9h00 – 13h00 / 15h00 - 19h00<br />
                    Samedi : 9h00 – 13h00<br />
                    Dimanche : Fermé
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><IconCar /></div>
                <div className="info-content">
                  <h4>Accès</h4>
                  <p>
                    Tram : Ligne T1 – Station Anfa<br />
                    Bus : Lignes 2, 15, 22<br />
                    Parking gratuit à 50m
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="map-embed">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8!2d-7.633!3d33.589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4786b417af%3A0xb0b6af6d81d7e16f!2sBoulevard+Anfa%2C+Casablanca!5e0!3m2!1sfr!2sma!4v1234567890"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Cabinet Dentaire Casablanca"
              />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};
export default About;