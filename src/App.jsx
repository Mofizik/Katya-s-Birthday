import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Room from './components/Room.jsx'
import Garland from './components/Garland.jsx'
import Lantern from './components/Lantern.jsx'
import Furniture from './components/Furniture.jsx'

const BASE = import.meta.env.BASE_URL
const rand = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}
const WARM = ['#ffcf7a', '#ff9e6b', '#ffd98a', '#ffb86b', '#ff8f6b']
const colsFor = (w) => (w >= 1180 ? 5 : w >= 920 ? 4 : w >= 640 ? 3 : 2)
const isVideo = (u) => /\.(mp4|mov|webm|ogg|m4v)$/i.test(u || '')

function Polaroid({ item, width, rot, onSelect }) {
  const first = (item.images && item.images[0]) || item.src
  return (
    <div
      className="polaroid"
      style={{ width, transform: `rotate(${rot}deg)` }}
      role="button"
      tabIndex={0}
      onClick={(e) => onSelect(item, e.currentTarget, rot)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(item, e.currentTarget, rot)
        }
      }}
    >
      {first ? (
        isVideo(first) ? (
          <video className="pic" src={first + '#t=0.1'} muted preload="metadata" playsInline />
        ) : (
          <img className="pic" src={first} alt={item.caption || ''} loading="lazy" />
        )
      ) : (
        <div className="ph">
          <span>📷</span>фото
        </div>
      )}
      <figcaption>
        <div className="cap">{item.caption}</div>
        {item.author && <div className="who">— {item.author}</div>}
      </figcaption>
    </div>
  )
}

const DIRS = [
  [0, 0],
  [1.0, -0.55],
  [-1.0, -0.5],
  [0.85, 0.62],
  [-0.82, 0.55],
  [0.25, -1.0],
  [-0.3, 0.95],
]
function stackTransform(p, expanded) {
  if (p === 0) return 'translate(-50%, -50%)'
  const [ux, uy] = DIRS[p % DIRS.length]
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const dist = expanded ? Math.max(64, Math.min(150, vw * 0.12)) : 26
  const rot = (ux >= 0 ? 1 : -1) * (expanded ? 9 : 4)
  const scale = 1 - p * 0.04
  return `translate(calc(-50% + ${ux * dist}px), calc(-50% + ${uy * dist}px)) rotate(${rot}deg) scale(${scale})`
}

function StackedPhotos({ images }) {
  const [order, setOrder] = useState(() => images.map((_, i) => i))
  const [expanded, setExpanded] = useState(false)
  const n = images.length

  const click = (img) => {
    const p = order.indexOf(img)
    if (p === 0) {
      setExpanded((e) => !e)
    } else {
      setOrder((o) => [img, ...o.filter((x) => x !== img)])
      setExpanded(false)
    }
  }

  return (
    <div className="stack">
      {order.map((img, p) => {
        const url = images[img]
        const style = { transform: stackTransform(p, expanded), zIndex: n - p }
        if (isVideo(url)) {
          return (
            <div key={img} className="stack-photo stack-vid-wrap" style={style}>
              <video src={url} controls preload="metadata" playsInline />
            </div>
          )
        }
        return (
          <button key={img} className="stack-photo" style={style} onClick={() => click(img)} aria-label="фото">
            <img src={url} alt="" />
          </button>
        )
      })}
    </div>
  )
}

function LanternToggle({ id, color, size, off, onToggle, register, unregister }) {
  useEffect(() => {
    register(id)
    return () => unregister(id)
  }, [id, register, unregister])
  return (
    <button
      className="lantern-btn"
      onClick={(e) => {
        e.stopPropagation()
        onToggle(id)
      }}
      title={off ? 'включить фонарик' : 'выключить фонарик'}
      aria-label="фонарик"
    >
      <Lantern color={color} size={size} off={off} />
    </button>
  )
}

function polSize(width, cols) {
  const gap = 18
  const MAXW = width >= 1200 ? 184 : width >= 860 ? 170 : 148
  const colW = (width - 60) / cols
  const polW = Math.max(112, Math.min(colW - gap, MAXW))
  const polH = 9 + (polW - 18) + 7 + 52 + 12
  return { polW, polH }
}

function RopeRow({ items, width, cols, rowIndex, startIndex, nail, hideCards, isOff, onToggle, register, unregister, onSelect }) {
  const n = items.length
  const innerPad = 30
  const usable = width - innerPad * 2
  const baseTop = 70
  const PEG_H = 24
  const half = width / 2
  const { polW, polH } = polSize(width, cols)

  let ropeY
  let nailY = null
  let placed

  if (nail) {
    const sagHalf = Math.min(Math.max(width * 0.06, 42), 92)
    nailY = baseTop - 18
    ropeY = (x) => {
      if (x <= half) {
        const t = x / half
        return baseTop + (nailY - baseTop) * t + sagHalf * 4 * t * (1 - t)
      }
      const t = (x - half) / half
      return nailY + (baseTop - nailY) * t + sagHalf * 4 * t * (1 - t)
    }
    const midGap = Math.min(width * 0.08, 96)
    const L = Math.ceil(n / 2)
    const R = n - L
    const lw = half - midGap / 2 - innerPad
    const rStart = half + midGap / 2
    const rw = width - innerPad - rStart
    placed = []
    for (let k = 0; k < L; k++) placed.push({ it: items[k], x: innerPad + (k + 0.5) * (lw / L) })
    for (let k = 0; k < R; k++) placed.push({ it: items[L + k], x: rStart + (k + 0.5) * (rw / R) })
  } else {
    const sag = Math.min(Math.max(width * 0.085, 56), 120)
    const maxTilt = Math.min(width * 0.028, 48)
    const tilt = (rand(rowIndex * 9 + 5) * 2 - 1) * maxTilt
    const leftY = baseTop - tilt
    const rightY = baseTop + tilt
    ropeY = (x) => {
      const t = x / width
      return leftY + (rightY - leftY) * t + sag * 4 * t * (1 - t)
    }
    placed = items.map((it, j) => ({ it, x: innerPad + (j + 0.5) * (usable / n) }))
  }

  placed = placed.map((p, j) => ({
    ...p,
    top: ropeY(p.x) - 5,
    rot: rand(startIndex + j) * 12 - 6,
    strLen: 16 + rand(startIndex + j + 31) * 30,
  }))

  let d = `M0 ${ropeY(0).toFixed(1)}`
  const SEG = 36
  for (let k = 1; k <= SEG; k++) {
    const x = (width * k) / SEG
    d += ` L${x.toFixed(1)} ${ropeY(x).toFixed(1)}`
  }
  const rowH = Math.max(...placed.map((p) => p.top + PEG_H + p.strLen + polH)) + 18

  const xs = placed.map((p) => p.x).sort((a, b) => a - b)
  const mids = []
  for (let i = 1; i < xs.length; i++) mids.push((xs[i - 1] + xs[i]) / 2)
  if (mids.length === 0) mids.push(half)
  const step = Math.max(1, Math.ceil(mids.length / 3))
  const lanterns = mids
    .filter((_, k) => k % step === 0)
    .slice(0, 3)
    .map((x, k) => ({ x, y: ropeY(x), id: `${rowIndex}:${k}`, color: WARM[(rowIndex + k) % WARM.length] }))

  return (
    <div className="row" style={{ height: rowH }}>
      <svg className="rope" width={width} height={rowH} aria-hidden="true">
        <path d={d} stroke="#8a6a39" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d={d} stroke="#caa56a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="2" cy={ropeY(0)} r="4.5" fill="#6f561d" />
        <circle cx={width - 2} cy={ropeY(width)} r="4.5" fill="#6f561d" />
        {nail && (
          <g>
            <circle cx={half} cy={nailY} r="5.5" fill="#5a4017" />
            <circle cx={half} cy={nailY} r="2.4" fill="#d8b66e" />
          </g>
        )}
      </svg>

      {lanterns.map(({ x, y, id, color }) => {
        const dead = isOff(id)
        return (
          <div key={id}>
            {!dead && (
              <div
                className="glow"
                style={{ left: x, top: y + 80, background: `radial-gradient(circle, ${color}aa 0%, ${color}3a 36%, transparent 72%)` }}
              />
            )}
            <div className="lantern" style={{ left: x, top: y - 1, transform: 'translateX(-50%)' }}>
              <LanternToggle id={id} color={color} size={26} off={dead} onToggle={onToggle} register={register} unregister={unregister} />
            </div>
          </div>
        )
      })}

      {!hideCards &&
        placed.map((p, j) => (
          <div key={j} className="hang" style={{ left: p.x, top: p.top, transform: 'translateX(-50%)' }}>
            <div className="peg" />
            <div className="string" style={{ height: p.strLen }} />
            <Polaroid item={p.it} width={polW} rot={p.rot} onSelect={onSelect} />
          </div>
        ))}
    </div>
  )
}

function Scream({ onRevive }) {
  useEffect(() => {
    const a = new Audio(BASE + 'scream.mp3')
    a.volume = 0.9
    a.play().catch(() => {})
    return () => {
      a.pause()
      a.currentTime = 0
    }
  }, [])
  return (
    <div className="scream">
      <img className="scream-img" src={BASE + 'scream.png'} alt="" />
      <button className="revive" onClick={onRevive} aria-label="Включить свет">
        <Lantern color="#ffcf7a" size={44} />
      </button>
      <div className="scream-hint">…нажми на фонарик</div>
    </div>
  )
}

function Modal({ item, source, onClose }) {
  const overlayRef = useRef(null)
  const modalRef = useRef(null)

  const startTransform = () => {
    const m = modalRef.current
    if (!m || !source) return 'none'
    const tr = m.getBoundingClientRect()
    const sx = source.rect.left + source.rect.width / 2
    const sy = source.rect.top + source.rect.height / 2
    const tx = tr.left + tr.width / 2
    const ty = tr.top + tr.height / 2
    const sc = Math.min(0.92, source.rect.width / tr.width)
    return `translate(${sx - tx}px, ${sy - ty}px) scale(${sc}) rotate(${source.rot || 0}deg)`
  }

  useLayoutEffect(() => {
    const m = modalRef.current
    const ov = overlayRef.current
    if (!m || !ov) return
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!source || reduce) {
      ov.style.opacity = '1'
      m.style.opacity = '1'
      return
    }
    m.style.transition = 'none'
    m.style.transformOrigin = 'center center'
    m.style.transform = startTransform()
    m.style.opacity = '0.55'
    ov.style.transition = 'none'
    ov.style.opacity = '0'
    void m.offsetWidth // reflow
    m.style.transition = 'transform .33s cubic-bezier(.2,.8,.25,1), opacity .22s ease'
    m.style.transform = 'translate(0,0) scale(1) rotate(0deg)'
    m.style.opacity = '1'
    ov.style.transition = 'opacity .33s ease'
    ov.style.opacity = '1'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source])

  const animateClose = useCallback(() => {
    const m = modalRef.current
    const ov = overlayRef.current
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!m || !ov || !source || reduce) {
      onClose()
      return
    }
    m.style.transition = 'transform .3s cubic-bezier(.4,0,.6,1), opacity .3s ease'
    m.style.transform = startTransform()
    m.style.opacity = '0.15'
    ov.style.transition = 'opacity .3s ease'
    ov.style.opacity = '0'
    let done = false
    const finish = () => {
      if (done) return
      done = true
      onClose()
    }
    m.addEventListener('transitionend', finish, { once: true })
    setTimeout(finish, 360)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, onClose])

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && animateClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [animateClose])

  const imgs = item.images && item.images.length ? item.images : item.src ? [item.src] : []

  return (
    <div className="overlay" ref={overlayRef} style={{ opacity: 0 }} onClick={animateClose}>
      <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={animateClose} aria-label="Закрыть">
          ✕
        </button>
        {imgs.length ? (
          <StackedPhotos images={imgs} />
        ) : (
          <div className="stack">
            <div className="mph">
              <span>📷</span>фото
            </div>
          </div>
        )}
        {item.author && <div className="mwho">— {item.author}</div>}
        {item.text && <div className="mtext">{item.text}</div>}
      </div>
    </div>
  )
}

function GiftBox() {
  return (
    <svg viewBox="0 0 200 200" width="210" height="210" aria-hidden="true">
      <ellipse cx="100" cy="178" rx="70" ry="12" fill="rgba(0,0,0,.4)" />
      <rect x="42" y="86" width="116" height="86" rx="6" fill="#b5462f" />
      <rect x="42" y="86" width="116" height="20" fill="#a03c28" />
      <rect x="34" y="66" width="132" height="30" rx="6" fill="#c75740" />
      <rect x="90" y="66" width="20" height="106" fill="#ffd98a" />
      <rect x="90" y="86" width="20" height="86" fill="#ffcf7a" />
      <path d="M100 66 C76 36 44 44 56 64 C64 78 88 70 100 66Z" fill="#ffe1a0" />
      <path d="M100 66 C124 36 156 44 144 64 C136 78 112 70 100 66Z" fill="#ffe1a0" />
      <circle cx="100" cy="64" r="9" fill="#ffd07a" />
    </svg>
  )
}

export default function App() {
  const [data, setData] = useState(null)
  const [width, setWidth] = useState(0)
  const [sel, setSel] = useState(null)
  const [offSet, setOffSet] = useState(() => new Set())
  const [pdfBusy, setPdfBusy] = useState(false)
  const [phase, setPhase] = useState(() => {
    try {
      return localStorage.getItem('lis_visited') ? 'done' : 'gift'
    } catch {
      return 'done'
    }
  })
  const idsRef = useRef(new Set())
  const ref = useRef(null)

  const openGift = () => {
    if (phase === 'gift') setPhase('opening')
  }

  // lock scrolling while the gift intro is on screen
  useEffect(() => {
    if (phase !== 'done') {
      window.scrollTo(0, 0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [phase])

  // cards fly out of the gift to their spots on the ropes
  useLayoutEffect(() => {
    if (phase !== 'opening') return
    const wall = ref.current
    const finish = (hangs) => {
      ;(hangs || []).forEach((el) => {
        el.style.transition = ''
      })
      try {
        localStorage.setItem('lis_visited', '1')
      } catch {}
      setPhase('done')
    }
    if (!wall) {
      finish()
      return
    }
    const hangs = [...wall.querySelectorAll('.hang')]
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hangs.length || reduce) {
      finish(hangs)
      return
    }
    const gcx = window.innerWidth / 2
    const gcy = window.innerHeight / 2
    hangs.forEach((el) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      el.style.transition = 'none'
      el.style.transform = `translateX(-50%) translate(${gcx - cx}px, ${gcy - cy}px) scale(.06)`
      el.style.opacity = '0'
    })
    void wall.offsetWidth
    let maxEnd = 0
    hangs.forEach((el, i) => {
      const delay = i * 0.035
      const dur = 0.5
      maxEnd = Math.max(maxEnd, delay + dur)
      el.style.transition = `transform ${dur}s cubic-bezier(.2,.8,.25,1) ${delay}s, opacity .28s ease ${delay}s`
      el.style.transform = 'translateX(-50%)'
      el.style.opacity = '1'
    })
    const t = setTimeout(() => finish(hangs), (maxEnd + 0.12) * 1000)
    return () => clearTimeout(t)
  }, [phase])

  const onSave = async () => {
    if (pdfBusy || !data) return
    setPdfBusy(true)
    try {
      const { exportCardsPdf } = await import('./exportPdf.js')
      await exportCardsPdf(data)
    } catch (e) {
      console.error(e)
    } finally {
      setPdfBusy(false)
    }
  }

  const select = (item, el, rot) => {
    const r = el.getBoundingClientRect()
    setSel({ item, source: { rect: { left: r.left, top: r.top, width: r.width, height: r.height }, rot } })
  }

  useEffect(() => {
    fetch(BASE + 'data.json?t=' + Date.now(), { cache: 'no-store' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ name: '', short: '', photos: [] }))
  }, [])

  useLayoutEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [data])

  const register = useCallback((id) => idsRef.current.add(id), [])
  const unregister = useCallback((id) => idsRef.current.delete(id), [])
  const isOff = useCallback((id) => offSet.has(id), [offSet])
  const toggle = useCallback((id) => {
    setOffSet((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }, [])
  const revive = () => setOffSet(new Set())

  const ids = idsRef.current
  const allOff = ids.size > 0 && [...ids].every((id) => offSet.has(id))

  const cols = colsFor(width)
  const rows = []
  if (data) {
    for (let i = 0; i < data.photos.length; i += cols) rows.push(data.photos.slice(i, i + cols))
  }

  return (
    <>
      <Room />
      <div className="page">
        <div className="container">
          <Garland />
          {data && (
            <div className="hero">
              <h1>С Днём Рождения, {data.name}!</h1>
              {data.subtitle && <p className="sub">{data.subtitle}</p>}
            </div>
          )}
        </div>

        <div className={`wall${sel ? ' dimmed' : ''}`} ref={ref}>
          {!data && <div className="loading">Загружаем воспоминания…</div>}
          {data &&
            width > 0 &&
            rows.map((items, ri) => (
              <RopeRow
                key={ri}
                items={items}
                width={width}
                cols={cols}
                rowIndex={ri}
                startIndex={ri * cols}
                nail={ri % 3 === 1 && items.length >= 4}
                hideCards={phase === 'gift'}
                isOff={isOff}
                onToggle={toggle}
                register={register}
                unregister={unregister}
                onSelect={select}
              />
            ))}
        </div>

        <div className="container foot">
          <footer>
            с любовью, твоя компания <span className="heart">♥</span>
          </footer>
        </div>

        {phase === 'done' && <Furniture />}
        {data && data.photos && data.photos.length > 0 && phase === 'done' && (
          <button className="save-btn" onClick={onSave} disabled={pdfBusy}>
            {pdfBusy ? 'Готовлю PDF…' : '💾 Сохранить в PDF'}
          </button>
        )}
      </div>

      {phase === 'gift' && (
        <div className="gift-overlay">
          <button className="gift" onClick={openGift} aria-label="Открыть подарок">
            <GiftBox />
            <span className="gift-hint">Нажми, чтобы открыть 🎁</span>
          </button>
        </div>
      )}

      {sel && <Modal item={sel.item} source={sel.source} onClose={() => setSel(null)} />}
      {allOff && <Scream onRevive={revive} />}
    </>
  )
}
