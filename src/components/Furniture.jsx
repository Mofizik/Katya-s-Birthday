import { useState } from 'react'

const BASE = import.meta.env.BASE_URL
const TENTH = ['Да хватит меня трогать', 'Я ееееесть хочу', 'Я спаааать хочу', 'Фритюрница', 'I ❤️ you']

export default function Furniture() {
  const [open, setOpen] = useState(false) // secret cushion
  const [count, setCount] = useState(0)
  const [floats, setFloats] = useState([])

  const petCat = () => {
    const c = count + 1
    setCount(c)
    const text = c % 10 === 0 ? TENTH[Math.floor(Math.random() * TENTH.length)] : Math.random() < 0.5 ? 'Мурр' : 'Пшш'
    const id = Date.now() + Math.random()
    const dx = (Math.random() * 2 - 1) * 70
    const rot = (Math.random() * 2 - 1) * 14
    setFloats((f) => [...f, { id, text, dx, rot }])
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1500)
  }

  return (
    <div className="furniture">
      <div className="floorlamp-glow" />

      <svg className="f-plant" viewBox="0 0 120 160" preserveAspectRatio="xMidYMax meet">
        <path d="M60 90 C40 70 30 40 44 18 C52 40 56 56 60 78 C64 54 70 36 80 20 C88 44 84 72 60 90Z" fill="#1f3324" />
        <path d="M60 92 C44 84 24 80 14 60 C40 64 52 72 60 84 C68 70 84 60 106 60 C96 84 76 86 60 92Z" fill="#264033" />
        <path d="M40 100 h40 l-6 56 h-28 z" fill="#3a2415" />
        <path d="M40 100 h40 l-2 14 h-36 z" fill="#4a3120" />
      </svg>

      {/* couch with a secret behind the yellow cushion */}
      <div className="f-sofa-wrap">
        <svg className="f-sofa" viewBox="0 0 420 190" preserveAspectRatio="xMidYMax meet">
          <rect x="40" y="34" width="340" height="86" rx="26" fill="#3c524f" />
          <rect x="40" y="34" width="340" height="22" rx="11" fill="#46615d" />
          <rect x="18" y="70" width="48" height="92" rx="22" fill="#334845" />
          <rect x="354" y="70" width="48" height="92" rx="22" fill="#334845" />
          <rect x="52" y="104" width="316" height="60" rx="18" fill="#415854" />
          <rect x="66" y="100" width="138" height="40" rx="14" fill="#4b655f" />
          <rect x="216" y="100" width="138" height="40" rx="14" fill="#4b655f" />
          <rect x="74" y="58" width="64" height="64" rx="14" fill="#c2724f" transform="rotate(-8 106 90)" />
          <rect x="60" y="162" width="14" height="22" rx="4" fill="#241712" />
          <rect x="346" y="162" width="14" height="22" rx="4" fill="#241712" />
        </svg>
        <img className="secret-photo" src={BASE + 'girl.png'} alt="" />
        <button
          className={`cushion${open ? ' open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          onMouseLeave={() => setOpen(false)}
          aria-label="подушка"
        />
      </div>

      {/* the sleeping cat — click to pet */}
      <div className="f-cat-wrap" onClick={petCat}>
        <img className="f-cat" src={BASE + 'cat.png'} alt="" />
        {floats.map((f) => (
          <span key={f.id} className="cat-float" style={{ '--dx': `${f.dx}px`, '--rot': `${f.rot}deg` }}>
            {f.text}
          </span>
        ))}
      </div>

      <svg className="f-lamp" viewBox="0 0 80 240" preserveAspectRatio="xMidYMax meet">
        <path d="M22 40 H58 L66 96 H14 Z" fill="#e8b86a" opacity="0.92" />
        <path d="M22 40 H58 L60 56 H20 Z" fill="#f6d595" opacity="0.95" />
        <rect x="37" y="96" width="6" height="124" fill="#2c1d12" />
        <ellipse cx="40" cy="226" rx="26" ry="8" fill="#241712" />
      </svg>
    </div>
  )
}
