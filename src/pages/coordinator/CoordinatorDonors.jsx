import { useState, useEffect } from "react"
import { HeartHandshake, Plus, X, Loader2 } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"
import toast from "react-hot-toast"

export default function CoordinatorDonors() {
  const [donors, setDonors] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", aadhar_number: "", amount_needed: "" })
  const [coordId, setCoordId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("coordinatorData")
    if (data) {
      const parsed = JSON.parse(data)
      setCoordId(parsed.id)
      fetchDonors(parsed.id)
    }
  }, [])

  const fetchDonors = async (id) => {
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/coordinators/${id}/donors`)
      const data = await res.json()
      if (data.success) {
        setDonors(data.donors)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.aadhar_number || !formData.amount_needed) {
      toast.error("Please fill required fields")
      return
    }
    
    if (!coordId) return;

    setIsLoading(true);

    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/coordinators/${coordId}/donors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Donor added successfully!")
        setIsModalOpen(false)
        setFormData({ name: "", aadhar_number: "", amount_needed: "" })
        fetchDonors(coordId)
      } else {
        toast.error("Failed to add donor")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">My Donors</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Manage donors needing assistance</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-teal px-3 py-2 text-[9px] font-semibold text-white transition hover:bg-teal/90 sm:rounded-2xl sm:text-xs">
          <Plus className="size-3.5" /> Add Donor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {donors.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-full">No donors added yet.</p>
        ) : (
          donors.map(d => (
            <FadeIn key={d.id} className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm transition hover:shadow-xl hover:border-teal/30">
              <div className="flex justify-between items-start mb-4">
                <div className="grid size-12 place-items-center rounded-full bg-teal/10 text-teal ring-2 ring-teal/5">
                  <HeartHandshake className="size-6" />
                </div>
                <span className="text-lg font-extrabold text-primary">₹{d.amount_needed}</span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">{d.name}</h3>
              <p className="text-xs font-semibold text-teal mb-3">Registered Donor</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Aadhar: {d.aadhar_number}</p>
                <p>Added: {new Date(d.created_at).toLocaleDateString()}</p>
              </div>
            </FadeIn>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="relative w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white transition">
              <X className="size-4" />
            </button>
            <h3 className="mb-6 font-heading text-xl font-extrabold text-primary">Add New Donor</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold">Donor Name*</label>
                <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Aadhar Number*</label>
                <input required type="text" value={formData.aadhar_number} onChange={e=>setFormData({...formData, aadhar_number: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Amount Given (₹)*</label>
                <input required type="number" min="1" value={formData.amount_needed} onChange={e=>setFormData({...formData, amount_needed: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
              </div>
              <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal/90 disabled:opacity-70">
                {isLoading ? <><Loader2 className="size-4 animate-spin" /> Saving...</> : "Save Donor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
