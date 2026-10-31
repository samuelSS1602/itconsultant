// Abstract illustration for each case study, drawn in SVG so the site needs no image files.
// Each motif hints at the project: delivery routes, bank bars, a heartbeat, a store grid…
// The classes (m-draw, m-grow, m-pop, m-spin, m-flow) and --i delays are animated in CSS
// once the artwork scrolls into view; see "Motif animation" in styles.css.
export default function Motif({ kind, color }) {
  const stroke = 'rgba(255,255,255,0.9)'
  const faint = 'rgba(255,255,255,0.28)'

  const art = {
    routes: (
      <>
        {[...Array(7)].map((_, i) => (
          <line key={i} x1="0" y1={30 + i * 40} x2="400" y2={30 + i * 40} stroke={faint} strokeWidth="1" />
        ))}
        <path className="m-draw" pathLength="1" d="M30 250 C 90 250, 90 140, 160 140 S 230 60, 300 70 S 370 160, 380 40" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        <path className="m-flow" d="M30 190 C 110 190, 140 230, 220 210 S 330 120, 380 150" fill="none" stroke={faint} strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
        {[[30, 250], [160, 140], [300, 70], [380, 40]].map(([x, y], i) => (
          <circle key={x} className="m-pop" style={{ '--i': i * 4 + 4 }} cx={x} cy={y} r="8" fill={color} stroke={stroke} strokeWidth="4" />
        ))}
      </>
    ),
    bars: (
      <>
        {[60, 110, 90, 150, 130, 190, 170, 230].map((h, i) => (
          <rect key={i} className="m-grow" style={{ '--i': i }} x={30 + i * 45} y={280 - h} width="26" height={h} rx="3" fill={i === 7 ? '#2B4EFF' : faint} />
        ))}
        <path className="m-draw" pathLength="1" d="M43 210 L88 170 L133 190 L178 130 L223 150 L268 90 L313 110 L358 50" fill="none" stroke={stroke} strokeWidth="3" />
      </>
    ),
    pulse: (
      <>
        {[...Array(9)].map((_, i) => (
          <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="300" stroke={faint} strokeWidth="1" />
        ))}
        <path className="m-draw" pathLength="1" d="M0 160 H110 L135 100 L160 230 L185 60 L210 190 L230 160 H400" fill="none" stroke={stroke} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <g className="m-pop" style={{ '--i': 12 }}>
          <circle cx="330" cy="80" r="34" fill="none" stroke={stroke} strokeWidth="3" />
          <path d="M330 62 V98 M312 80 H348" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
        </g>
      </>
    ),
    grid: (
      <>
        {[...Array(6)].map((_, r) =>
          [...Array(9)].map((_, c) => {
            const lit = (r * 9 + c) % 7 === 0 || (r === 2 && c > 4)
            return <rect key={`${r}-${c}`} className="m-pop" style={{ '--i': r + c }} x={22 + c * 41} y={28 + r * 42} width="30" height="30" rx="6" fill={lit ? stroke : faint} />
          })
        )}
      </>
    ),
    rings: (
      <>
        {[40, 75, 110, 145].map((r, i) => (
          <circle key={r} className="m-pop" style={{ '--i': i * 2 }} cx="200" cy="150" r={r} fill="none" stroke={faint} strokeWidth="2" />
        ))}
        <circle cx="200" cy="150" r="22" fill={stroke} />
        <g className="m-spin">
          {[...Array(12)].map((_, i) => {
            const a = (i / 12) * Math.PI * 2
            return <line key={i} x1={200 + Math.cos(a) * 32} y1={150 + Math.sin(a) * 32} x2={200 + Math.cos(a) * 48} y2={150 + Math.sin(a) * 48} stroke={stroke} strokeWidth="4" strokeLinecap="round" />
          })}
        </g>
        {[[90, 70], [320, 90], [300, 240], [110, 230]].map(([x, y], i) => (
          <circle key={x} className="m-pop" style={{ '--i': 8 + i }} cx={x} cy={y} r="7" fill={stroke} />
        ))}
      </>
    ),
    dots: (
      <>
        {[...Array(8)].map((_, r) =>
          [...Array(13)].map((_, c) => {
            const d = Math.hypot(c - 6, r - 3.5)
            return <circle key={`${r}-${c}`} className="m-pop" style={{ '--i': Math.round(d * 1.5) }} cx={20 + c * 30} cy={45 + r * 30} r={Math.max(1.5, 9 - d * 1.3)} fill={d < 3 ? stroke : faint} />
          })
        )}
      </>
    ),
  }

  return (
    <svg className="motif" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ background: color }}>
      {art[kind]}
    </svg>
  )
}
