import { useState, useEffect } from "react"
import { Check, X, RefreshCw, Eye } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminVolunteerRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedVol, setSelectedVol] = useState(null)

  const fetchRequests = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:5000/api/volunteers/requests")
      const data = await res.json()
      if (data.success) {
        setRequests(data.requests)
      } else {
        setError(data.message || "Failed to load requests")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/volunteers/${action}/${id}`, { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setRequests(requests.filter(r => r.id !== id))
        if (selectedVol?.id === id) setSelectedVol(null)
      } else {
        alert(data.message || `Failed to ${action} request`)
      }
    } catch (err) {
      alert("Network error")
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Volunteer Requests</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">{requests.length} pending requests</p>
        </div>
        <button onClick={fetchRequests} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-[9px] font-semibold text-primary transition hover:bg-muted sm:rounded-2xl sm:text-xs">
          <RefreshCw className={`size-3 sm:size-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <FadeIn className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Applicant", "Role", "City", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground sm:px-4 sm:py-3 sm:text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && requests.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">Loading...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">No pending requests.</td></tr>
              ) : requests.map((v, i) => (
                <tr key={v.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-teal/10 text-[8px] font-bold text-teal sm:size-8 sm:text-xs">
                        {v.profile_pic_url ? <img src={v.profile_pic_url} className="h-full w-full object-cover" /> : v.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-[9px] font-semibold text-primary sm:text-sm">{v.name}</p>
                        <p className="text-[7px] text-muted-foreground sm:text-xs">{v.email}</p>
                        <p className="text-[7px] text-muted-foreground sm:text-xs">{v.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-4 sm:py-3 sm:text-sm">{v.role}</td>
                  <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-4 sm:py-3 sm:text-sm">{v.city}</td>
                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedVol(v)} title="View Details"
                        className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[8px] font-bold text-blue-500 transition hover:bg-blue-500 hover:text-white sm:text-[10px]">
                        <Eye className="size-3" /> View
                      </button>
                      <button onClick={() => handleAction(v.id, "approve")} title="Approve"
                        className="flex items-center gap-1 rounded-lg bg-teal/10 px-2 py-1 text-[8px] font-bold text-teal transition hover:bg-teal hover:text-white sm:text-[10px]">
                        <Check className="size-3" /> Approve
                      </button>
                      <button onClick={() => handleAction(v.id, "reject")} title="Reject"
                        className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-[8px] font-bold text-red-500 transition hover:bg-red-500 hover:text-white sm:text-[10px]">
                        <X className="size-3" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>

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
                    <div className="grid h-full w-full place-items-center text-2xl font-bold text-teal">{selectedVol.name.charAt(0)}</div>
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

              <div className="mt-8 flex justify-end gap-3 border-t border-border pt-4">
                <button onClick={() => handleAction(selectedVol.id, "reject")} className="rounded-xl px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50">Reject</button>
                <button onClick={() => handleAction(selectedVol.id, "approve")} className="rounded-xl bg-teal px-4 py-2 text-xs font-bold text-white hover:bg-teal-dark">Approve</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
