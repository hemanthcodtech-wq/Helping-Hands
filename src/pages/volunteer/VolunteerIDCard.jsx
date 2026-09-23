import { useRef, useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { useApp } from "../../context/AppContext"
import Logo from "../../components/Common/Logo"
import FadeIn from "../../components/Common/FadeIn"

export default function VolunteerIDCard() {
  const { loggedInVolunteer, globalSettings } = useApp()
  const me = loggedInVolunteer || {}
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = src
    })

  const roundedRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const W = 700, H = 960
      const canvas = document.createElement("canvas")
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext("2d")

      // Card background
      roundedRect(ctx, 0, 0, W, H, 24)
      ctx.fillStyle = "#ffffff"
      ctx.fill()

      // Green header (rounded top, straight bottom)
      ctx.save()
      roundedRect(ctx, 0, 0, W, 260, 24)
      ctx.clip()
      ctx.fillStyle = "#4a8a2a"
      ctx.fillRect(0, 0, W, 260)
      ctx.restore()
      ctx.fillStyle = "#4a8a2a"
      ctx.fillRect(0, 236, W, 24)

      // Try loading logo from Cloudinary
      const logoImg = await loadImage("https://res.cloudinary.com/dwmjz9csc/image/upload/v1786889497/9ec8064b-61d9-4e70-897d-4790e9ea2cdf-removebg-preview_ogtw6d.png")
      if (logoImg) {
        ctx.drawImage(logoImg, (W - 80) / 2, 24, 80, 80)
      }

      // Org name
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 26px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(
        globalSettings?.siteTitle?.toUpperCase() || "GLOBAL IMPACT FOUNDATION",
        W / 2, 140
      )

      // Subtitle
      ctx.font = "16px sans-serif"
      ctx.fillStyle = "rgba(255,255,255,0.85)"
      ctx.fillText("Official Volunteer Identity Card", W / 2, 168)

      // White border circle for photo
      const photoCX = W / 2, photoCY = 216, photoR = 64
      ctx.save()
      ctx.beginPath()
      ctx.arc(photoCX, photoCY, photoR + 5, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()
      ctx.restore()

      // Profile photo or initial
      const profileImg = me.photo ? await loadImage(me.photo) : null
      ctx.save()
      ctx.beginPath()
      ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2)
      ctx.clip()
      if (profileImg) {
        ctx.drawImage(profileImg, photoCX - photoR, photoCY - photoR, photoR * 2, photoR * 2)
      } else {
        ctx.fillStyle = "#e3e9e3"
        ctx.fill()
        ctx.fillStyle = "#266326"
        ctx.font = "bold 64px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(me.name?.charAt(0)?.toUpperCase() || "V", photoCX, photoCY)
      }
      ctx.restore()
      ctx.textBaseline = "alphabetic"

      // Name
      ctx.fillStyle = "#13448a"
      ctx.font = "bold 34px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(me.name || "Volunteer", W / 2, 320)

      // Vol ID
      ctx.font = "17px sans-serif"
      ctx.fillStyle = "#64748b"
      ctx.fillText(`VOL-${me.id?.toString().padStart(4, "0") || "0001"}`, W / 2, 350)

      // Divider
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(50, 382)
      ctx.lineTo(W - 50, 382)
      ctx.stroke()

      // Info fields grid
      const fields = [
        ["ROLE", me.role || "Volunteer"],
        ["BLOOD GROUP", me.bloodGroup || "O+"],
        ["PHONE", me.phone || "N/A"],
        ["VALID TILL", "Dec 2025"],
      ]
      const col1X = 70, col2X = W / 2 + 20
      fields.forEach(([label, value], i) => {
        const x = i % 2 === 0 ? col1X : col2X
        const y = 424 + Math.floor(i / 2) * 110
        ctx.fillStyle = "#94a3b8"
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(label, x, y)
        ctx.fillStyle = "#13448a"
        ctx.font = "bold 22px sans-serif"
        ctx.fillText(value, x, y + 32)
      })

      // Footer background
      ctx.fillStyle = "#f4f5f7"
      ctx.fillRect(0, H - 60, W, 60)
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, H - 60)
      ctx.lineTo(W, H - 60)
      ctx.stroke()

      // Footer text
      ctx.fillStyle = "#94a3b8"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(
        `If found, please return to: ${globalSettings?.contactEmail || "foundationsarvabhyudaya@gmail.com"}`,
        W / 2, H - 22
      )

      // Trigger download
      const link = document.createElement("a")
      link.download = `${(me.name || "volunteer").replace(/\s+/g, "-")}-id-card.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (err) {
      console.error("Canvas download failed:", err)
      alert("Could not generate image. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-extrabold sm:text-3xl text-primary">Digital ID Card</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <FadeIn className="flex-1 max-w-md">
          <div ref={cardRef} className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            {/* Header */}
            <div className="bg-[#4a8a2a] px-6 pt-6 pb-14 text-white text-center flex flex-col items-center rounded-t-2xl">
              <Logo className="h-12 w-auto mb-3" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-white">
                {globalSettings?.siteTitle || "GLOBAL IMPACT FOUNDATION"}
              </h2>
              <p className="text-xs font-medium text-white/90">Official Volunteer Identity Card</p>
            </div>

            {/* Volunteer Photo overlapping header */}
            <div className="flex justify-center -mt-12 relative z-10">
              <div className="size-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#e3e9e3] flex items-center justify-center">
                {me.photo ? (
                  <img src={me.photo} alt={me.name} className="size-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <span className="text-4xl font-black text-[#266326]">
                    {me.name?.charAt(0).toUpperCase() || "V"}
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="px-8 pt-4 pb-6 text-center">
              <p className="text-xl font-black text-[#13448a] leading-tight">{me.name}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">VOL-{me.id?.toString().padStart(4, "0")}</p>

              <div className="mt-6 grid grid-cols-2 gap-y-5 border-t border-slate-200 pt-5 text-left">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</p>
                  <p className="text-sm font-bold text-[#13448a] mt-0.5">{me.role || "volunteer"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Blood Group</p>
                  <p className="text-sm font-bold text-[#13448a] mt-0.5">{me.bloodGroup || "O+"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</p>
                  <p className="text-sm font-bold text-[#13448a] mt-0.5">{me.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Valid Till</p>
                  <p className="text-sm font-bold text-[#13448a] mt-0.5">Dec 2025</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#f4f5f7] p-3 text-center rounded-b-2xl border-t border-slate-100">
              <p className="text-[10px] font-medium text-slate-500">
                If found, please return to: {globalSettings?.contactEmail || "foundationsarvabhyudaya@gmail.com"}
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="w-full lg:w-64">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-2 text-sm font-bold text-primary">Use your ID Card</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Show this digital ID card at events or camps to mark your attendance and verify your identity.
            </p>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-dark disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              {downloading ? "Generating..." : "Download Card"}
            </button>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
