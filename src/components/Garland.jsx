import Lantern from './Lantern.jsx'

const COLORS = ['#ffcf7a', '#ff9e6b', '#ffe1a0', '#7fb9b2', '#ffb86b', '#ff8f6b', '#ffd98a']

export default function Garland() {
  const W = 1000
  const H = 120
  const pts = [80, 220, 360, 500, 640, 780, 920]
  const sag = 60
  const y = (x) => 14 + sag * 4 * (x / W) * (1 - x / W)
  const path = `M0 14 Q${W / 2} ${14 + 2 * sag} ${W} 14`

  return (
    <div className="garland">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin meet" width="100%" aria-hidden="true">
        <path d={path} fill="none" stroke="#c9a164" strokeWidth="2.5" />
      </svg>
      {pts.map((x, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${(x / W) * 100}%`,
            top: `${(y(x) / H) * 100}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <Lantern color={COLORS[i % COLORS.length]} size={30} />
        </div>
      ))}
    </div>
  )
}
