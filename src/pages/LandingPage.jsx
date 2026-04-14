// import { Link } from 'react-router-dom'
// import { useState, useEffect, useRef } from 'react'
// import { ArrowRight, Check, Menu, X, ArrowUpRight } from 'lucide-react'

// /* ─── Fonts ─────────────────────────────── */
// const injectFonts = () => {
//   if (document.querySelector('[data-lp-fonts]')) return
//   const l = document.createElement('link')
//   l.rel = 'stylesheet'
//   l.setAttribute('data-lp-fonts', '1')
//   l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Instrument+Sans:wght@300;400;500&display=swap'
//   document.head.appendChild(l)
// }

// /* ─── Palette ────────────────────────────── */
// const P = {
//   bg:      '#F7F6F2',
//   white:   '#FFFFFF',
//   ink:     '#131210',
//   ink2:    '#3A3933',
//   muted:   '#8C8B83',
//   border:  '#E3E2DB',
//   accent:  '#2D2DE0',
//   accentS: '#EBEBFF',
//   gold:    '#C9A84C',
//   success: '#1A8A5A',
// }

// /* ─── Keyframe CSS ───────────────────────── */
// const GLOBAL_CSS = `
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   .lp { font-family: 'Instrument Sans', sans-serif; background: ${P.bg}; color: ${P.ink}; line-height: 1; -webkit-font-smoothing: antialiased; }
//   .lp a { text-decoration: none; color: inherit; }
//   .lp button { font-family: inherit; cursor: pointer; }
//   .serif   { font-family: 'Playfair Display', serif; font-weight: 400; }
//   .serif-i { font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; }

//   @keyframes lp-fadeup {
//     from { opacity: 0; transform: translateY(28px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes lp-fadein { from { opacity: 0; } to { opacity: 1; } }
//   @keyframes lp-line { from { transform: scaleX(0); } to { transform: scaleX(1); } }
//   @keyframes lp-float {
//     0%, 100% { transform: translateY(0px); }
//     50% { transform: translateY(-6px); }
//   }
//   @keyframes lp-shimmer {
//     0% { background-position: -200% center; }
//     100% { background-position: 200% center; }
//   }
//   @keyframes lp-spin {
//     from { transform: rotate(0deg); }
//     to { transform: rotate(360deg); }
//   }
//   @keyframes lp-counter {
//     from { opacity: 0; transform: translateY(12px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes lp-tab-in {
//     from { opacity: 0; transform: translateX(10px); }
//     to   { opacity: 1; transform: translateX(0); }
//   }

//   .anim-up   { animation: lp-fadeup  .7s cubic-bezier(.22,1,.36,1) both; }
//   .anim-in   { animation: lp-fadein  .5s ease both; }
//   .d1 { animation-delay: .05s; }
//   .d2 { animation-delay: .18s; }
//   .d3 { animation-delay: .32s; }
//   .d4 { animation-delay: .46s; }
//   .d5 { animation-delay: .60s; }
//   .d6 { animation-delay: .74s; }
//   .d7 { animation-delay: .88s; }

//   .lp-nav-link {
//     font-size: 13px; letter-spacing: .025em; color: ${P.muted};
//     transition: color .2s;
//   }
//   .lp-nav-link:hover { color: ${P.ink}; }

//   .lp-btn-primary {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 13px 26px; background: ${P.ink}; color: ${P.white};
//     font-family: 'Instrument Sans', sans-serif;
//     font-size: 13px; font-weight: 500; letter-spacing: .04em;
//     border: none; transition: all .25s; cursor: pointer; white-space: nowrap;
//   }
//   .lp-btn-primary:hover {
//     background: ${P.accent}; transform: translateY(-1px);
//     box-shadow: 0 8px 24px rgba(45,45,224,.22);
//   }
//   .lp-btn-primary:active { transform: translateY(0); }

//   .lp-btn-ghost {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 13px 26px; background: transparent; color: ${P.ink};
//     font-family: 'Instrument Sans', sans-serif;
//     font-size: 13px; font-weight: 400; letter-spacing: .02em;
//     border: 1px solid ${P.border}; transition: all .2s; cursor: pointer; white-space: nowrap;
//   }
//   .lp-btn-ghost:hover { border-color: ${P.ink}; background: ${P.white}; }

//   .lp-feat-card {
//     padding: 32px; border: 1px solid ${P.border}; background: ${P.white};
//     transition: border-color .25s, transform .25s, box-shadow .25s;
//     cursor: default;
//   }
//   .lp-feat-card:hover {
//     border-color: ${P.ink}; transform: translateY(-3px);
//     box-shadow: 0 12px 36px rgba(19,18,16,.07);
//   }

//   .lp-tab-btn {
//     padding: 10px 22px; font-size: 13px;
//     font-family: 'Instrument Sans', sans-serif; letter-spacing: .02em;
//     background: transparent; color: ${P.muted}; border: 1px solid ${P.border};
//     transition: all .2s; cursor: pointer; white-space: nowrap;
//   }
//   .lp-tab-btn.active { background: ${P.ink}; color: ${P.white}; border-color: ${P.ink}; }
//   .lp-tab-btn:not(.active):hover { border-color: ${P.ink2}; color: ${P.ink}; }

//   .lp-plan-card {
//     padding: 40px 36px; border: 1px solid ${P.border}; background: ${P.white};
//     display: flex; flex-direction: column; transition: border-color .2s;
//   }
//   .lp-plan-card.featured {
//     background: ${P.ink}; border-color: ${P.ink}; color: ${P.white};
//   }
//   .lp-plan-card:not(.featured):hover { border-color: ${P.ink}; }

//   .lp-toggle {
//     width: 42px; height: 24px; border-radius: 12px; background: ${P.border};
//     position: relative; cursor: pointer; transition: background .22s; flex-shrink: 0; border: none;
//   }
//   .lp-toggle.on { background: ${P.ink}; }
//   .lp-toggle::after {
//     content: ''; position: absolute; top: 4px; left: 4px;
//     width: 16px; height: 16px; border-radius: 50%; background: white;
//     transition: transform .22s; box-shadow: 0 1px 4px rgba(0,0,0,.2);
//   }
//   .lp-toggle.on::after { transform: translateX(18px); }

//   .lp-testimonial {
//     padding: 0 36px 0 0; border-right: 1px solid ${P.border};
//   }
//   .lp-testimonial:last-child { border-right: none; padding-right: 0; padding-left: 36px; }
//   .lp-testimonial:not(:first-child) { padding-left: 36px; }

//   .lp-stat-block { padding: 48px 36px; border-right: 1px solid ${P.border}; }
//   .lp-stat-block:last-child { border-right: none; }

//   /* Floating mock cards */
//   .lp-mock-card {
//     background: ${P.white}; border: 1px solid ${P.border};
//     border-radius: 12px; padding: 18px 20px;
//     box-shadow: 0 4px 20px rgba(19,18,16,.06);
//   }
//   .lp-mock-card.float1 { animation: lp-float 4s ease-in-out infinite; }
//   .lp-mock-card.float2 { animation: lp-float 4s ease-in-out infinite .8s; }
//   .lp-mock-card.float3 { animation: lp-float 4s ease-in-out infinite 1.6s; }

//   .lp-orb {
//     position: absolute; border-radius: 50%; pointer-events: none;
//     background: radial-gradient(circle, rgba(45,45,224,.08) 0%, transparent 70%);
//   }

//   .lp-divider { height: 1px; background: ${P.border}; }

//   .lp-badge {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 5px 12px; border: 1px solid ${P.border}; background: ${P.white};
//     font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: ${P.muted};
//   }
//   .lp-badge-dot {
//     width: 6px; height: 6px; border-radius: 50%; background: ${P.success};
//     box-shadow: 0 0 0 3px rgba(26,138,90,.15);
//     animation: lp-float 2s ease-in-out infinite;
//   }

//   .lp-number-shimmer {
//     background: linear-gradient(90deg, ${P.ink} 40%, ${P.accent} 50%, ${P.ink} 60%);
//     background-size: 200% auto;
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//     animation: lp-shimmer 4s linear infinite;
//   }

//   .lp-tab-panel { animation: lp-tab-in .3s ease both; }

//   .lp-link-arrow {
//     display: inline-flex; align-items: center; gap: 6px;
//     font-size: 13px; color: ${P.accent}; font-weight: 500;
//     transition: gap .2s;
//   }
//   .lp-link-arrow:hover { gap: 10px; }

//   .lp-scroll-line {
//     position: absolute; bottom: 0; left: 0; height: 2px;
//     background: ${P.accent}; transform-origin: left;
//     animation: lp-line 1.2s cubic-bezier(.22,1,.36,1) .8s both;
//   }

//   @media (max-width: 768px) {
//     .lp-stat-block { border-right: none; border-bottom: 1px solid ${P.border}; padding: 32px 24px; }
//     .lp-stat-block:last-child { border-bottom: none; }
//     .lp-testimonial { border-right: none; border-bottom: 1px solid ${P.border}; padding: 0 0 32px 0 !important; margin-bottom: 0; }
//     .lp-testimonial:last-child { border-bottom: none; padding-bottom: 0 !important; }
//     .lp-feat-card { padding: 24px; }
//   }
// `

// const FEATURES = [
//   { n: '01', t: 'Dépenses & validation',    d: "Soumettez, joignez les justificatifs, et les responsables valident ou refusent en temps réel. Historique complet de chaque action." },
//   { n: '02', t: 'Budgets & alertes',        d: "Allouez des enveloppes par équipe ou catégorie. Alertes automatiques à 80% et 100% d'utilisation." },
//   { n: '03', t: 'Facturation client',       d: "Rédigez des devis professionnels et convertissez-les en factures d'une action. TVA marocaine 0–20% intégrée." },
//   { n: '04', t: 'Gestion de stock',         d: "Catalogue produits, mouvements d'entrée/sortie, seuil de réapprovisionnement automatique." },
//   { n: '05', t: 'Fournisseurs & achats',    d: "Fiches fournisseurs avec RIB. Bons de commande de la création à la réception en quelques clics." },
//   { n: '06', t: 'Plan comptable CGNC',      d: "Grand livre, balance et bilan conformes au Plan Comptable Général Normalisé Marocain. Clôture d'exercice intégrée." },
// ]

// const ROLES = [
//   {
//     id: 'owner', label: 'Company Owner', emoji: '◆',
//     h: 'Vision globale, contrôle total.',
//     d: "Supervisez l'ensemble de l'activité financière depuis un tableau de bord unifié.",
//     p: ["Accès à tous les modules sans restriction", "Configuration entreprise — ICE, IF, RC, CNSS", "Gestion des utilisateurs et attribution des rôles", "Rapports financiers consolidés", "Modules ERP complets", "Remboursements et clôture comptable"],
//   },
//   {
//     id: 'chef', label: "Chef d'équipe", emoji: '●',
//     h: 'Pilotez votre équipe avec précision.',
//     d: "Validez les dépenses de votre équipe, suivez les budgets alloués et accédez aux modules commerciaux.",
//     p: ["Valider ou refuser les dépenses avec motif", "Vision complète sur les dépenses de l'équipe", "Suivi du budget en temps réel", "Accès aux modules ventes et achats", "Rapports d'activité de l'équipe", "Notifications de dépassement budgétaire"],
//   },
//   {
//     id: 'equipe', label: 'Équipe', emoji: '○',
//     h: 'Simple, rapide, sans friction.',
//     d: "Soumettez vos dépenses depuis n'importe où et suivez leur statut en temps réel.",
//     p: ["Créer et soumettre des dépenses", "Attacher des justificatifs (PDF, image)", "Consulter les dépenses de son équipe", "Suivi de ses remboursements", "Consultation des budgets", "Notifications de validation et de refus"],
//   },
// ]

// const PLANS = [
//   {
//     name: 'Starter', m: 149, a: 119,
//     desc: "Pour les équipes jusqu'à 5 personnes.",
//     feat: ['5 utilisateurs', 'Dépenses illimitées', 'Budgets & catégories', 'Export CSV', 'Support email'],
//     cta: "Commencer l'essai", featured: false,
//   },
//   {
//     name: 'Pro', m: 349, a: 279,
//     desc: 'Pour les entreprises en croissance.',
//     feat: ['25 utilisateurs', 'Tout Starter inclus', 'Modules ERP complets', 'Export PDF & Excel', 'Support prioritaire'],
//     cta: "Commencer l'essai", featured: true,
//   },
//   {
//     name: 'Enterprise', m: null, a: null,
//     desc: 'Pour les structures à grande échelle.',
//     feat: ['Utilisateurs illimités', 'Tout Pro inclus', 'Multi-entreprises', 'API & intégrations', 'SLA 99,9% — Support dédié'],
//     cta: 'Nous contacter', featured: false,
//   },
// ]

// const TESTIMONIALS = [
//   { q: "En trois mois, nos délais de remboursement sont passés de deux semaines à 48 heures. Un changement radical pour toute l'équipe.", a: 'Youssef Bennani', t: 'Directeur général, Groupe Amal' },
//   { q: "La TVA marocaine intégrée nativement était notre principal frein. Taadbiir l'a résolu sans configuration supplémentaire.", a: 'Fatima-Zahra El Idrissi', t: 'Directrice financière, Agence Atlas' },
//   { q: "Mes chefs d'équipe valident les dépenses depuis leur téléphone. Ce qui prenait des jours se fait maintenant en minutes.", a: 'Mehdi Tazi', t: 'Fondateur, TechSolutions Maroc' },
// ]

// /* ─── Inline style helpers ───────────────── */
// const row = (x = {}) => ({ display: 'flex', alignItems: 'center', ...x })
// const col = (x = {}) => ({ display: 'flex', flexDirection: 'column', ...x })
// const W = { maxWidth: 1120, margin: '0 auto', padding: '0 40px' }
// const WN = { maxWidth: 1120, margin: '0 auto', padding: '0 40px' }

// /* ─── Mock dashboard preview ─────────────── */
// function MockDashboard() {
//   const rows = [
//     { init: 'KB', name: 'Karim Benali', desc: 'Vol Casa–Paris', amt: '4 800 MAD', status: 'En attente', sc: '#FEF3C7', tc: '#92400E' },
//     { init: 'LB', name: 'Leila Benhali', desc: 'Hôtel Marriott', amt: '3 600 MAD', status: 'Approuvée', sc: '#D1FAE5', tc: '#065F46' },
//     { init: 'SA', name: 'Sara Alami', desc: 'Abonnements SaaS', amt: '2 900 MAD', status: 'Remboursée', sc: '#E0E7FF', tc: '#3730A3' },
//   ]
//   return (
//     <div style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px rgba(19,18,16,.10)' }}>
//       {/* Browser bar */}
//       <div style={{ background: P.bg, borderBottom: `1px solid ${P.border}`, padding: '12px 16px', ...row({ gap: 16 }) }}>
//         <div style={row({ gap: 6 })}>
//           {['#FC6058','#FEC02F','#2ACA44'].map(c => (
//             <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
//           ))}
//         </div>
//         <div style={{ flex: 1, background: P.white, border: `1px solid ${P.border}`, borderRadius: 6, padding: '5px 12px', fontSize: 11, color: P.muted, textAlign: 'center' }}>
//           app.expenseiq.ma/dashboard
//         </div>
//       </div>
//       {/* App content */}
//       <div style={row({ alignItems: 'stretch' })}>
//         {/* Sidebar */}
//         <div style={{ width: 160, borderRight: `1px solid ${P.border}`, padding: '20px 16px', flexShrink: 0 }}>
//           <div style={{ ...row({ gap: 8 }), marginBottom: 24 }}>
//             <div style={{ width: 22, height: 22, background: P.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <span style={{ color: P.white, fontSize: 8, fontWeight: 600, letterSpacing: '.05em' }}>EQ</span>
//             </div>
//             <span style={{ fontSize: 12, fontWeight: 500 }}>ExpenseIQ</span>
//           </div>
//           {['Dashboard', 'Dépenses', 'Validation', 'Budgets', 'Rapports', 'Facturation'].map((item, i) => (
//             <div key={item} style={{
//               ...row({ gap: 8 }), padding: '7px 10px', borderRadius: 6, marginBottom: 2,
//               background: i === 0 ? P.accentS : 'transparent',
//               color: i === 0 ? P.accent : P.muted, fontSize: 11, fontWeight: i === 0 ? 500 : 400,
//             }}>
//               <div style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? P.accent : P.border, flexShrink: 0 }} />
//               {item}
//             </div>
//           ))}
//         </div>
//         {/* Main */}
//         <div style={{ flex: 1, background: P.bg, padding: 20 }}>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
//             {[
//               { label: 'Total ce mois', value: '48 320 MAD', color: P.accent },
//               { label: 'En attente',    value: '4',          color: '#F59E0B' },
//               { label: 'Remboursements', value: '7 200 MAD', color: '#EF4444' },
//               { label: 'Budgets actifs', value: '5',         color: P.success },
//             ].map(k => (
//               <div key={k.label} style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 8, padding: '12px 14px' }}>
//                 <p style={{ fontSize: 9, color: P.muted, marginBottom: 5 }}>{k.label}</p>
//                 <p style={{ fontSize: 12, fontWeight: 600, color: k.color }}>{k.value}</p>
//               </div>
//             ))}
//           </div>
//           <div style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 8, padding: 16 }}>
//             <div style={{ ...row({ justifyContent: 'space-between', marginBottom: 12 }) }}>
//               <span style={{ fontSize: 11, fontWeight: 500 }}>Dépenses récentes</span>
//               <span style={{ fontSize: 10, color: P.accent }}>Voir tout →</span>
//             </div>
//             {rows.map((r, i) => (
//               <div key={i} style={{ ...row({ justifyContent: 'space-between', paddingBlock: 9, borderBottom: i < 2 ? `1px solid ${P.border}` : 'none' }) }}>
//                 <div style={row({ gap: 9 })}>
//                   <div style={{ width: 22, height: 22, borderRadius: '50%', background: P.accentS, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: P.accent, flexShrink: 0 }}>
//                     {r.init}
//                   </div>
//                   <div>
//                     <p style={{ fontSize: 10, fontWeight: 500, marginBottom: 1 }}>{r.name}</p>
//                     <p style={{ fontSize: 9, color: P.muted }}>{r.desc}</p>
//                   </div>
//                 </div>
//                 <div style={row({ gap: 8 })}>
//                   <span style={{ fontSize: 10, fontWeight: 600 }}>{r.amt}</span>
//                   <span style={{ fontSize: 8, fontWeight: 500, padding: '2px 7px', borderRadius: 20, background: r.sc, color: r.tc }}>{r.status}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ─── Number counter animation ───────────── */
// function AnimCounter({ target, suffix = '', duration = 1600 }) {
//   const [val, setVal] = useState(0)
//   const ref = useRef(null)
//   useEffect(() => {
//     const obs = new IntersectionObserver(([e]) => {
//       if (!e.isIntersecting) return
//       obs.disconnect()
//       const start = Date.now()
//       const tick = () => {
//         const p = Math.min((Date.now() - start) / duration, 1)
//         const ease = 1 - Math.pow(1 - p, 3)
//         setVal(Math.round(ease * target))
//         if (p < 1) requestAnimationFrame(tick)
//       }
//       tick()
//     }, { threshold: .3 })
//     if (ref.current) obs.observe(ref.current)
//     return () => obs.disconnect()
//   }, [target, duration])
//   return <span ref={ref}>{val.toLocaleString('fr-MA')}{suffix}</span>
// }

// /* ─── Main ───────────────────────────────── */
// export default function LandingPage() {
//   injectFonts()
//   const [menu, setMenu] = useState(false)
//   const [annual, setAnnual] = useState(false)
//   const [role, setRole] = useState('owner')
//   const [scrolled, setScrolled] = useState(false)

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 50)
//     window.addEventListener('scroll', fn, { passive: true })
//     return () => window.removeEventListener('scroll', fn)
//   }, [])

//   const R = ROLES.find(r => r.id === role)

//   return (
//     <div className="lp" style={{ minHeight: '100vh' }}>
//       <style>{GLOBAL_CSS}</style>

//       {/* ══ NAVBAR ══════════════════════════════════════ */}
//       <header style={{
//         position: 'sticky', top: 0, zIndex: 200,
//         background: scrolled ? 'rgba(247,246,242,.97)' : 'transparent',
//         backdropFilter: scrolled ? 'blur(16px)' : 'none',
//         borderBottom: `1px solid ${scrolled ? P.border : 'transparent'}`,
//         transition: 'all .35s',
//       }}>
//         <div style={{ ...WN, height: 68, ...row({ justifyContent: 'space-between' }) }}>
//           {/* Logo */}
//           <div style={row({ gap: 10 })}>
//             <div style={{ width: 30, height: 30, background: P.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//               <span style={{ color: P.white, fontSize: 9, fontWeight: 600, letterSpacing: '.08em' }}>EQ</span>
//             </div>
//             <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.01em' }}>ExpenseIQ</span>
//           </div>
//           {/* Nav links */}
//           <nav style={row({ gap: 40 })} className="hidden md:flex">
//             {[['Fonctionnalités', '#fonctionnalites'], ['Espaces', '#roles'], ['Tarifs', '#tarifs']].map(([l, h]) => (
//               <a key={l} href={h} className="lp-nav-link">{l}</a>
//             ))}
//           </nav>
//           {/* CTAs */}
//           <div style={row({ gap: 14 })} className="hidden md:flex">
//             <Link to="/login" className="lp-nav-link">Connexion</Link>
//             <Link to="/register" className="lp-btn-primary">Essai gratuit <ArrowRight size={13} /></Link>
//           </div>
//           {/* Burger */}
//           <button onClick={() => setMenu(v => !v)} className="md:hidden"
//             style={{ background: 'none', border: 'none', color: P.ink, lineHeight: 0, padding: 4 }}>
//             {menu ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>
//         {/* Mobile menu */}
//         {menu && (
//           <div style={{ background: P.bg, borderTop: `1px solid ${P.border}`, padding: '20px 40px 28px' }}>
//             {[['Fonctionnalités', '#fonctionnalites'], ['Espaces', '#roles'], ['Tarifs', '#tarifs']].map(([l, h]) => (
//               <a key={l} href={h} onClick={() => setMenu(false)}
//                 style={{ display: 'block', padding: '12px 0', fontSize: 14, color: P.ink, borderBottom: `1px solid ${P.border}` }}>
//                 {l}
//               </a>
//             ))}
//             <div style={{ ...col({ gap: 10 }), marginTop: 20 }}>
//               <Link to="/login" className="lp-btn-ghost" style={{ justifyContent: 'center' }}>Connexion</Link>
//               <Link to="/register" className="lp-btn-primary" style={{ justifyContent: 'center' }}>Essai gratuit</Link>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* ══ HERO ════════════════════════════════════════ */}
//       <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 80, paddingBottom: 0 }}>
//         {/* Orbs */}
//         <div className="lp-orb" style={{ width: 700, height: 700, top: -200, left: '50%', transform: 'translateX(-30%)' }} />
//         <div className="lp-orb" style={{ width: 400, height: 400, bottom: 0, right: 0, background: 'radial-gradient(circle, rgba(201,168,76,.06) 0%, transparent 70%)' }} />

//         <div style={{ ...W }}>
//           {/* Badge */}
//           <div className="lp-badge anim-in d1" style={{ marginBottom: 36 }}>
//             <span className="lp-badge-dot" />
//             Plateforme ERP — PME Marocaines
//           </div>

//           {/* Headline */}
//           <div style={{ maxWidth: 760, marginBottom: 28 }}>
//             <h1 className="serif anim-up d2" style={{ fontSize: 'clamp(44px,6vw,76px)', lineHeight: 1.06, letterSpacing: '-.03em', marginBottom: 8 }}>
//               La finance de votre
//             </h1>
//             <h1 className="serif-i anim-up d3" style={{ fontSize: 'clamp(44px,6vw,76px)', lineHeight: 1.06, letterSpacing: '-.03em', color: P.accent, position: 'relative', display: 'inline-block' }}>
//               entreprise, simplifiée.
//               <div className="lp-scroll-line" />
//             </h1>
//           </div>

//           <p className="anim-up d4" style={{ fontSize: 17, lineHeight: 1.75, color: P.muted, fontWeight: 300, maxWidth: 500, marginBottom: 44 }}>
//             Dépenses, budgets, facturation, stock et comptabilité CGNC — tout dans une seule plateforme conçue pour les entreprises marocaines.
//           </p>

//           {/* CTAs */}
//           <div className="anim-up d5" style={row({ gap: 14, flexWrap: 'wrap', marginBottom: 20 })}>
//             <Link to="/register" className="lp-btn-primary">
//               Commencer l'essai gratuit <ArrowRight size={13} />
//             </Link>
//             <Link to="/login" className="lp-btn-ghost">
//               Voir la démo
//             </Link>
//           </div>
//           <p className="anim-up d6" style={{ fontSize: 12, color: P.muted, fontWeight: 300, marginBottom: 72 }}>
//             7 jours gratuits · Aucune carte bancaire · Annulable à tout moment
//           </p>

//           {/* Dashboard preview */}
//           <div className="anim-up d7" style={{ maxWidth: 900, marginBottom: -2 }}>
//             <MockDashboard />
//           </div>
//         </div>
//       </section>

//       {/* ══ STATS ═══════════════════════════════════════ */}
//       <section style={{ background: P.white, borderTop: `1px solid ${P.border}`, borderBottom: `1px solid ${P.border}` }}>
//         <div style={{ ...W, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
//           {[
//             { val: 500, suf: '+', label: 'Entreprises actives' },
//             { val: 50000, suf: '+', label: 'Dépenses traitées' },
//             { val: 98, suf: '%', label: 'Taux de satisfaction' },
//             { val: 48, suf: 'h', label: 'Délai moyen de remboursement' },
//           ].map((s, i) => (
//             <div key={s.label} className="lp-stat-block">
//               <p className="serif" style={{ fontSize: 50, lineHeight: 1, letterSpacing: '-.03em', marginBottom: 10 }}>
//                 <span className="lp-number-shimmer">
//                   <AnimCounter target={s.val} suffix={s.suf} />
//                 </span>
//               </p>
//               <p style={{ fontSize: 13, color: P.muted, fontWeight: 300, lineHeight: 1.5 }}>{s.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ══ FEATURES ════════════════════════════════════ */}
//       <section id="fonctionnalites" style={{ ...W, paddingTop: 100, paddingBottom: 100 }}>
//         <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 72, alignItems: 'start' }}>
//           {/* Sticky text */}
//           <div style={{ position: 'sticky', top: 100 }}>
//             <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 20 }}>Fonctionnalités</p>
//             <h2 className="serif" style={{ fontSize: 'clamp(26px,3vw,36px)', lineHeight: 1.18, letterSpacing: '-.02em', marginBottom: 20 }}>
//               Tout ce dont votre entreprise a besoin
//             </h2>
//             <p style={{ fontSize: 14, color: P.muted, lineHeight: 1.78, fontWeight: 300, marginBottom: 36 }}>
//               Du ticket de caisse à la clôture comptable — une seule plateforme adaptée au cadre légal marocain.
//             </p>
//             <Link to="/register" className="lp-btn-primary" style={{ fontSize: 13 }}>
//               Démarrer <ArrowRight size={13} />
//             </Link>
//           </div>
//           {/* Grid */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: P.border }}>
//             {FEATURES.map(f => (
//               <div key={f.n} className="lp-feat-card">
//                 <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 20 }}>{f.n}</p>
//                 <h3 style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.01em', marginBottom: 12, lineHeight: 1.35 }}>{f.t}</h3>
//                 <p style={{ fontSize: 13, color: P.muted, lineHeight: 1.72, fontWeight: 300 }}>{f.d}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <div className="lp-divider" />

//       {/* ══ ROLES ═══════════════════════════════════════ */}
//       <section id="roles" style={{ ...W, paddingTop: 100, paddingBottom: 100 }}>
//         <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 20 }}>3 espaces</p>
//         <h2 className="serif" style={{ fontSize: 'clamp(26px,3vw,36px)', lineHeight: 1.18, letterSpacing: '-.02em', marginBottom: 48 }}>
//           Un outil adapté à chaque rôle
//         </h2>
//         {/* Tabs */}
//         <div style={row({ marginBottom: 0 })}>
//           {ROLES.map((r, i) => (
//             <button key={r.id} onClick={() => setRole(r.id)}
//               className={`lp-tab-btn ${role === r.id ? 'active' : ''}`}
//               style={{
//                 borderRight: i < 2 ? 'none' : `1px solid ${P.border}`,
//                 borderBottom: role === r.id ? 'none' : `1px solid ${P.border}`,
//               }}>
//               <span style={{ marginRight: 6, opacity: .6 }}>{r.emoji}</span>
//               {r.label}
//             </button>
//           ))}
//           <div style={{ flex: 1, borderBottom: `1px solid ${P.border}` }} />
//         </div>
//         {/* Panel */}
//         <div key={role} className="lp-tab-panel" style={{
//           border: `1px solid ${P.border}`, borderTop: 'none',
//           background: P.white, padding: '52px 48px',
//           display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56,
//         }}>
//           <div>
//             <h3 className="serif" style={{ fontSize: 30, lineHeight: 1.2, letterSpacing: '-.02em', marginBottom: 18 }}>{R.h}</h3>
//             <p style={{ fontSize: 15, color: P.muted, lineHeight: 1.72, fontWeight: 300, marginBottom: 36 }}>{R.d}</p>
//             <Link to="/register" className="lp-btn-ghost">
//               Créer un compte <ArrowRight size={13} />
//             </Link>
//           </div>
//           <div>
//             <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: P.muted, marginBottom: 24 }}>Permissions</p>
//             <ul style={{ listStyle: 'none', ...col({ gap: 14 }) }}>
//               {R.p.map(p => (
//                 <li key={p} style={{ ...row({ gap: 12, fontSize: 14, lineHeight: 1.4 }) }}>
//                   <Check size={14} style={{ color: P.accent, flexShrink: 0 }} />
//                   <span style={{ color: P.ink }}>{p}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//         {/* Demo notice */}
//         <div style={{
//           marginTop: 1, padding: '16px 24px',
//           background: P.accentS, borderLeft: `3px solid ${P.accent}`,
//           ...row({ gap: 32, flexWrap: 'wrap' }),
//         }}>
//           <p style={{ fontSize: 11, color: P.accent, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', flexShrink: 0 }}>
//             Comptes démo
//           </p>
//           {[['Company Owner', 'owner@techmaroc.ma'], ["Chef d'équipe", 'chef@techmaroc.ma'], ['Équipe', 'equipe@techmaroc.ma']].map(([l, e]) => (
//             <div key={e} style={row({ gap: 8 })}>
//               <span style={{ fontSize: 12, color: P.muted }}>{l}</span>
//               <span style={{ fontSize: 12, fontFamily: 'monospace', color: P.accent }}>{e}</span>
//             </div>
//           ))}
//           <span style={{ fontSize: 12, color: P.muted }}>
//             Mot de passe : <span style={{ fontFamily: 'monospace', color: P.ink }}>password</span>
//           </span>
//         </div>
//       </section>

//       <div className="lp-divider" />

//       {/* ══ TESTIMONIALS ════════════════════════════════ */}
//       <section style={{ ...W, paddingTop: 100, paddingBottom: 100 }}>
//         <div style={row({ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 20 })}>
//           <div>
//             <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 16 }}>Témoignages</p>
//             <h2 className="serif" style={{ fontSize: 'clamp(26px,3vw,36px)', lineHeight: 1.18, letterSpacing: '-.02em' }}>
//               Ils nous font confiance
//             </h2>
//           </div>
//           <div style={row({ gap: 6 })}>
//             {[...Array(5)].map((_, i) => (
//               <div key={i} style={{ width: 16, height: 16, background: P.gold, clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' }} />
//             ))}
//             <span style={{ fontSize: 13, color: P.muted, marginLeft: 8 }}>4.9 / 5 · 200+ avis</span>
//           </div>
//         </div>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
//           {TESTIMONIALS.map((t, i) => (
//             <div key={t.a} className="lp-testimonial">
//               <div style={{ width: 28, height: 2, background: P.accent, marginBottom: 28 }} />
//               <p style={{ fontSize: 16, lineHeight: 1.72, color: P.ink, fontWeight: 300, marginBottom: 32, letterSpacing: '-.005em' }}>
//                 &ldquo;{t.q}&rdquo;
//               </p>
//               <p style={{ fontSize: 14, fontWeight: 500, color: P.ink, marginBottom: 3 }}>{t.a}</p>
//               <p style={{ fontSize: 12, color: P.muted }}>{t.t}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <div className="lp-divider" />

//       {/* ══ PRICING ═════════════════════════════════════ */}
//       <section id="tarifs" style={{ ...W, paddingTop: 100, paddingBottom: 100 }}>
//         <div style={{ ...row({ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 20 }) }}>
//           <div>
//             <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 16 }}>Tarifs</p>
//             <h2 className="serif" style={{ fontSize: 'clamp(26px,3vw,36px)', lineHeight: 1.18, letterSpacing: '-.02em' }}>
//               Simple et transparent
//             </h2>
//           </div>
//           <div style={{
//             ...row({ gap: 12 }), padding: '10px 16px',
//             background: P.white, border: `1px solid ${P.border}`,
//             fontSize: 13,
//           }}>
//             <span style={{ color: !annual ? P.ink : P.muted, fontWeight: !annual ? 500 : 400 }}>Mensuel</span>
//             <button
//               className={`lp-toggle ${annual ? 'on' : ''}`}
//               onClick={() => setAnnual(v => !v)}
//               aria-label="Toggle annual billing"
//             />
//             <span style={{ color: annual ? P.ink : P.muted, fontWeight: annual ? 500 : 400 }}>Annuel</span>
//             {annual && (
//               <span style={{ fontSize: 11, background: '#D1FAE5', color: '#065F46', padding: '3px 10px', fontWeight: 500 }}>
//                 −20%
//               </span>
//             )}
//           </div>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: P.border }}>
//           {PLANS.map(p => (
//             <div key={p.name} className={`lp-plan-card ${p.featured ? 'featured' : ''}`}>
//               {p.featured && (
//                 <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>
//                   ★ Recommandé
//                 </div>
//               )}
//               <div style={{ marginBottom: 32 }}>
//                 <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: p.featured ? 'rgba(255,255,255,.4)' : P.muted, marginBottom: 8 }}>
//                   {p.name}
//                 </p>
//                 <p style={{ fontSize: 13, color: p.featured ? 'rgba(255,255,255,.5)' : P.muted, fontWeight: 300, lineHeight: 1.55 }}>{p.desc}</p>
//               </div>
//               {p.m ? (
//                 <div style={{ marginBottom: 32 }}>
//                   <div style={row({ gap: 6, alignItems: 'baseline' })}>
//                     <span className="serif" style={{ fontSize: 52, letterSpacing: '-.03em', lineHeight: 1, color: p.featured ? P.white : P.ink }}>
//                       {annual ? p.a : p.m}
//                     </span>
//                     <span style={{ fontSize: 13, color: p.featured ? 'rgba(255,255,255,.4)' : P.muted }}>MAD/mois</span>
//                   </div>
//                   {annual && (
//                     <p style={{ fontSize: 11, color: p.featured ? 'rgba(255,255,255,.3)' : P.muted, marginTop: 4 }}>
//                       Facturé {(annual ? p.a : p.m) * 12} MAD/an
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <p className="serif" style={{ fontSize: 36, letterSpacing: '-.02em', marginBottom: 32, color: p.featured ? P.white : P.ink }}>
//                   Sur devis
//                 </p>
//               )}
//               <ul style={{ listStyle: 'none', ...col({ gap: 12 }), marginBottom: 36, flex: 1 }}>
//                 {p.feat.map(f => (
//                   <li key={f} style={{ ...row({ gap: 10, fontSize: 13, fontWeight: 300 }), color: p.featured ? 'rgba(255,255,255,.75)' : P.ink }}>
//                     <Check size={13} style={{ color: p.featured ? 'rgba(255,255,255,.5)' : P.accent, flexShrink: 0 }} />{f}
//                   </li>
//                 ))}
//               </ul>
//               <Link to="/register" style={{
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
//                 padding: '13px 20px', fontSize: 13, fontWeight: 500, letterSpacing: '.03em',
//                 background: p.featured ? P.white : P.ink,
//                 color: p.featured ? P.ink : P.white,
//                 transition: 'all .2s',
//               }}>
//                 {p.cta} <ArrowRight size={13} />
//               </Link>
//             </div>
//           ))}
//         </div>
//         <p style={{ textAlign: 'center', fontSize: 13, color: P.muted, marginTop: 24, fontWeight: 300 }}>
//           7 jours d'essai gratuit sur chaque plan · Annulable à tout moment · Sans engagement
//         </p>
//       </section>

//       {/* ══ CTA FINAL ═══════════════════════════════════ */}
//       <section style={{ background: P.ink, padding: '96px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
//         {/* Decorative orbs */}
//         <div style={{ position: 'absolute', top: -100, left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,45,224,.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
//         <div style={{ position: 'absolute', bottom: -80, right: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
//         <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
//           <p style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 28 }}>
//             Prêt à commencer ?
//           </p>
//           <h2 className="serif" style={{ fontSize: 'clamp(32px,4.5vw,52px)', color: P.white, letterSpacing: '-.025em', marginBottom: 20, lineHeight: 1.12 }}>
//             Reprenez le contrôle de votre gestion financière.
//           </h2>
//           <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', fontWeight: 300, lineHeight: 1.72, marginBottom: 44 }}>
//             Rejoignez des centaines d'entreprises marocaines qui font confiance à ExpenseIQ pour leur gestion financière quotidienne.
//           </p>
//           <div style={row({ gap: 14, justifyContent: 'center', flexWrap: 'wrap' })}>
//             <Link to="/register" style={{
//               display: 'inline-flex', alignItems: 'center', gap: 8,
//               padding: '14px 28px', background: P.white, color: P.ink,
//               fontSize: 13, fontWeight: 500, letterSpacing: '.04em',
//               transition: 'all .2s',
//             }}>
//               Démarrer gratuitement <ArrowRight size={13} />
//             </Link>
//             <Link to="/login" style={{
//               display: 'inline-flex', alignItems: 'center', gap: 8,
//               padding: '14px 28px', background: 'transparent', color: 'rgba(255,255,255,.55)',
//               fontSize: 13, border: '1px solid rgba(255,255,255,.15)', letterSpacing: '.02em',
//               transition: 'all .2s',
//             }}>
//               Se connecter
//             </Link>
//           </div>
//           <p style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', marginTop: 24, fontWeight: 300 }}>
//             7 jours gratuits · Sans engagement · Support en français et arabe
//           </p>
//         </div>
//       </section>

//       {/* ══ FOOTER ══════════════════════════════════════ */}
//       <footer style={{ borderTop: `1px solid ${P.border}`, background: P.bg }}>
//         <div style={{ ...W, padding: '44px 40px', ...row({ justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }) }}>
//           <div style={row({ gap: 12 })}>
//             <div style={{ width: 26, height: 26, background: P.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//               <span style={{ color: P.white, fontSize: 9, fontWeight: 600, letterSpacing: '.06em' }}>EQ</span>
//             </div>
//             <span style={{ fontSize: 14, fontWeight: 500 }}>ExpenseIQ</span>
//             <span style={{ width: 1, height: 14, background: P.border, margin: '0 4px' }} />
//             <span style={{ fontSize: 13, color: P.muted, fontWeight: 300 }}>Conçu pour les entreprises marocaines</span>
//           </div>
//           <div style={row({ gap: 32, flexWrap: 'wrap' })}>
//             {[['Fonctionnalités', '#fonctionnalites'], ['Espaces', '#roles'], ['Tarifs', '#tarifs'], ['Connexion', '/login']].map(([l, h]) => (
//               <a key={l} href={h} className="lp-nav-link">{l}</a>
//             ))}
//           </div>
//           <p style={{ fontSize: 12, color: P.muted, fontWeight: 300 }}>© 2025 Taadbiir</p>
//         </div>
//       </footer>
//     </div>
//   )
// }
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Check, Menu, X } from 'lucide-react'

const injectFonts = () => {
  if (document.querySelector('[data-lp-fonts]')) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'
  l.setAttribute('data-lp-fonts', '1')
  l.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Geist:wght@300;400;500;600&display=swap'
  document.head.appendChild(l)
}

const P = {
  bg:      '#F8F6F2',
  white:   '#FFFFFF',
  ink:     '#181715',
  ink2:    '#2C2A28',
  muted:   '#8A8780',
  border:  '#E4DDD1',
  accent:  '#3D5A80',
  accentS: '#EBF0F7',
  accentM: '#C2D3E8',
  gold:    '#B8975A',
  success: '#3D7A5F',
}

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .lp { font-family: 'Geist', system-ui, sans-serif; background: ${P.bg}; color: ${P.ink}; line-height: 1; -webkit-font-smoothing: antialiased; }
  .lp a { text-decoration: none; color: inherit; }
  .lp button { font-family: inherit; cursor: pointer; }
  .serif   { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; }
  .serif-i { font-family: 'Instrument Serif', Georgia, serif; font-style: italic; font-weight: 400; }

  @keyframes lp-fadeup { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes lp-fadein { from { opacity: 0; } to { opacity: 1; } }
  @keyframes lp-line   { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes lp-float  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  @keyframes lp-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes lp-tab-in { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }

  .anim-up { animation: lp-fadeup .65s cubic-bezier(.22,1,.36,1) both; }
  .anim-in { animation: lp-fadein .45s ease both; }
  .d1{animation-delay:.05s}.d2{animation-delay:.16s}.d3{animation-delay:.28s}
  .d4{animation-delay:.40s}.d5{animation-delay:.52s}.d6{animation-delay:.64s}.d7{animation-delay:.76s}

  .lp-nav-link { font-size: 13px; letter-spacing:.015em; color:${P.muted}; transition:color .18s; }
  .lp-nav-link:hover { color:${P.ink}; }

  .lp-btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    padding:12px 24px; background:${P.accent}; color:#fff;
    font-size:13px; font-weight:500; letter-spacing:.03em;
    border:none; border-radius:10px; cursor:pointer; white-space:nowrap;
    box-shadow:0 1px 4px rgba(61,90,128,.28);
    transition:background .2s, transform .15s, box-shadow .2s;
  }
  .lp-btn-primary:hover { background:${P.ink}; transform:translateY(-1px); box-shadow:0 6px 18px rgba(61,90,128,.25); }
  .lp-btn-primary:active { transform:translateY(0); }

  .lp-btn-ghost {
    display:inline-flex; align-items:center; gap:8px;
    padding:12px 24px; background:transparent; color:${P.ink};
    font-size:13px; font-weight:400; letter-spacing:.02em;
    border:1px solid ${P.border}; border-radius:10px; cursor:pointer; white-space:nowrap;
    transition:background .2s, border-color .2s;
  }
  .lp-btn-ghost:hover { background:${P.white}; border-color:${P.ink}; }

  .lp-feat-card {
    padding:30px; border:1px solid ${P.border}; background:${P.white};
    transition:border-color .25s, transform .25s, box-shadow .25s; cursor:default;
  }
  .lp-feat-card:hover { border-color:${P.accent}; transform:translateY(-2px); box-shadow:0 8px 28px rgba(61,90,128,.10); }

  .lp-tab-btn {
    padding:10px 22px; font-size:13px; letter-spacing:.015em;
    background:transparent; color:${P.muted}; border:1px solid ${P.border};
    cursor:pointer; white-space:nowrap; transition:all .18s;
  }
  .lp-tab-btn.active { background:${P.accent}; color:#fff; border-color:${P.accent}; }
  .lp-tab-btn:not(.active):hover { border-color:${P.ink2}; color:${P.ink}; }

  .lp-plan-card { padding:36px 32px; border:1px solid ${P.border}; background:${P.white}; display:flex; flex-direction:column; transition:border-color .2s; }
  .lp-plan-card.featured { background:${P.ink}; border-color:${P.ink}; color:#fff; }
  .lp-plan-card:not(.featured):hover { border-color:${P.accent}; }

  .lp-toggle { width:42px; height:24px; border-radius:12px; background:${P.border}; position:relative; cursor:pointer; transition:background .22s; flex-shrink:0; border:none; }
  .lp-toggle.on { background:${P.accent}; }
  .lp-toggle::after { content:''; position:absolute; top:4px; left:4px; width:16px; height:16px; border-radius:50%; background:#fff; transition:transform .22s; box-shadow:0 1px 4px rgba(0,0,0,.2); }
  .lp-toggle.on::after { transform:translateX(18px); }

  .lp-testimonial { padding:0 36px 0 0; border-right:1px solid ${P.border}; }
  .lp-testimonial:last-child { border-right:none; padding-right:0; padding-left:36px; }
  .lp-testimonial:not(:first-child) { padding-left:36px; }

  .lp-stat-block { padding:44px 36px; border-right:1px solid ${P.border}; }
  .lp-stat-block:last-child { border-right:none; }

  .lp-number-shimmer {
    background:linear-gradient(90deg,${P.ink} 40%,${P.accent} 50%,${P.ink} 60%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:lp-shimmer 4s linear infinite;
  }

  .lp-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border:1px solid ${P.border}; background:${P.white}; border-radius:100px; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:${P.muted}; }
  .lp-badge-dot { width:6px; height:6px; border-radius:50%; background:${P.success}; box-shadow:0 0 0 3px rgba(61,122,95,.15); animation:lp-float 2s ease-in-out infinite; }

  .lp-scroll-line { position:absolute; bottom:0; left:0; height:2px; background:${P.accent}; transform-origin:left; animation:lp-line 1.1s cubic-bezier(.22,1,.36,1) .7s both; }
  .lp-tab-panel { animation:lp-tab-in .3s ease both; }
  .lp-divider { height:1px; background:${P.border}; }

  @media (max-width:768px) {
    .lp-stat-block { border-right:none; border-bottom:1px solid ${P.border}; padding:28px 24px; }
    .lp-stat-block:last-child { border-bottom:none; }
    .lp-testimonial { border-right:none; border-bottom:1px solid ${P.border}; padding:0 0 28px 0 !important; }
    .lp-testimonial:last-child { border-bottom:none; padding-bottom:0 !important; }
    .lp-feat-card { padding:22px; }
  }
`

const FEATURES = [
  { n: '01', t: 'Dépenses & validation',   d: "Soumettez, joignez les justificatifs, et les responsables valident ou refusent en temps réel. Historique complet de chaque action." },
  { n: '02', t: 'Budgets & alertes',       d: "Allouez des enveloppes par équipe ou catégorie. Alertes automatiques à 80% et 100% d'utilisation." },
  { n: '03', t: 'Facturation client',      d: "Rédigez des devis professionnels et convertissez-les en factures d'une action. TVA marocaine intégrée." },
  { n: '04', t: 'Gestion de stock',        d: "Catalogue produits, mouvements entrée/sortie, seuil de réapprovisionnement automatique." },
  { n: '05', t: 'Fournisseurs & achats',   d: "Fiches fournisseurs avec RIB. Bons de commande de la création à la réception en quelques clics." },
  { n: '06', t: 'Plan comptable CGNC',     d: "Grand livre, balance et bilan conformes au PCGNM. Clôture d'exercice intégrée." },
]

const ROLES = [
  { id: 'owner', label: 'Company Owner', h: 'Vision globale, contrôle total.', d: "Supervisez l'ensemble de l'activité financière depuis un tableau de bord unifié.", p: ["Accès à tous les modules sans restriction", "Configuration entreprise — ICE, IF, RC, CNSS", "Gestion des utilisateurs et attribution des rôles", "Rapports financiers consolidés", "Modules ERP complets", "Remboursements et clôture comptable"] },
  { id: 'chef',  label: "Chef d'équipe",  h: 'Pilotez votre équipe avec précision.', d: "Validez les dépenses de votre équipe, suivez les budgets alloués.", p: ["Valider ou refuser les dépenses avec motif", "Vision complète sur les dépenses de l'équipe", "Suivi du budget en temps réel", "Accès aux modules ventes et achats", "Rapports d'activité de l'équipe", "Notifications de dépassement budgétaire"] },
  { id: 'equipe', label: 'Équipe', h: 'Simple, rapide, sans friction.', d: "Soumettez vos dépenses depuis n'importe où et suivez leur statut en temps réel.", p: ["Créer et soumettre des dépenses", "Attacher des justificatifs (PDF, image)", "Consulter les dépenses de son équipe", "Suivi de ses remboursements", "Consultation des budgets", "Notifications de validation et de refus"] },
]

const PLANS = [
  { name: 'Starter', m: 149, a: 119, desc: "Pour les équipes jusqu'à 5 personnes.", feat: ['5 utilisateurs', 'Dépenses illimitées', 'Budgets & catégories', 'Export CSV', 'Support email'], cta: "Commencer l'essai", featured: false },
  { name: 'Pro', m: 349, a: 279, desc: 'Pour les entreprises en croissance.', feat: ['25 utilisateurs', 'Tout Starter inclus', 'Modules ERP complets', 'Export PDF & Excel', 'Support prioritaire'], cta: "Commencer l'essai", featured: true },
  { name: 'Enterprise', m: null, a: null, desc: 'Pour les structures à grande échelle.', feat: ['Utilisateurs illimités', 'Tout Pro inclus', 'Multi-entreprises', 'API & intégrations', 'SLA 99,9% — Support dédié'], cta: 'Nous contacter', featured: false },
]

const TESTIMONIALS = [
  { q: "En trois mois, nos délais de remboursement sont passés de deux semaines à 48 heures. Un changement radical pour toute l'équipe.", a: 'Youssef Bennani', t: 'Directeur général, Groupe Amal' },
  { q: "La TVA marocaine intégrée nativement était notre principal frein. Taadbiir l'a résolu sans configuration supplémentaire.", a: 'Fatima-Zahra El Idrissi', t: 'Directrice financière, Agence Atlas' },
  { q: "Mes chefs d'équipe valident les dépenses depuis leur téléphone. Ce qui prenait des jours se fait maintenant en minutes.", a: 'Mehdi Tazi', t: 'Fondateur, TechSolutions Maroc' },
]

const row = (x = {}) => ({ display: 'flex', alignItems: 'center', ...x })
const col = (x = {}) => ({ display: 'flex', flexDirection: 'column', ...x })
const W = { maxWidth: 1120, margin: '0 auto', padding: '0 40px' }

function MockDashboard() {
  const rows = [
    { init: 'LB', name: 'Leila Benali',  desc: 'Vol Casa–Paris',    amt: '4 800 MAD', status: 'En attente', sc: '#F5EDD8', tc: '#8A6A2E' },
    { init: 'KO', name: 'Karim Ouali',   desc: 'Hôtel Marriott',    amt: '3 600 MAD', status: 'Approuvée',  sc: '#EBF4EF', tc: '#3D7A5F' },
    { init: 'SA', name: 'Sara Alami',    desc: 'Abonnements SaaS',  amt: '2 900 MAD', status: 'Payée',      sc: '#EBF0F7', tc: '#3D5A80' },
  ]
  return (
    <div style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px rgba(26,25,23,.12)' }}>
      <div style={{ background: P.bg, borderBottom: `1px solid ${P.border}`, padding: '10px 14px', ...row({ gap: 14 }) }}>
        <div style={row({ gap: 5 })}>
          {['#FC6058','#FEC02F','#2ACA44'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ flex: 1, background: P.white, border: `1px solid ${P.border}`, borderRadius: 6, padding: '5px 10px', fontSize: 10, color: P.muted, textAlign: 'center' }}>
          app.taadbiir.ma/dashboard
        </div>
      </div>
      <div style={row({ alignItems: 'stretch' })}>
        <div style={{ width: 150, borderRight: `1px solid ${P.border}`, padding: '18px 14px', flexShrink: 0 }}>
          <div style={{ ...row({ gap: 8 }), marginBottom: 22 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: P.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6.5" width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.95"/>
                <rect x="10.75" y="9" width="2.5" height="9" rx="1.25" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Taadbiir</span>
          </div>
          {['Dashboard', 'Dépenses', 'Validation', 'Budgets', 'Rapports'].map((item, i) => (
            <div key={item} style={{
              ...row({ gap: 7 }), padding: '6px 8px', borderRadius: 6, marginBottom: 2,
              background: i === 0 ? P.accentS : 'transparent',
              color: i === 0 ? P.accent : P.muted, fontSize: 10, fontWeight: i === 0 ? 500 : 400,
              borderLeft: i === 0 ? `2px solid ${P.accent}` : '2px solid transparent',
            }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: i === 0 ? P.accent : P.border, flexShrink: 0 }} />
              {item}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: P.bg, padding: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Total ce mois', value: '48 320 MAD', c: P.accent },
              { label: 'En attente',    value: '4',          c: '#8A6A2E' },
              { label: 'Remboursem.', value: '7 200 MAD',   c: '#8A3A3A' },
              { label: 'Budgets',      value: '5',          c: P.success },
            ].map(k => (
              <div key={k.label} style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 8, padding: '10px 12px', borderTop: `2px solid ${k.c}20` }}>
                <p style={{ fontSize: 8.5, color: P.muted, marginBottom: 4 }}>{k.label}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: P.ink }}>{k.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 8, padding: 14 }}>
            <div style={{ ...row({ justifyContent: 'space-between' }), marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 500 }}>Dépenses récentes</span>
              <span style={{ fontSize: 9, color: P.accent }}>Voir tout →</span>
            </div>
            {rows.map((r, i) => (
              <div key={i} style={{ ...row({ justifyContent: 'space-between' }), paddingBlock: 8, borderBottom: i < 2 ? `1px solid ${P.border}` : 'none' }}>
                <div style={row({ gap: 8 })}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: P.accentS, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6.5, fontWeight: 700, color: P.accent, flexShrink: 0 }}>{r.init}</div>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 500, marginBottom: 1 }}>{r.name}</p>
                    <p style={{ fontSize: 8, color: P.muted }}>{r.desc}</p>
                  </div>
                </div>
                <div style={row({ gap: 7 })}>
                  <span style={{ fontSize: 9, fontWeight: 600 }}>{r.amt}</span>
                  <span style={{ fontSize: 7.5, fontWeight: 500, padding: '2px 6px', borderRadius: 20, background: r.sc, color: r.tc }}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimCounter({ target, suffix = '', duration = 1600 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const start = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(ease * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      tick()
    }, { threshold: .3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])
  return <span ref={ref}>{val.toLocaleString('fr-MA')}{suffix}</span>
}

export default function LandingPage() {
  injectFonts()
  const [menu, setMenu] = useState(false)
  const [annual, setAnnual] = useState(false)
  const [role, setRole] = useState('owner')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const R = ROLES.find(r => r.id === role)

  return (
    <div className="lp" style={{ minHeight: '100vh' }}>
      <style>{GLOBAL_CSS}</style>

      {/* NAVBAR */}
      <header style={{ position: 'sticky', top: 0, zIndex: 200, background: scrolled ? 'rgba(248,246,242,.96)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: `1px solid ${scrolled ? P.border : 'transparent'}`, transition: 'all .3s' }}>
        <div style={{ ...W, height: 64, ...row({ justifyContent: 'space-between' }) }}>
          <div style={row({ gap: 10 })}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #3D5A80 0%, #1E3A5C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(61,90,128,.3)', flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6.5" width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.95"/>
                <rect x="10.75" y="9" width="2.5" height="9" rx="1.25" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.02em' }}>Taadbiir</span>
          </div>
          <nav style={row({ gap: 36 })} className="hidden md:flex">
            {[['Fonctionnalités', '#fonctionnalites'], ['Espaces', '#roles'], ['Tarifs', '#tarifs']].map(([l, h]) => (
              <a key={l} href={h} className="lp-nav-link">{l}</a>
            ))}
          </nav>
          <div style={row({ gap: 12 })} className="hidden md:flex">
            <Link to="/login" className="lp-nav-link">Connexion</Link>
            <Link to="/register" className="lp-btn-primary">Essai gratuit <ArrowRight size={13} /></Link>
          </div>
          <button onClick={() => setMenu(v => !v)} className="md:hidden" style={{ background: 'none', border: 'none', color: P.ink, padding: 4 }}>
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menu && (
          <div style={{ background: P.bg, borderTop: `1px solid ${P.border}`, padding: '20px 40px 28px' }}>
            {[['Fonctionnalités', '#fonctionnalites'], ['Espaces', '#roles'], ['Tarifs', '#tarifs']].map(([l, h]) => (
              <a key={l} href={h} onClick={() => setMenu(false)} style={{ display: 'block', padding: '12px 0', fontSize: 14, color: P.ink, borderBottom: `1px solid ${P.border}` }}>{l}</a>
            ))}
            <div style={{ ...col({ gap: 10 }), marginTop: 20 }}>
              <Link to="/login" className="lp-btn-ghost" style={{ justifyContent: 'center' }}>Connexion</Link>
              <Link to="/register" className="lp-btn-primary" style={{ justifyContent: 'center' }}>Essai gratuit</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 80, paddingBottom: 0 }}>
        <div style={{ ...W }}>
          <div className="lp-badge anim-in d1" style={{ marginBottom: 36 }}>
            <span className="lp-badge-dot" /> Solution ERP intelligente — PME &amp; Entrepreneurs
          </div>
          <div style={{ maxWidth: 780, marginBottom: 26 }}>
            <h1 className="serif anim-up d2" style={{ fontSize: 'clamp(42px,5.5vw,72px)', lineHeight: 1.06, letterSpacing: '-.03em', marginBottom: 6 }}>
              Gérez votre finance
            </h1>
            <h1 className="serif-i anim-up d3" style={{ fontSize: 'clamp(42px,5.5vw,72px)', lineHeight: 1.06, letterSpacing: '-.03em', color: P.accent, position: 'relative', display: 'inline-block' }}>
              avec intelligence.
              <div className="lp-scroll-line" />
            </h1>
          </div>
          <p className="anim-up d4" style={{ fontSize: 16, lineHeight: 1.8, color: P.muted, fontWeight: 300, maxWidth: 500, marginBottom: 40 }}>
            Automatisez vos dépenses, budgets, facturation, stock et comptabilité CGNC — tout dans une seule plateforme conçue pour les PME marocaines.
          </p>
          <div className="anim-up d5" style={row({ gap: 12, flexWrap: 'wrap', marginBottom: 18 })}>
            <Link to="/register" className="lp-btn-primary">Commencer gratuitement <ArrowRight size={13} /></Link>
            <Link to="/login" className="lp-btn-ghost">Voir la démo</Link>
          </div>
          <p className="anim-up d6" style={{ fontSize: 11.5, color: P.muted, fontWeight: 300, marginBottom: 68 }}>
            14 jours gratuits · Aucune carte bancaire · Annulable à tout moment
          </p>
          <div className="anim-up d7" style={{ maxWidth: 900, marginBottom: -2 }}>
            <MockDashboard />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: P.white, borderTop: `1px solid ${P.border}`, borderBottom: `1px solid ${P.border}` }}>
        <div style={{ ...W, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[{ val: 500, suf: '+', label: 'Entreprises actives' }, { val: 50000, suf: '+', label: 'Dépenses traitées' }, { val: 98, suf: '%', label: 'Taux de satisfaction' }, { val: 48, suf: 'h', label: 'Délai moyen de remboursement' }].map(s => (
            <div key={s.label} className="lp-stat-block">
              <p className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing: '-.03em', marginBottom: 10 }}>
                <span className="lp-number-shimmer"><AnimCounter target={s.val} suffix={s.suf} /></span>
              </p>
              <p style={{ fontSize: 13, color: P.muted, fontWeight: 300, lineHeight: 1.55 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="fonctionnalites" style={{ ...W, paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 64, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 96 }}>
            <p style={{ fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 18 }}>Fonctionnalités</p>
            <h2 className="serif" style={{ fontSize: 'clamp(24px,2.8vw,34px)', lineHeight: 1.18, letterSpacing: '-.02em', marginBottom: 18 }}>Tout ce dont votre entreprise a besoin</h2>
            <p style={{ fontSize: 13.5, color: P.muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 32 }}>Du ticket de caisse à la clôture comptable — une seule plateforme adaptée au cadre légal marocain.</p>
            <Link to="/register" className="lp-btn-primary">Démarrer <ArrowRight size={13} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: P.border }}>
            {FEATURES.map(f => (
              <div key={f.n} className="lp-feat-card">
                <p style={{ fontSize: 10, letterSpacing: '.10em', textTransform: 'uppercase', color: P.muted, marginBottom: 18 }}>{f.n}</p>
                <h3 style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-.01em', marginBottom: 10, lineHeight: 1.35 }}>{f.t}</h3>
                <p style={{ fontSize: 13, color: P.muted, lineHeight: 1.72, fontWeight: 300 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ROLES */}
      <section id="roles" style={{ ...W, paddingTop: 96, paddingBottom: 96 }}>
        <p style={{ fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 18 }}>3 espaces</p>
        <h2 className="serif" style={{ fontSize: 'clamp(24px,2.8vw,34px)', lineHeight: 1.18, letterSpacing: '-.02em', marginBottom: 44 }}>Un outil adapté à chaque rôle</h2>
        <div style={row({ marginBottom: 0 })}>
          {ROLES.map((r, i) => (
            <button key={r.id} onClick={() => setRole(r.id)} className={`lp-tab-btn ${role === r.id ? 'active' : ''}`}
              style={{ borderRight: i < 2 ? 'none' : `1px solid ${P.border}`, borderBottom: role === r.id ? 'none' : `1px solid ${P.border}` }}>
              {r.label}
            </button>
          ))}
          <div style={{ flex: 1, borderBottom: `1px solid ${P.border}` }} />
        </div>
        <div key={role} className="lp-tab-panel" style={{ border: `1px solid ${P.border}`, borderTop: 'none', background: P.white, padding: '48px 44px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52 }}>
          <div>
            <h3 className="serif" style={{ fontSize: 28, lineHeight: 1.2, letterSpacing: '-.02em', marginBottom: 16 }}>{R.h}</h3>
            <p style={{ fontSize: 14, color: P.muted, lineHeight: 1.75, fontWeight: 300, marginBottom: 32 }}>{R.d}</p>
            <Link to="/register" className="lp-btn-ghost">Créer un compte <ArrowRight size={13} /></Link>
          </div>
          <div>
            <p style={{ fontSize: 10.5, letterSpacing: '.10em', textTransform: 'uppercase', color: P.muted, marginBottom: 22 }}>Permissions</p>
            <ul style={{ listStyle: 'none', ...col({ gap: 12 }) }}>
              {R.p.map(p => (
                <li key={p} style={{ ...row({ gap: 10, fontSize: 13.5, lineHeight: 1.4 }) }}>
                  <Check size={13} style={{ color: P.accent, flexShrink: 0 }} />
                  <span style={{ color: P.ink }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ marginTop: 1, padding: '14px 20px', background: P.accentS, borderLeft: `3px solid ${P.accent}`, ...row({ gap: 28, flexWrap: 'wrap' }) }}>
          <p style={{ fontSize: 10.5, color: P.accent, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', flexShrink: 0 }}>Comptes démo</p>
          {[['Company Owner', 'owner@techmaroc.ma'], ["Chef d'équipe", 'chef@techmaroc.ma'], ['Équipe', 'equipe@techmaroc.ma']].map(([l, e]) => (
            <div key={e} style={row({ gap: 8 })}>
              <span style={{ fontSize: 12, color: P.muted }}>{l}</span>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: P.accent }}>{e}</span>
            </div>
          ))}
          <span style={{ fontSize: 12, color: P.muted }}>Mot de passe : <span style={{ fontFamily: 'monospace', color: P.ink }}>password</span></span>
        </div>
      </section>

      <div className="lp-divider" />

      {/* TESTIMONIALS */}
      <section style={{ ...W, paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ ...row({ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 20 }) }}>
          <div>
            <p style={{ fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 14 }}>Témoignages</p>
            <h2 className="serif" style={{ fontSize: 'clamp(24px,2.8vw,34px)', lineHeight: 1.18, letterSpacing: '-.02em' }}>Ils nous font confiance</h2>
          </div>
          <div style={row({ gap: 5 })}>
            {[...Array(5)].map((_, i) => <div key={i} style={{ width: 14, height: 14, background: P.gold, clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' }} />)}
            <span style={{ fontSize: 12.5, color: P.muted, marginLeft: 8 }}>4.9 / 5 · 200+ avis</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.a} className="lp-testimonial">
              <div style={{ width: 24, height: 2, background: P.accent, marginBottom: 24 }} />
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: P.ink, fontWeight: 300, marginBottom: 28, letterSpacing: '-.005em' }}>&ldquo;{t.q}&rdquo;</p>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: P.ink, marginBottom: 3 }}>{t.a}</p>
              <p style={{ fontSize: 12, color: P.muted }}>{t.t}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="lp-divider" />

      {/* PRICING */}
      <section id="tarifs" style={{ ...W, paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ ...row({ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 20 }) }}>
          <div>
            <p style={{ fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 14 }}>Tarifs</p>
            <h2 className="serif" style={{ fontSize: 'clamp(24px,2.8vw,34px)', lineHeight: 1.18, letterSpacing: '-.02em' }}>Simple et transparent</h2>
          </div>
          <div style={{ ...row({ gap: 12 }), padding: '10px 16px', background: P.white, border: `1px solid ${P.border}`, borderRadius: 10, fontSize: 13 }}>
            <span style={{ color: !annual ? P.ink : P.muted, fontWeight: !annual ? 500 : 400 }}>Mensuel</span>
            <button className={`lp-toggle ${annual ? 'on' : ''}`} onClick={() => setAnnual(v => !v)} />
            <span style={{ color: annual ? P.ink : P.muted, fontWeight: annual ? 500 : 400 }}>Annuel</span>
            {annual && <span style={{ fontSize: 11, background: '#EBF4EF', color: '#3D7A5F', padding: '3px 10px', borderRadius: 100, fontWeight: 500 }}>−20%</span>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: P.border }}>
          {PLANS.map(p => (
            <div key={p.name} className={`lp-plan-card ${p.featured ? 'featured' : ''}`}>
              {p.featured && <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 5 }}>★ Recommandé</div>}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 10.5, letterSpacing: '.10em', textTransform: 'uppercase', color: p.featured ? 'rgba(255,255,255,.35)' : P.muted, marginBottom: 7 }}>{p.name}</p>
                <p style={{ fontSize: 13, color: p.featured ? 'rgba(255,255,255,.45)' : P.muted, fontWeight: 300, lineHeight: 1.55 }}>{p.desc}</p>
              </div>
              {p.m ? (
                <div style={{ marginBottom: 28 }}>
                  <div style={row({ gap: 6, alignItems: 'baseline' })}>
                    <span className="serif" style={{ fontSize: 50, letterSpacing: '-.03em', lineHeight: 1, color: p.featured ? '#fff' : P.ink }}>{annual ? p.a : p.m}</span>
                    <span style={{ fontSize: 12.5, color: p.featured ? 'rgba(255,255,255,.35)' : P.muted }}>MAD/mois</span>
                  </div>
                  {annual && <p style={{ fontSize: 11, color: p.featured ? 'rgba(255,255,255,.25)' : P.muted, marginTop: 3 }}>Facturé {(annual ? p.a : p.m) * 12} MAD/an</p>}
                </div>
              ) : (
                <p className="serif" style={{ fontSize: 34, letterSpacing: '-.02em', marginBottom: 28, color: p.featured ? '#fff' : P.ink }}>Sur devis</p>
              )}
              <ul style={{ listStyle: 'none', ...col({ gap: 11 }), marginBottom: 32, flex: 1 }}>
                {p.feat.map(f => (
                  <li key={f} style={{ ...row({ gap: 10, fontSize: 13, fontWeight: 300 }), color: p.featured ? 'rgba(255,255,255,.7)' : P.ink }}>
                    <Check size={12} style={{ color: p.featured ? 'rgba(255,255,255,.45)' : P.accent, flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <Link to="/register" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', fontSize: 13, fontWeight: 500, letterSpacing: '.03em', borderRadius: 10, background: p.featured ? '#fff' : P.accent, color: p.featured ? P.ink : '#fff', transition: 'opacity .2s' }}>
                {p.cta} <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12.5, color: P.muted, marginTop: 24, fontWeight: 300 }}>14 jours d'essai gratuit · Annulable à tout moment · Sans engagement</p>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: P.ink, padding: '88px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(61,90,128,.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 24 }}>Prêt à commencer ?</p>
          <h2 className="serif" style={{ fontSize: 'clamp(30px,4vw,50px)', color: '#fff', letterSpacing: '-.025em', marginBottom: 18, lineHeight: 1.12 }}>Prenez le contrôle de votre finance d'entreprise.</h2>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,.4)', fontWeight: 300, lineHeight: 1.75, marginBottom: 40 }}>Rejoignez des centaines d'entreprises marocaines qui font confiance à Taadbiir pour automatiser et simplifier leur gestion financière.</p>
          <div style={row({ gap: 12, justifyContent: 'center', flexWrap: 'wrap' })}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', background: '#fff', color: P.ink, fontSize: 13, fontWeight: 500, letterSpacing: '.03em', borderRadius: 10 }}>Démarrer gratuitement <ArrowRight size={13} /></Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', background: 'transparent', color: 'rgba(255,255,255,.5)', fontSize: 13, border: '1px solid rgba(255,255,255,.15)', letterSpacing: '.02em', borderRadius: 10 }}>Se connecter</Link>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.22)', marginTop: 22, fontWeight: 300 }}>14 jours gratuits · Sans engagement · Support en français et arabe</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${P.border}`, background: P.bg }}>
        <div style={{ ...W, padding: '40px 40px', ...row({ justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }) }}>
          <div style={row({ gap: 10 })}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #3D5A80 0%, #1E3A5C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6.5" width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.95"/>
                <rect x="10.75" y="9" width="2.5" height="9" rx="1.25" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.01em' }}>Taadbiir</span>
            <span style={{ width: 1, height: 14, background: P.border, margin: '0 4px' }} />
            <span style={{ fontSize: 12.5, color: P.muted, fontWeight: 300 }}>Gestion financière intelligente pour PME</span>
          </div>
          <div style={row({ gap: 28, flexWrap: 'wrap' })}>
            {[['Fonctionnalités', '#fonctionnalites'], ['Espaces', '#roles'], ['Tarifs', '#tarifs'], ['Connexion', '/login']].map(([l, h]) => (
              <a key={l} href={h} className="lp-nav-link">{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: P.muted, fontWeight: 300 }}>© 2025 Taadbiir</p>
        </div>
      </footer>
    </div>
  )
}