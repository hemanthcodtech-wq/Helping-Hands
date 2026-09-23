import { useRef } from "react"
import { useApp } from "../../context/AppContext"
import { Download, IdCard } from "lucide-react"

export default function MemberDocuments() {
  const { loggedInMember, globalSettings } = useApp()
  const idCardRef = useRef(null)

  const s = globalSettings || {}
  const logo = "https://res.cloudinary.com/dwmjz9csc/image/upload/v1786889497/9ec8064b-61d9-4e70-897d-4790e9ea2cdf-removebg-preview_ogtw6d.png"

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = src
    })

  const downloadIdCard = async () => {
    if (!loggedInMember) return
    try {
      const W = 700, H = 960
      const canvas = document.createElement("canvas")
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext("2d")

      // Background
      ctx.fillStyle = "#f8faff"
      ctx.fillRect(0, 0, W, H)

      // Header (Blue)
      ctx.fillStyle = "#04458F"
      ctx.fillRect(0, 0, W, 220)

      // Logo
      const logoImg = await loadImage(logo)
      if (logoImg) {
        // Draw white box for logo
        ctx.fillStyle = "#ffffff"
        ctx.roundRect(40, 40, 100, 100, 16)
        ctx.fill()
        ctx.drawImage(logoImg, 50, 50, 80, 80)
      }

      ctx.fillStyle = "#ffffff"
      ctx.font = "900 28px Georgia, serif"
      ctx.textAlign = "left"
      ctx.fillText(s.ngoName || "HELPING HANDS FOUNDATION", 160, 90)
      ctx.font = "500 16px sans-serif"
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.fillText(`Regd. No: ${s.cert12a || "12A-XXXXX"}`, 160, 120)

      // Photo Circle
      ctx.beginPath()
      ctx.arc(W / 2, 280, 100, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()
      ctx.lineWidth = 6
      ctx.strokeStyle = "#f1f5f9"
      ctx.stroke()

      const profileImg = loggedInMember.profile_picture_url ? await loadImage(loggedInMember.profile_picture_url) : null
      ctx.save()
      ctx.beginPath()
      ctx.arc(W / 2, 280, 94, 0, Math.PI * 2)
      ctx.clip()
      if (profileImg) {
        ctx.drawImage(profileImg, W / 2 - 94, 280 - 94, 188, 188)
      } else {
        ctx.fillStyle = "#eef7e9"
        ctx.fill()
        ctx.fillStyle = "#196823"
        ctx.font = "bold 80px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(loggedInMember.name.charAt(0).toUpperCase(), W / 2, 280)
      }
      ctx.restore()

      // Name & Tier
      ctx.textBaseline = "alphabetic"
      ctx.fillStyle = "#061D49"
      ctx.font = "900 42px Georgia, serif"
      ctx.textAlign = "center"
      ctx.fillText(loggedInMember.name, W / 2, 440)
      
      // Tier Badge
      ctx.fillStyle = "#eef7e9"
      ctx.roundRect(W / 2 - 120, 460, 240, 40, 20)
      ctx.fill()
      ctx.fillStyle = "#196823"
      ctx.font = "bold 16px sans-serif"
      ctx.fillText(loggedInMember.membership_tier || "Official Member", W / 2, 486)

      // Details Grid
      const fields = [
        ["ID No.", `HHF-M-${loggedInMember.id?.toString().padStart(4, '0') || '0000'}`],
        ["Blood Group", loggedInMember.blood_group || "N/A"],
        ["Phone", loggedInMember.phone || "N/A"]
      ]

      ctx.textAlign = "left"
      fields.forEach(([label, val], i) => {
        const y = 580 + (i * 70)
        
        ctx.fillStyle = "#64748b"
        ctx.font = "bold 20px sans-serif"
        ctx.fillText(label, 80, y)
        
        ctx.fillStyle = label === "Blood Group" ? "#dc2626" : "#061D49"
        ctx.font = "bold 20px sans-serif"
        ctx.fillText(val, 280, y)
        
        // Line
        ctx.beginPath()
        ctx.moveTo(80, y + 24)
        ctx.lineTo(W - 80, y + 24)
        ctx.strokeStyle = "#e2e8f0"
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Footer
      ctx.fillStyle = "#eff6ff"
      ctx.fillRect(0, H - 140, W, 140)
      
      ctx.fillStyle = "#64748b"
      ctx.font = "500 16px sans-serif"
      ctx.fillText("If found, please return to:", 60, H - 80)
      ctx.fillText(s.contactPhonePrimary || "+91 77993 73766", 60, H - 54)

      ctx.textAlign = "right"
      ctx.fillStyle = "#04458F"
      ctx.font = "italic 18px Georgia, serif"
      ctx.fillText("Authorised", W - 60, H - 76)
      
      ctx.beginPath()
      ctx.moveTo(W - 160, H - 60)
      ctx.lineTo(W - 60, H - 60)
      ctx.strokeStyle = "rgba(4,69,143,0.2)"
      ctx.stroke()
      
      ctx.fillStyle = "#64748b"
      ctx.font = "bold 12px sans-serif"
      ctx.fillText((s.signatoryName || "Director").toUpperCase(), W - 60, H - 40)

      const link = document.createElement("a")
      link.download = `ID_Card_${loggedInMember.name.replace(/\s+/g, '_')}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (err) {
      console.error("Failed to generate ID card:", err)
      alert("Could not generate ID card image.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">My Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">View and download your official Membership ID card.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-extrabold text-primary flex items-center gap-2"><IdCard className="size-5 text-teal" /> ID Card</h2>
            <button onClick={downloadIdCard} className="inline-flex items-center gap-2 rounded-xl bg-primary-soft px-4 py-2 text-sm font-bold text-teal transition hover:bg-teal hover:text-white">
              <Download className="size-4" /> Download
            </button>
          </div>

          <div className="flex justify-center bg-muted/30 py-8 rounded-xl overflow-hidden">
            {/* ID Card Template */}
            <div ref={idCardRef} className="relative w-[340px] h-[540px] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-border">
              {/* Background styling */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#f8faff] to-white" />
              <div className="absolute -right-20 -top-20 size-64 rounded-full bg-teal/5 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 size-80 rounded-full bg-accent/5 blur-3xl" />
              
              <div className="relative flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 bg-[#04458F] px-5 py-4 text-white">
                  <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-white p-1 shadow-sm">
                    <img src={logo} alt="Logo" className="size-full object-contain" crossOrigin="anonymous" />
                  </div>
                  <div>
                    <h3 className="font-heading text-[13px] font-extrabold leading-tight tracking-tight">{s.ngoName || "HELPING HANDS FOUNDATION"}</h3>
                    <p className="mt-0.5 text-[8px] font-medium text-white/80">Regd. No: {s.cert12a || "12A-XXXXX"}</p>
                  </div>
                </div>

                {/* Photo & Identity Area */}
                <div className="flex flex-col items-center px-6 pt-6 pb-2 text-center">
                  <div className="relative mb-3">
                    <div className="size-28 overflow-hidden rounded-full border-4 border-white bg-muted shadow-md">
                      {loggedInMember.profile_picture_url ? (
                        <img src={loggedInMember.profile_picture_url} alt="Profile" className="size-full object-cover" crossOrigin="anonymous" />
                      ) : (
                        <div className="grid size-full place-items-center bg-primary-soft text-teal font-heading text-4xl font-bold">{loggedInMember.name.charAt(0)}</div>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="font-heading text-xl font-extrabold text-[#061D49]">{loggedInMember.name}</h4>
                  <p className="mt-1 inline-block rounded-full bg-[#eef7e9] px-3 py-1 text-[10px] font-bold text-[#196823]">
                    {loggedInMember.membership_tier || "Official Member"}
                  </p>
                </div>

                {/* Details */}
                <div className="mt-2 flex-1 px-6 text-[11px] space-y-2.5">
                  <div className="grid grid-cols-[85px_1fr] items-start gap-2 border-b border-border/50 pb-2">
                    <span className="font-bold text-muted-foreground">ID No.</span>
                    <span className="font-semibold text-primary">HHF-M-{loggedInMember.id?.toString().padStart(4, '0') || '0000'}</span>
                  </div>
                  <div className="grid grid-cols-[85px_1fr] items-start gap-2 border-b border-border/50 pb-2">
                    <span className="font-bold text-muted-foreground">Blood Group</span>
                    <span className="font-semibold text-red-600">{loggedInMember.blood_group || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-[85px_1fr] items-start gap-2 border-b border-border/50 pb-2">
                    <span className="font-bold text-muted-foreground">Phone</span>
                    <span className="font-semibold text-primary">{loggedInMember.phone}</span>
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="mt-auto flex items-end justify-between bg-primary-soft/30 px-6 py-4">
                  <div className="text-[9px] font-medium text-muted-foreground leading-snug w-1/2">
                    If found, please return to:<br/>
                    {s.contactPhonePrimary || "+91 77993 73766"}
                  </div>
                  <div className="text-center">
                    <div className="mb-1 text-[10px] italic text-primary">Authorised</div>
                    <div className="border-t border-primary/20 pt-1 text-[8px] font-bold text-muted-foreground uppercase">{s.signatoryName || "Director"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
