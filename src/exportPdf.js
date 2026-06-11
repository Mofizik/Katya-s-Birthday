import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

function firstImage(photo) {
  if (photo.images && photo.images.length) return photo.images[0]
  return photo.src || ''
}

// One A4 page = one polaroid card, filling the whole sheet. No background, no decor.
function buildCard(photo) {
  const node = document.createElement('div')
  node.style.cssText = `
    position:fixed; left:-10000px; top:0; width:794px; height:1123px; overflow:hidden;
    box-sizing:border-box; padding:64px 64px 0; background:#fbf5e6;
    font-family:'Nunito',system-ui,sans-serif; display:flex; flex-direction:column; align-items:center;
  `
  const main = firstImage(photo)
  const video = /\.(mp4|mov|webm|ogg|m4v)$/i.test(main || '')
  const photoHtml =
    main && !video
      ? `<div style="width:666px;height:760px;border-radius:2px;background:#e7dcc6 url('${main}') center center / cover no-repeat;"></div>`
      : `<div style="width:666px;height:760px;border-radius:2px;display:flex;align-items:center;justify-content:center;color:#a8997e;font-weight:700;font-size:30px;background:repeating-linear-gradient(45deg,#efe6d4,#efe6d4 22px,#e6dac3 22px,#e6dac3 44px);">${video ? '🎬 видео' : '📷 фото'}</div>`

  node.innerHTML = `
    ${photoHtml}
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;padding:8px 20px;">
      <div style="font-family:'Caveat',cursive;font-weight:700;font-size:62px;line-height:1.05;color:#4a3a28;text-align:center;max-width:660px;">${photo.caption || ''}</div>
      ${photo.author ? `<div style="font-family:'Caveat',cursive;font-size:38px;color:#8a7860;margin-top:8px;">\u2014 ${photo.author}</div>` : ''}
    </div>
  `
  return node
}

async function waitImages(node) {
  const imgs = [...node.querySelectorAll('img')]
  await Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth
        ? Promise.resolve()
        : new Promise((res) => {
            img.onload = res
            img.onerror = res
          }),
    ),
  )
}

function preload(url) {
  return new Promise((res) => {
    if (!url) return res()
    const im = new Image()
    im.onload = res
    im.onerror = res
    im.src = url
  })
}

export async function exportCardsPdf(data) {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready
    } catch {}
  }
  const photos = (data && data.photos) || []
  if (!photos.length) return

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  for (let i = 0; i < photos.length; i++) {
    const main = firstImage(photos[i])
    const isVid = /\.(mp4|mov|webm|ogg|m4v)$/i.test(main || '')
    if (main && !isVid) await preload(main)
    const node = buildCard(photos[i])
    document.body.appendChild(node)
    try {
      await waitImages(node)
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: '#fbf5e6',
        useCORS: true,
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
      })
      const img = canvas.toDataURL('image/jpeg', 0.92)
      if (i > 0) pdf.addPage()
      pdf.addImage(img, 'JPEG', 0, 0, 210, 297)
    } finally {
      document.body.removeChild(node)
    }
  }

  pdf.save('vospominaniya.pdf')
}
