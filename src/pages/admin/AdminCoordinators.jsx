import toast from "react-hot-toast";

import { useState, useEffect } from "react"
import { Plus, Search, Download, X } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

export default function AdminCoordinators() {
  const [coordinators, setCoordinators] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', aadhaar: '', address: '' })

  const fetchCoordinators = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/coordinators")
      const data = await res.json()
      if (data.success) setCoordinators(data.coordinators)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoordinators()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const formPayload = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key]) formPayload.append(key, formData[key])
      })
      
      const fileInputs = e.target.querySelectorAll('input[type="file"]')
      if (fileInputs[0]?.files[0]) formPayload.append('profile_picture', fileInputs[0].files[0])
      if (fileInputs[1]?.files[0]) formPayload.append('aadhaar_front', fileInputs[1].files[0])
      if (fileInputs[2]?.files[0]) formPayload.append('aadhaar_back', fileInputs[2].files[0])

      const res = await fetch("http://localhost:5000/api/coordinators", {
        method: "POST",
        body: formPayload,
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Coordinator created successfully!")
        setIsModalOpen(false)
        fetchCoordinators()
      } else {
        toast.error(data.message || "Failed to create coordinator")
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred")
    } finally {
      setIsCreating(false)
    }
  }

  const filtered = coordinators.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Coordinators</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Manage coordinators</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-teal px-3 py-2 text-[9px] font-semibold text-white transition hover:bg-teal/90 sm:rounded-2xl sm:text-xs">
          <Plus className="size-3.5" /> Add Coordinator
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coordinators..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-8 pr-3 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm"
          />
        </div>
      </div>

      <FadeIn className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Name", "Contact", "Address", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-3 sm:text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">No coordinators found.</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition">
                  <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-[8px] font-bold text-teal sm:size-8 sm:text-xs">{c.name.charAt(0)}</span>
                      <div>
                        <p className="text-[9px] font-semibold text-primary sm:text-sm">{c.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-5 sm:py-3 sm:text-sm">
                    {c.email}<br/>{c.phone}
                  </td>
                  <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-5 sm:py-3 sm:text-sm">{c.address}</td>
                  <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                    <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[7px] font-bold text-teal sm:text-[10px]">{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card p-6 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white transition">
              <X className="size-4" />
            </button>
            <h3 className="mb-6 font-heading text-xl font-extrabold text-primary">Create Coordinator</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold">Full Name*</label>
                  <input required placeholder="Enter full name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Gender*</label>
                  <select required value={formData.gender || ''} onChange={e=>setFormData({...formData, gender: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm">
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold">S/o D/o W/o</label>
                  <input placeholder="Parent / spouse name" value={formData.parentName || ''} onChange={e=>setFormData({...formData, parentName: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Date of Birth*</label>
                  <input required type="date" value={formData.dob || ''} onChange={e=>setFormData({...formData, dob: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Profession*</label>
                  <input required placeholder="Enter profession" value={formData.profession || ''} onChange={e=>setFormData({...formData, profession: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Blood Group</label>
                  <select value={formData.bloodGroup || ''} onChange={e=>setFormData({...formData, bloodGroup: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm">
                    <option value="" disabled>Select group</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold">Email Address*</label>
                  <input required type="email" placeholder="you@example.com" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Mobile Number*</label>
                  <input required type="tel" placeholder="10-digit mobile number" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Password*</label>
                  <input required type="password" placeholder="Create a password" value={formData.password || ''} onChange={e=>setFormData({...formData, password: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Aadhaar Number*</label>
                  <input required placeholder="12-digit Aadhaar number" value={formData.aadhaar} onChange={e=>setFormData({...formData, aadhaar: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">State*</label>
                  <select required value={formData.state || ''} onChange={e=>setFormData({...formData, state: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm">
                    <option value="" disabled>Select state</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Karnataka">Karnataka</option>
                    {/* Add more states as needed */}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold">District*</label>
                  <input required placeholder="Enter district" value={formData.district || ''} onChange={e=>setFormData({...formData, district: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Working Area*</label>
                  <input required placeholder="Village / Mandal / City" value={formData.workingArea || ''} onChange={e=>setFormData({...formData, workingArea: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Pincode*</label>
                  <input required placeholder="6-digit pincode" value={formData.pincode || ''} onChange={e=>setFormData({...formData, pincode: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm" />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-semibold">Full Address*</label>
                  <textarea required placeholder="House number, street, village/city, district" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="mt-1 w-full rounded-xl border border-border p-2 text-sm min-h-[80px]"></textarea>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-bold mb-3">Document Uploads (JPG, PNG or PDF)</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold">Profile Picture</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="mt-1 w-full text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Aadhaar Card — Front</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="mt-1 w-full text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Aadhaar Card — Back</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="mt-1 w-full text-xs" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isCreating} className="w-full rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal/90 disabled:opacity-70">
                {isCreating ? "Saving Coordinator..." : "Save Coordinator"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
