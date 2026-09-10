import { useState, useEffect } from "react"
import { Bell, Check, Search, Trash2, X, Eye } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"
import { motion, AnimatePresence } from "framer-motion"

const STATUS_STYLE = {
  approved: "bg-teal/10 text-teal",
  pending: "bg-amber-50 text-amber-600",
  rejected: "bg-red-50 text-red-500",
}

const UPDATE_TYPES = ["assignment", "activity", "announcement", "reminder"]

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([])
  const [volunteerUpdates, setVolunteerUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVol, setSelectedVol] = useState(null)

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [tab, setTab] = useState("volunteers") // "volunteers" | "updates"

  // Post update form
  const [form, setForm] = useState({ volunteerId: "", title: "", message: "", type: "announcement" })
  const [posted, setPosted] = useState(false)

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/volunteers/all")
      const data = await res.json()
      if (data.success) {
        setVolunteers(data.volunteers)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchUpdates = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/volunteers/updates")
      const data = await res.json()
      if (data.success) {
        setVolunteerUpdates(data.updates)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchVolunteers()
      await fetchUpdates()
      setLoading(false)
    }
    loadData()
  }, [])

  const updateVolunteerStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this volunteer?`)) return
    try {
      const res = await fetch(`http://localhost:5000/api/volunteers/${status}/${id}`, {
        method: "POST"
      })
      const data = await res.json()
      if (data.success) {
        fetchVolunteers()
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to update status")
    }
  }

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handlePost = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5000/api/volunteers/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, volunteerId: Number(form.volunteerId) })
      })
      const data = await res.json()
      if (data.success) {
        setForm({ volunteerId: "", title: "", message: "", type: "announcement" })
        setPosted(true)
        setTimeout(() => setPosted(false), 2500)
        fetchUpdates()
      }
    } catch (err) {
      console.error(err)
      alert("Failed to post update")
    }
  }

  const deleteVolunteerUpdate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return
    try {
      const res = await fetch(`http://localhost:5000/api/volunteers/updates/${id}`, {
        method: "DELETE"
      })
      const data = await res.json()
      if (data.success) {
        fetchUpdates()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = volunteers.filter((v) => {
    const matchSearch = (v.name || "").toLowerCase().includes(search.toLowerCase()) || (v.role || "").toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || v.status === filter
    return matchSearch && matchFilter
  })

  const counts = {
    all: volunteers.length,
    pending: volunteers.filter((v) => v.status === "pending").length,
    approved: volunteers.filter((v) => v.status === "approved").length,
    rejected: volunteers.filter((v) => v.status === "rejected").length,
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Volunteers</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">{loading ? "Loading..." : `${volunteers.length} total registrations`}</p>
        </div>
        <div className="flex gap-1.5">
          {["volunteers", "updates"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-xl border px-3 py-1.5 text-[9px] font-semibold capitalize transition sm:rounded-2xl sm:text-xs ${
                tab === t ? "border-teal bg-primary-soft text-teal" : "border-border bg-card text-primary hover:bg-muted"
              }`}>
              {t === "updates" ? "Post Update" : "Volunteers"}
            </button>
          ))}
        </div>
      </div>

      {tab === "volunteers" && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            {Object.entries(counts).map(([key, val]) => (
              <FadeIn key={key}>
                <button onClick={() => setFilter(key)}
                  className={`w-full rounded-xl border p-3 text-left transition sm:rounded-2xl sm:p-4 ${
                    filter === key ? "border-teal bg-primary-soft" : "border-border bg-card hover:bg-muted/40"
                  }`}>
                  <p className={`font-heading text-[18px] font-extrabold sm:text-2xl ${
                    key === "approved" ? "text-teal" : key === "pending" ? "text-amber-600" : key === "rejected" ? "text-red-500" : "text-primary"
                  }`}>{val}</p>
                  <p className="mt-0.5 text-[8px] capitalize text-muted-foreground sm:text-xs">{key}</p>
                </button>
              </FadeIn>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search volunteers..."
                className="w-full rounded-xl border border-border bg-card py-2 pl-8 pr-3 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm" />
            </div>
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-xl border px-3 py-2 text-[9px] font-semibold capitalize transition sm:rounded-2xl sm:text-xs ${
                  filter === f ? "border-teal bg-primary-soft text-teal" : "border-border bg-card text-primary hover:bg-muted"
                }`}>{f}</button>
            ))}
          </div>

          {/* Table */}
          <FadeIn className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {["Volunteer", "Role", "City", "Applied", "Hours", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground sm:px-4 sm:py-3 sm:text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">Loading volunteers...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">No volunteers found.</td></tr>
                  ) : filtered.map((v, i) => (
                    <tr key={v.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                      <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <div className="flex items-center gap-2">
                          <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-teal/10 text-[8px] font-bold text-teal sm:size-8 sm:text-xs">
    {v.profile_pic_url ? <img src={v.profile_pic_url} className="h-full w-full object-cover" alt="" /> : (v.name || "V").charAt(0)}
  </span>
                          <div>
                            <p className="text-[9px] font-semibold text-primary sm:text-sm">{v.name || "Unknown"}</p>
                            <p className="text-[7px] text-muted-foreground sm:text-xs">{v.email}</p>
                            <p className="text-[7px] text-muted-foreground sm:text-xs">{v.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-4 sm:py-3 sm:text-sm">{v.role}</td>
                      <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-4 sm:py-3 sm:text-sm">{v.city}</td>
                      <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-4 sm:py-3 sm:text-sm">{v.appliedDate}</td>
                      <td className="px-3 py-2.5 text-[9px] font-semibold text-primary sm:px-4 sm:py-3 sm:text-sm">{v.hours}h</td>
                      <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[7px] font-bold capitalize sm:text-[10px] ${STATUS_STYLE[v.status]}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelectedVol(v)} title="View Details"
                            className="grid size-6 place-items-center rounded-lg bg-blue-50 text-blue-500 transition hover:bg-blue-500 hover:text-white sm:size-7">
                            <Eye className="size-3 sm:size-3.5" />
                          </button>
                          {v.status !== "approved" && (
                            <button onClick={() => updateVolunteerStatus(v.id, "approve")} title="Approve"
                              className="grid size-6 place-items-center rounded-lg bg-teal/10 text-teal transition hover:bg-teal hover:text-white sm:size-7">
                              <Check className="size-3 sm:size-3.5" />
                            </button>
                          )}
                          {v.status !== "rejected" && (
                            <button onClick={() => updateVolunteerStatus(v.id, "reject")} title="Reject"
                              className="grid size-6 place-items-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white sm:size-7">
                              <X className="size-3 sm:size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </>
      )}

      {tab === "updates" && (
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Post form */}
          <FadeIn className="rounded-2xl border border-border bg-card sm:rounded-3xl">
            <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
              <h3 className="text-[11px] font-bold text-primary sm:text-sm">Post New Update</h3>
            </div>
            <form onSubmit={handlePost} className="space-y-3 p-4 sm:space-y-4 sm:p-6">
              <div>
                <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Send To *</label>
                <select required value={form.volunteerId} onChange={set("volunteerId")}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm">
                  <option value="">Select volunteer</option>
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} — {v.role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Type *</label>
                <select value={form.type} onChange={set("type")}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm">
                  {UPDATE_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Title *</label>
                <input required value={form.title} onChange={set("title")} placeholder="Update title"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm" />
              </div>
              <div>
                <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Message *</label>
                <textarea required rows={3} value={form.message} onChange={set("message")} placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm" />
              </div>
              {posted && (
                <p className="rounded-xl bg-teal/10 px-3 py-2 text-[9px] font-medium text-teal sm:text-xs">✓ Update posted successfully!</p>
              )}
              <button type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-2.5 text-[10px] font-bold text-white transition hover:bg-teal-dark sm:rounded-2xl sm:text-sm">
                <Bell className="size-3.5" /> Post Update
              </button>
            </form>
          </FadeIn>

          {/* All updates list */}
          <FadeIn className="rounded-2xl border border-border bg-card sm:rounded-3xl">
            <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
              <h3 className="text-[11px] font-bold text-primary sm:text-sm">All Updates ({volunteerUpdates.length})</h3>
            </div>
            <div className="divide-y divide-border overflow-y-auto" style={{ maxHeight: 420 }}>
              {loading ? (
                <p className="px-4 py-8 text-center text-[10px] text-muted-foreground">Loading updates...</p>
              ) : volunteerUpdates.length === 0 ? (
                <p className="px-4 py-8 text-center text-[10px] text-muted-foreground">No updates posted yet.</p>
              ) : volunteerUpdates.map((u) => {
                const vol = volunteers.find((v) => v.id === u.volunteerId)
                return (
                  <div key={u.id} className="flex items-start justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold text-primary sm:text-sm truncate">{u.title}</p>
                      <p className="mt-0.5 text-[7px] text-muted-foreground sm:text-xs">
                        To: {vol ? vol.name : "Unknown"} · {u.date}
                      </p>
                      <p className="mt-1 text-[8px] leading-relaxed text-muted-foreground sm:text-xs line-clamp-2">{u.message}</p>
                    </div>
                    <button onClick={() => deleteVolunteerUpdate(u.id)} title="Delete"
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-red-50 text-red-400 transition hover:bg-red-500 hover:text-white sm:size-7">
                      <Trash2 className="size-3 sm:size-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </FadeIn>
        </div>
      )}

      {/* Volunteer Details Modal */}
      <AnimatePresence>
        {selectedVol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setSelectedVol(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-background p-6 shadow-2xl sm:p-8">
              <button onClick={() => setSelectedVol(null)} className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-muted/50 text-primary transition hover:bg-muted">
                <X className="size-4" />
              </button>
              
              <div className="mb-6 flex items-center gap-4">
                <div className="size-16 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted/50">
                  {selectedVol.profile_pic_url ? (
                    <img src={selectedVol.profile_pic_url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl font-bold text-teal">{selectedVol.name?.charAt(0) || 'V'}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-primary">{selectedVol.name}</h3>
                  <p className="text-sm font-semibold text-teal">{selectedVol.role}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div><h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Personal Info</h4>
                    <div className="mt-2 rounded-xl border border-border bg-card p-4 text-xs space-y-2">
                      <p><span className="font-semibold">Gender:</span> {selectedVol.gender || "-"}</p>
                      <p><span className="font-semibold">DOB:</span> {selectedVol.dob ? new Date(selectedVol.dob).toLocaleDateString() : "-"}</p>
                      <p><span className="font-semibold">S/o, D/o, W/o:</span> {selectedVol.parent_name || "-"}</p>
                      <p><span className="font-semibold">Profession:</span> {selectedVol.profession || "-"}</p>
                      <p><span className="font-semibold">Blood Group:</span> {selectedVol.blood_group || "-"}</p>
                    </div>
                  </div>
                  <div><h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact & ID</h4>
                    <div className="mt-2 rounded-xl border border-border bg-card p-4 text-xs space-y-2">
                      <p><span className="font-semibold">Email:</span> {selectedVol.email}</p>
                      <p><span className="font-semibold">Phone:</span> {selectedVol.phone}</p>
                      <p><span className="font-semibold">Aadhaar:</span> {selectedVol.aadhaar || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div><h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address Details</h4>
                    <div className="mt-2 rounded-xl border border-border bg-card p-4 text-xs space-y-2">
                      <p><span className="font-semibold">State:</span> {selectedVol.state || "-"}</p>
                      <p><span className="font-semibold">District:</span> {selectedVol.district || "-"}</p>
                      <p><span className="font-semibold">Area:</span> {selectedVol.working_area || "-"}</p>
                      <p><span className="font-semibold">Pincode:</span> {selectedVol.pincode || "-"}</p>
                      <p><span className="font-semibold">Full Address:</span> {selectedVol.address || "-"}</p>
                    </div>
                  </div>
                  <div><h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Documents</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedVol.aadhaar_front_url && (
                        <a href={selectedVol.aadhaar_front_url} target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-muted">Aadhaar Front</a>
                      )}
                      {selectedVol.aadhaar_back_url && (
                        <a href={selectedVol.aadhaar_back_url} target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-muted">Aadhaar Back</a>
                      )}
                      {!selectedVol.aadhaar_front_url && !selectedVol.aadhaar_back_url && (
                        <p className="text-xs text-muted-foreground">No documents uploaded.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
