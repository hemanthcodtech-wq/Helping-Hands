import { useEffect, useState } from "react"
import { ArrowRight, Heart, X } from "lucide-react"
import { Link } from "react-router-dom"

export default function CampaignPopup() {
  const [campaigns, setCampaigns] = useState([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("https://helpinghandsbe.vercel.app/api/campaigns")
        const data = await res.json()
        if (data.success && data.campaigns.length > 0) {
          setCampaigns(data.campaigns)
          
          // Preload images
          data.campaigns.forEach(({ image }) => {
            if (image) {
              const img = new Image()
              img.src = image
            }
          })
          
          const openTimer = window.setTimeout(() => setOpen(true), 900)
          return () => window.clearTimeout(openTimer)
        }
      } catch (err) {
        console.error("Failed to fetch campaigns for popup:", err)
      }
    }
    fetchCampaigns()
  }, [])

  useEffect(() => {
    if (!open || campaigns.length <= 1) return
    const rotationTimer = window.setInterval(() => {
      setActive((current) => (current + 1) % campaigns.length)
    }, 3000)
    return () => window.clearInterval(rotationTimer)
  }, [open, campaigns.length])

  if (!open || campaigns.length === 0) return null
  const campaign = campaigns[active]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/50 p-4" role="dialog" aria-modal="true" aria-labelledby="campaign-popup-title">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-card shadow-2xl">
        <button type="button" onClick={() => setOpen(false)} aria-label="Close campaign popup" className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-white/90 text-primary shadow-sm transition hover:scale-105 hover:bg-white"><X className="size-4" /></button>
        <div className="h-2 bg-gradient-to-r from-[#04458F] via-[#5E922C] to-[#EF9A0A]" />
        <div className="relative aspect-[16/8] overflow-hidden bg-muted">
          <img src={campaign.image || "/images/placeholder.jpg"} alt={campaign.name} className="h-full w-full object-cover transition-opacity duration-500" onError={(event) => { event.currentTarget.src = "/images/hero-girl.png" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/10 to-transparent" />
          <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-accent sm:text-xs"><Heart className="size-3.5 fill-current" /> Featured Campaign</span>
        </div>
        <div className="p-6 sm:p-8">
          <h2 id="campaign-popup-title" className="font-heading text-2xl font-extrabold leading-tight text-primary sm:text-3xl">{campaign.name}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base line-clamp-2">{campaign.text}</p>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-bold"><span className="text-primary">Campaign progress</span><span className="text-teal">{campaign.raised || 0}%</span></div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-primary-soft"><div className="h-full rounded-full bg-gradient-to-r from-[#04458F] to-[#5E922C] transition-all duration-700" style={{ width: `${Math.min(campaign.raised || 0, 100)}%` }} /></div>
            <p className="mt-2 text-right text-xs text-muted-foreground">Goal: <span className="font-bold text-primary">{campaign.goal}</span></p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/campaigns" onClick={() => setOpen(false)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-primary/90">View Campaign <ArrowRight className="size-4" /></Link>
            <Link to="/donate" onClick={() => setOpen(false)} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-bold text-primary transition hover:bg-primary-soft">Support Now</Link>
          </div>
          <div className="mt-4 flex justify-center gap-1.5">
            {campaigns.map((item, index) => <button key={item.id || index} type="button" onClick={() => setActive(index)} aria-label={`Show ${item.name}`} className={`h-1.5 rounded-full transition-all ${index === active ? "w-6 bg-teal" : "w-1.5 bg-teal/25"}`} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
