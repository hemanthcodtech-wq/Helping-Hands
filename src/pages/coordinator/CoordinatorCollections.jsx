import { useState, useEffect } from "react"
import { Landmark, Plus, X, Loader2 } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"
import toast from "react-hot-toast"

export default function CoordinatorCollections() {
  const [collections, setCollections] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", amount: "", collection_date: new Date().toISOString().split('T')[0] })
  const [coordId, setCoordId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("coordinatorData")
    if (data) {
      const parsed = JSON.parse(data)
      setCoordId(parsed.id)
      fetchCollections(parsed.id)
    }
  }, [])

  const fetchCollections = async (id) => {
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/coordinators/${id}/collections`)
      const data = await res.json()
      if (data.success) {
        setCollections(data.collections)
        // Keep local storage updated for quick sync with other components like dashboard
        localStorage.setItem(`coord_collections_${id}`, JSON.stringify(data.collections))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.mobile || !formData.amount || !formData.collection_date) {
      toast.error("Please fill required fields")
      return
    }
    
    if (!coordId) return;

    setIsLoading(true);

    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/coordinators/${coordId}/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Collection added successfully!")
        setIsModalOpen(false)
        setFormData({ name: "", email: "", mobile: "", amount: "", collection_date: new Date().toISOString().split('T')[0] })
        fetchCollections(coordId)
      } else {
        toast.error("Failed to add collection")
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
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">My Collections</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Manage donations you brought in</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-teal px-3 py-2 text-[9px] font-semibold text-white transition hover:bg-teal/90 sm:rounded-2xl sm:text-xs">
          <Plus className="size-3.5" /> Add Collection
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-full">No collections added yet.</p>
        ) : (
          collections.map(c => (
            <FadeIn key={c.id} className="rounded-3xl border-2 border-border bg-card p-6 shadow-sm transition hover:shadow-xl hover:border-teal/30">
              <div className="flex justify-between items-start mb-4">
                <div className="grid size-12 place-items-center rounded-full bg-teal/10 text-teal ring-2 ring-teal/5">
                  <Landmark className="size-6" />
                </div>
                <span className="text-lg font-extrabold text-primary">₹{c.amount}</span>
              </div>
              <h3 className="text-lg font-bold text-primary">{c.name}</h3>
              <p className="text-xs text-muted-foreground mb-1">Phone: {c.mobile}</p>
              {c.email && <p className="text-xs text-muted-foreground mb-1">Email: {c.email}</p>}
              <p className="text-[10px] text-muted-foreground mt-4 pt-4 border-t border-border">Date: {c.collection_date ? new Date(c.collection_date).toLocaleDateString() : new Date(c.created_at).toLocaleDateString()}</p>
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
            <h3 className="mb-6 font-heading text-xl font-extrabold text-primary">Add New Collection</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold">Donor Name*</label>
                <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Collection Date*</label>
                <input required type="date" value={formData.collection_date} onChange={e=>setFormData({...formData, collection_date: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Mobile Number*</label>
                <input required type="tel" value={formData.mobile} onChange={e=>setFormData({...formData, mobile: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Email Address (Optional)</label>
                <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Amount (₹)*</label>
                <input required type="number" min="1" value={formData.amount} onChange={e=>setFormData({...formData, amount: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
              </div>
              <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal/90 disabled:opacity-70">
                {isLoading ? <><Loader2 className="size-4 animate-spin" /> Saving...</> : "Save Collection"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
