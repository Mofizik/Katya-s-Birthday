export default function Lantern({ color = '#ffd07a', size = 30, off = false }) {
  const w = size
  const h = size * 1.25
  const body = off ? '#5c4a36' : color
  return (
    <svg width={w} height={h + 10} viewBox="0 0 40 60" style={{ overflow: 'visible', display: 'block' }} aria-hidden="true">
      {!off && <ellipse cx="20" cy="30" rx="26" ry="30" fill={color} opacity="0.22" />}
      <line x1="20" y1="2" x2="20" y2="9" stroke="#b88a4a" strokeWidth="2" />
      <ellipse cx="20" cy="30" rx="15" ry="19" fill={body} opacity={off ? 0.7 : 0.95} />
      {!off && <ellipse cx="20" cy="30" rx="15" ry="19" fill="url(#sheen)" opacity="0.5" />}
      <path d="M20 11 v38 M11 30 a9 19 0 0 1 18 0 a9 19 0 0 1 -18 0" stroke="#00000022" strokeWidth="1" fill="none" />
      <rect x="14" y="9" width="12" height="4" rx="2" fill="#c98f44" />
      <rect x="14" y="47" width="12" height="4" rx="2" fill="#c98f44" />
      <line x1="20" y1="51" x2="20" y2="58" stroke="#c98f44" strokeWidth="2" />
      <defs>
        <radialGradient id="sheen" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
