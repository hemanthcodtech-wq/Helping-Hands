import toast from "react-hot-toast";

import { useState, useEffect } from "react"
import { IdCard, Download, Mail, Plus, X } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

export default function AdminCoordinatorIDCards() {
  const [coordinators, setCoordinators] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCoord, setSelectedCoord] = useState("")

  useEffect(() => {
    fetch("https://helpinghandsbe.vercel.app/api/coordinators")
      .then(res => res.json())
      .then(data => { if(data.success) setCoordinators(data.coordinators) })
      .catch(console.error)
  }, [])

  const handleDownload = (c) => {
    toast(`Downloading ID card PDF for ${c.name}...`)
  }
  
  const handleEmail = (c) => {
    toast(`Sending ID card to ${c.email || c.name}'s email...`)
  }

  const handleGenerate = (e) => {
    e.preventDefault()
    toast(`ID Card generated successfully!`)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Coordinator ID Cards</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Manage and generate ID cards for coordinators</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-teal px-3 py-2 text-[9px] font-semibold text-white transition hover:bg-teal/90 sm:rounded-2xl sm:text-xs">
          <Plus className="size-3.5" /> Generate ID Card
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {coordinators.map(c => (
          <FadeIn key={c.id} className="relative overflow-hidden rounded-3xl border-2 border-border bg-card shadow-sm transition hover:shadow-xl hover:border-teal/30 p-6 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <IdCard className="size-24 text-teal" />
            </div>
            <div className="grid size-20 place-items-center rounded-full bg-teal/10 text-teal mb-4 ring-4 ring-teal/5">
              <span className="text-2xl font-bold">{c.name.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-extrabold text-primary uppercase">{c.name}</h3>
            <p className="text-sm font-bold text-teal mb-2">{c.role || "Official Coordinator"}</p>
            <div className="w-full text-xs text-muted-foreground space-y-1 mb-6 text-center">
              <p>Blood Group: <span className="font-semibold">{c.blood_group || c.blood || "Unknown"}</span></p>
              <p>Phone: <span className="font-semibold">{c.phone}</span></p>
            </div>
            
            <div className="flex w-full gap-2">
              <button onClick={() => handleEmail(c)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-soft py-2 text-xs font-bold text-teal transition hover:bg-teal/20">
                <Mail className="size-4" /> Send Email
              </button>
              <button onClick={() => handleDownload(c)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal py-2 text-xs font-bold text-white transition hover:bg-teal/90">
                <Download className="size-4" /> Download PDF
              </button>
            </div>
          </FadeIn>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="relative w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white transition">
              <X className="size-4" />
            </button>
            <h3 className="mb-6 font-heading text-xl font-extrabold text-primary">Generate ID Card</h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold">Select Coordinator</label>
                <select required value={selectedCoord} onChange={e=>setSelectedCoord(e.target.value)} className="mt-1 w-full rounded-xl border border-border p-2 text-sm">
                  <option value="" disabled>Select coordinator...</option>
                  {coordinators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal/90">Generate</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
