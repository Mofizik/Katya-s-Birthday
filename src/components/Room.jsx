function Shelf({ pos, children }) {
  return (
    <div className={`deco-shelf ${pos}`}>
      <span className="bracket l" />
      <span className="bracket r" />
      <div className="toy">{children}</div>
    </div>
  )
}

const Cat = () => (
  <svg viewBox="0 0 60 66" width="46">
    <path d="M14 62 Q9 26 22 20 L17 7 L28 18 Q30 17 32 18 L43 7 L38 22 Q51 28 46 62 Z" fill="#39323e" />
    <path d="M45 60 Q60 56 53 40 Q51 53 44 53 Z" fill="#39323e" />
    <circle cx="24" cy="35" r="2.1" fill="#ffd36b" />
    <circle cx="36" cy="35" r="2.1" fill="#ffd36b" />
  </svg>
)
const Gnome = () => (
  <svg viewBox="0 0 60 72" width="42">
    <path d="M30 5 L47 41 H13 Z" fill="#b5462f" />
    <path d="M30 5 L40 26 H20 Z" fill="#c75740" />
    <circle cx="30" cy="45" r="11" fill="#e8c9a0" />
    <path d="M19 45 Q30 72 41 45 Q30 53 19 45 Z" fill="#f2efe9" />
    <circle cx="30" cy="47" r="3.4" fill="#d79e7e" />
    <path d="M20 57 Q30 51 40 57 L42 68 H18 Z" fill="#5a7d6f" />
  </svg>
)
const Flower = () => (
  <svg viewBox="0 0 60 72" width="40">
    <rect x="21" y="50" width="18" height="18" rx="3" fill="#a85a36" />
    <rect x="19" y="46" width="22" height="8" rx="3" fill="#c46f42" />
    <path d="M30 50 V28" stroke="#4f7d4a" strokeWidth="3" />
    <path d="M30 42 q9 -3 11 -12" stroke="#4f7d4a" strokeWidth="2.4" fill="none" />
    <circle cx="30" cy="15" r="6" fill="#e98aa8" />
    <circle cx="22" cy="21" r="6" fill="#e98aa8" />
    <circle cx="38" cy="21" r="6" fill="#e98aa8" />
    <circle cx="25" cy="29" r="6" fill="#e98aa8" />
    <circle cx="35" cy="29" r="6" fill="#e98aa8" />
    <circle cx="30" cy="22" r="5" fill="#ffd36b" />
  </svg>
)

export default function Room() {
  return (
    <div className="room" aria-hidden="true">
      <div className="lamp-glow" />

      <svg className="window" viewBox="0 0 200 280" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d2b4a" />
            <stop offset="0.55" stopColor="#2a3b5c" />
            <stop offset="0.8" stopColor="#5b5273" />
            <stop offset="1" stopColor="#8a6a5a" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="188" height="268" rx="6" fill="#2a1d11" />
        <rect x="16" y="16" width="168" height="248" fill="url(#sky)" />
        <circle cx="60" cy="60" r="15" fill="#f3ead0" opacity="0.85" />
        <circle cx="120" cy="45" r="1.6" fill="#fff" opacity="0.7" />
        <circle cx="150" cy="80" r="1.4" fill="#fff" opacity="0.6" />
        <rect x="98" y="16" width="4" height="248" fill="#2a1d11" />
        <rect x="16" y="138" width="168" height="4" fill="#2a1d11" />
        <rect x="0" y="270" width="200" height="10" rx="3" fill="#23170d" />
      </svg>

      <div className="frame f1" />
      <div className="frame f2" />

      {/* decorative background shelves with little figurines */}
      <Shelf pos="s1"><Cat /></Shelf>
      <Shelf pos="s2"><Gnome /></Shelf>
      <Shelf pos="s3"><Flower /></Shelf>

      <svg className="fairy" viewBox="0 0 1000 40" preserveAspectRatio="none">
        <path d="M0 8 Q125 30 250 12 T500 8 T750 12 T1000 8" fill="none" stroke="#6b5535" strokeWidth="1.5" />
      </svg>

      <div className="grain" />
      <div className="vignette" />
    </div>
  )
}
