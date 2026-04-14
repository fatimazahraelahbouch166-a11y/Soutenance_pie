export default function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8F6F2 0%, #EBF0F7 50%, #F3F0EA 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      {/* Background orbs */}
      <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, left: -120, width: 380, height: 380, borderRadius: '50%', background: 'rgba(61,90,128,.07)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 320, height: 320, borderRadius: '50%', background: 'rgba(61,90,128,.05)', filter: 'blur(50px)' }} />
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
        {/* Brand block */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {/* Logo mark */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: 18,
            background: 'linear-gradient(135deg, #3D5A80 0%, #1E3A5C 100%)',
            boxShadow: '0 8px 24px rgba(61,90,128,.35)',
            marginBottom: 16,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6.5" width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.95"/>
              <rect x="10.75" y="9" width="2.5" height="9" rx="1.25" fill="white" fillOpacity="0.95"/>
              <path d="M8 18h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.45"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#181715', letterSpacing: '-0.03em', marginBottom: 5, fontFamily: "'Geist', system-ui, sans-serif" }}>
            Taadbiir
          </h1>
          <p style={{ fontSize: 13, color: '#8A8780', fontFamily: "'Geist', system-ui, sans-serif" }}>
            Gestion financière intelligente pour PME
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: '1px solid #ECE9E3',
          boxShadow: '0 8px 32px rgba(26,25,23,.08), 0 2px 8px rgba(26,25,23,.04)',
          padding: 36,
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
