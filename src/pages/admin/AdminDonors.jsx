import { useState, useEffect } from "react"
import { Download, Search, X } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

export default function AdminDonors() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [selectedDonor, setSelectedDonor] = useState(null)

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/donations/all")
        const data = await response.json()
        if (data.success) {
          setDonors(data.donations)
        }
      } catch (error) {
        console.error("Failed to fetch donations", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDonors()
  }, [])

  const filtered = donors.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || d.status === filter
    return matchSearch && matchFilter
  })

  // Ensure amount is parsed as integer for the sum
  const totalRaised = donors.filter((d) => d.status === "success").reduce((s, d) => s + parseInt(d.amount || 0, 10), 0)
  const successCount = donors.filter((d) => d.status === "success").length

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Donors</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">{loading ? "Loading..." : `${donors.length} total donations`}</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[9px] font-semibold text-primary transition hover:bg-muted sm:rounded-2xl sm:text-xs">
          <Download className="size-3.5" /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: "Total Raised", value: `₹${totalRaised.toLocaleString()}`, color: "text-teal" },
          { label: "Successful", value: successCount, color: "text-teal" },
          { label: "Failed", value: donors.length - successCount, color: "text-red-500" },
        ].map((s) => (
          <FadeIn key={s.label} className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-4">
            <p className={`font-heading text-[18px] font-extrabold sm:text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-[8px] text-muted-foreground sm:text-xs">{s.label}</p>
          </FadeIn>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search donors..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-8 pr-3 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm"
          />
        </div>
        {["all", "success", "failed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl border px-3 py-2 text-[9px] font-semibold capitalize transition sm:rounded-2xl sm:text-xs ${
              filter === f ? "border-teal bg-primary-soft text-teal" : "border-border bg-card text-primary hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <FadeIn className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Donor", "Campaign", "Amount", "Txn ID", "Date", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-3 sm:text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">Loading donors...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">No donors found.</td></tr>
              ) : filtered.map((d, i) => (
                <tr 
                  key={d.id} 
                  onClick={() => setSelectedDonor(d)}
                  className={`border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                >
                  <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-[8px] font-bold text-teal sm:size-8 sm:text-xs">
                        {d.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-[9px] font-semibold text-primary sm:text-sm">{d.name}</p>
                        <p className="text-[7px] text-muted-foreground sm:text-xs">{d.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-5 sm:py-3 sm:text-sm">{d.campaign_name || d.campaign || d.designation || "General"}</td>
                  <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                    <span className="font-heading text-[10px] font-extrabold text-primary sm:text-sm">₹{parseInt(d.amount || 0, 10).toLocaleString()}</span>
                  </td>
                  <td className="px-3 py-2.5 text-[8px] font-mono text-muted-foreground sm:px-5 sm:py-3 sm:text-xs">{d.txn_id}</td>
                  <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-5 sm:py-3 sm:text-sm">{new Date(d.date).toLocaleDateString()}</td>
                  <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[7px] font-bold sm:text-[10px] ${
                      d.status === "success" ? "bg-teal/10 text-teal" : "bg-red-50 text-red-500"
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSelectedDonor(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card p-6 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedDonor(null)} className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white transition">
              <X className="size-4" />
            </button>
            <h3 className="mb-6 font-heading text-xl font-extrabold text-primary">Donor Details</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                {selectedDonor.campaign_id ? (
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Donor Info</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{selectedDonor.name}</p>
                    <p className="text-sm font-semibold text-primary">{selectedDonor.email}</p>
                    <p className="text-sm font-semibold text-primary">{selectedDonor.phone}</p>
                    {selectedDonor.aadhaar && <p className="text-xs text-muted-foreground mt-1">Aadhaar: {selectedDonor.aadhaar}</p>}
                    <div className="mt-4 rounded-xl bg-teal/10 p-3 border border-teal/20">
                      <p className="text-[10px] font-bold uppercase text-teal">Campaign Donation</p>
                      <p className="mt-1 text-sm font-bold text-primary">{selectedDonor.campaign_name}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Personal Info</p>
                      <p className="mt-1 text-sm font-semibold text-primary">{selectedDonor.name} {selectedDonor.gender && `(${selectedDonor.gender})`}</p>
                      <p className="text-xs text-muted-foreground">S/o, D/o, W/o: {selectedDonor.parent_name || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">DOB: {selectedDonor.dob ? new Date(selectedDonor.dob).toLocaleDateString() : 'N/A'} | Blood: {selectedDonor.blood_group || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Profession: {selectedDonor.profession || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Contact</p>
                      <p className="mt-1 text-sm font-semibold text-primary">{selectedDonor.email}</p>
                      <p className="text-sm font-semibold text-primary">{selectedDonor.phone}</p>
                      <p className="text-xs text-muted-foreground">Aadhaar: {selectedDonor.aadhaar}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Donation Info</p>
                  <p className="mt-1 text-lg font-extrabold text-teal">₹{parseInt(selectedDonor.amount || 0, 10).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Txn ID: {selectedDonor.txn_id}</p>
                  <p className="text-xs text-muted-foreground">Method: {selectedDonor.payment_method} | Recurring: {selectedDonor.recurring ? "Yes" : "No"}</p>
                  <p className="text-xs text-muted-foreground">Designation: {selectedDonor.designation}</p>
                  <p className="text-xs text-muted-foreground">Date: {new Date(selectedDonor.date || selectedDonor.created_at).toLocaleDateString()}</p>
                  <p className="mt-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        selectedDonor.status === "success" ? "bg-teal/10 text-teal" : "bg-red-50 text-red-500"
                      }`}>
                      Status: {selectedDonor.status || 'success'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Address</p>
                  <p className="mt-1 text-xs text-primary">{selectedDonor.address}</p>
                  <p className="text-xs text-muted-foreground">{selectedDonor.district}, {selectedDonor.state} - {selectedDonor.pincode}</p>
                  <p className="text-xs text-muted-foreground">Working Area: {selectedDonor.working_area || 'N/A'}</p>
                </div>
              </div>
            </div>

            {!selectedDonor.campaign_id && (
              <div className="mt-6 border-t border-border pt-6">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-3">Documents</p>
                <div className="flex flex-wrap gap-4">
                  {selectedDonor.profile_pic_url && (
                    <a href={selectedDonor.profile_pic_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-teal hover:underline">
                      View Profile Photo
                    </a>
                  )}
                  {selectedDonor.aadhaar_front_url && (
                    <a href={selectedDonor.aadhaar_front_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-teal hover:underline">
                      View Aadhaar Front
                    </a>
                  )}
                  {selectedDonor.aadhaar_back_url && (
                    <a href={selectedDonor.aadhaar_back_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-teal hover:underline">
                      View Aadhaar Back
                    </a>
                  )}
                  {!selectedDonor.profile_pic_url && !selectedDonor.aadhaar_front_url && !selectedDonor.aadhaar_back_url && (
                    <p className="text-xs text-muted-foreground">No documents uploaded.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
