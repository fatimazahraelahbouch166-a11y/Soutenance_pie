/**
 * LoadingSkeleton — animated skeleton placeholders while data loads.
 * Usage:
 *   <LoadingSkeleton rows={5} />            // table rows skeleton
 *   <LoadingSkeleton type="cards" count={4} /> // card grid skeleton
 *   <LoadingSkeleton type="stat" count={4} />  // stat card skeleton
 */

function SkeletonPulse({ width = '100%', height = 14, radius = 6, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--ivory) 25%, var(--pearl) 50%, var(--ivory) 75%)',
      backgroundSize: '400% 100%',
      animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
      ...style,
    }} />
  )
}

function TableRowSkeleton() {
  return (
    <tr style={{ borderBottom: '1px solid var(--ivory)' }}>
      {[60, 160, 100, 80, 90, 70].map((w, i) => (
        <td key={i} style={{ padding: '13px 16px' }}>
          <SkeletonPulse width={w} height={12} />
        </td>
      ))}
    </tr>
  )
}

function CardSkeleton() {
  return (
    <div className="card-static" style={{ padding: 20 }}>
      <SkeletonPulse width="50%" height={12} style={{ marginBottom: 12 }} />
      <SkeletonPulse width="70%" height={22} style={{ marginBottom: 10 }} />
      <SkeletonPulse width="40%" height={10} />
    </div>
  )
}

export default function LoadingSkeleton({ type = 'table', rows = 6, count = 4 }) {
  return (
    <>
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {type === 'table' && (
        <table className="premium-table" style={{ width: '100%' }}>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      )}

      {(type === 'cards' || type === 'stat') && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(count, 4)}, 1fr)`,
          gap: 14,
        }}>
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}
    </>
  )
}
