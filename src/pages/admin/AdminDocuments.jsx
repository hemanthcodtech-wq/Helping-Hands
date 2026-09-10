import { useMemo, useState, useEffect } from "react"
import { Award, Download, IdCard, Mail, Printer, Search, Send, Users } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

const MEMBER_DATA = [
  { id: "MEM-001", name: "Ananya Rao", email: "ananya@example.org", role: "Community Member", city: "Tirupati" },
  { id: "MEM-002", name: "Ravi Kumar", email: "ravi@example.org", role: "Life Member", city: "Chennai" },
  { id: "MEM-003", name: "Meena Devi", email: "meena@example.org", role: "Community Member", city: "Bengaluru" },
]

const makeId = (type, id) => `${type === "certificate" ? "HH-CERT" : "HH-ID"}-${new Date().getFullYear()}-${String(id).padStart(4, "0")}`

export default function AdminDocuments() {
  const [volunteers, setVolunteers] = useState([])
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)

  const [type, setType] = useState("certificate")
  const [recipientType, setRecipientType] = useState("volunteer")
  const [selectedId, setSelectedId] = useState("")
  const [sent, setSent] = useState({})
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donorsRes, volunteersRes] = await Promise.all([
          fetch("https://helpinghandsbe.vercel.app/api/donations/all"),
          fetch("https://helpinghandsbe.vercel.app/api/volunteers/all")
        ])
        
        const donorsData = await donorsRes.json()
        const volunteersData = await volunteersRes.json()
        
        if (donorsData.success) {
          setDonors(donorsData.donations)
        }
        if (volunteersData.success) {
          setVolunteers(volunteersData.volunteers)
        }
      } catch (error) {
        console.error("Error fetching documents data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const recipients = useMemo(() => {
    if (recipientType === "volunteer") return volunteers.map(v => ({ id: v.id, name: v.name, email: v.email, role: v.role || "Volunteer", city: v.city || "", profile_pic_url: v.profile_pic_url }))
    if (recipientType === "donor") return donors.filter(d => d.status === "success").map(d => ({ id: d.id, name: d.name, email: d.email, role: "Donor", city: "", profile_pic_url: d.profile_pic_url }))
    return MEMBER_DATA
  }, [recipientType, volunteers, donors])

  const filtered = recipients.filter(r => `${r.name} ${r.email} ${r.role}`.toLowerCase().includes(query.toLowerCase()))
  const selected = recipients.find(r => String(r.id) === String(selectedId)) || filtered[0]
  const documentId = selected ? makeId(type, selected.id) : "HH-DOCUMENT-0000"

  const sendDocument = () => {
    if (!selected) return
    setSent(prev => ({ ...prev, [documentId]: true }))
  }

  const printDocument = () => window.print()

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Certificates & ID Cards</h2>
        <p className="mt-1 text-[9px] text-muted-foreground sm:text-sm">Super Admin can generate, print and mark documents as sent to volunteers, donors and members.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <FadeIn className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-5">
          <div className="flex gap-2">
            <button onClick={() => setType("certificate")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold ${type === "certificate" ? "bg-teal text-white" : "bg-muted text-primary"}`}><Award className="size-4" /> Certificate</button>
            <button onClick={() => setType("idcard")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold ${type === "idcard" ? "bg-teal text-white" : "bg-muted text-primary"}`}><IdCard className="size-4" /> ID Card</button>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["volunteer", "donor", "member"].map(kind => <button key={kind} onClick={() => { setRecipientType(kind); setSelectedId("") }} className={`rounded-xl border px-2 py-2 text-[10px] font-bold capitalize ${recipientType === kind ? "border-teal bg-primary-soft text-teal" : "border-border text-primary"}`}>{kind}s</button>)}
          </div>
          <div className="relative mt-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipient" className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-xs focus:border-teal focus:outline-none" /></div>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {loading ? (
              <p className="p-3 text-xs text-muted-foreground text-center">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="p-3 text-xs text-muted-foreground text-center">No {recipientType}s found.</p>
            ) : (
              filtered.map(r => <button key={r.id} onClick={() => setSelectedId(r.id)} className={`w-full rounded-xl border p-3 text-left ${String(selected?.id) === String(r.id) ? "border-teal bg-primary-soft" : "border-border bg-background"}`}><p className="text-xs font-bold text-primary">{r.name}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{r.email} · {r.role}</p></button>)
            )}
          </div>
        </FadeIn>

        <FadeIn className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-[10px] font-bold uppercase tracking-wider text-teal">Live Preview</p><h3 className="mt-1 text-sm font-extrabold text-primary">{type === "certificate" ? "Certificate of Appreciation" : "Volunteer / Donor / Member ID Card"}</h3></div>
            <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-mono text-muted-foreground">{documentId}</span>
          </div>

          {type === "certificate" ? (
            <div className="mx-auto mt-6 aspect-[1.414/1] w-full max-w-[760px] border-[8px] border-[#5E922C] bg-gradient-to-br from-white to-primary-soft p-5 shadow-lg sm:border-[12px] sm:p-10">
              <div className="flex h-full flex-col items-center justify-center border-2 border-[#04458F]/30 p-4 text-center sm:p-8">
                <Award className="size-10 text-accent sm:size-14" /><p className="mt-3 text-[9px] font-bold uppercase tracking-[0.25em] text-teal sm:text-xs">Helping Hands Foundation</p><h4 className="mt-3 font-heading text-2xl font-extrabold text-primary sm:text-4xl">Certificate of Appreciation</h4><p className="mt-4 text-xs text-muted-foreground sm:text-sm">This certificate is proudly presented to</p><p className="mt-2 font-heading text-xl font-extrabold text-primary sm:text-3xl">{selected?.name || "Select a recipient"}</p><p className="mt-3 max-w-xl text-[10px] leading-5 text-muted-foreground sm:text-sm">In recognition of valuable support and contribution towards our community initiatives.</p><p className="mt-5 text-[9px] font-mono text-muted-foreground sm:text-xs">Certificate ID: {documentId}</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-6 w-full max-w-[560px] rounded-3xl bg-gradient-to-br from-primary to-[#0a6b8a] p-5 text-white shadow-xl sm:p-7">
              <div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Helping Hands Foundation</p><h4 className="mt-1 text-lg font-extrabold">{recipientType === "volunteer" ? "Volunteer ID" : recipientType === "donor" ? "Donor ID" : "Member ID"}</h4></div><IdCard className="size-8 text-white/80" /></div>
              <div className="mt-8 flex items-center gap-4">
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/15 text-xl font-extrabold">
                  {selected?.profile_pic_url ? <img src={selected.profile_pic_url} alt="" className="h-full w-full object-cover" /> : (selected?.name?.charAt(0) || "H")}
                </div>
                <div><p className="text-xl font-extrabold">{selected?.name || "Select a recipient"}</p><p className="mt-1 text-xs text-white/70">{selected?.role || "Role"}</p><p className="mt-1 text-xs text-white/70">{selected?.city || "Community"}</p></div>
              </div>
              <div className="mt-7 flex items-end justify-between"><p className="font-mono text-[10px] text-white/70">{documentId}</p><p className="text-[10px] font-semibold text-white/70">Valid • {new Date().getFullYear()}</p></div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2 print:hidden">
            <button onClick={printDocument} disabled={!selected} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-primary disabled:opacity-40"><Printer className="size-4" /> Print / Save PDF</button>
            <button onClick={sendDocument} disabled={!selected} className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40"><Send className="size-4" /> {sent[documentId] ? "Sent" : "Send to Recipient"}</button>
            {selected?.email && <a href={`mailto:${selected.email}?subject=${encodeURIComponent(type === "certificate" ? "Your Helping Hands Certificate" : "Your Helping Hands ID Card")}&body=${encodeURIComponent(`Your document ${documentId} is ready. Please contact Helping Hands Foundation if you need assistance.`)}`} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-primary"><Mail className="size-4" /> Email</a>}
          </div>
        </FadeIn>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 print:hidden">
        {[{ icon: Users, label: "Volunteers", value: volunteers.length }, { icon: HeartIcon, label: "Successful Donors", value: donors.filter(d => d.status === "success").length }, { icon: IdCard, label: "Members", value: MEMBER_DATA.length }].map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl border border-border bg-card p-4"><Icon className="size-5 text-teal" /><p className="mt-3 text-xl font-extrabold text-primary">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>)}
      </div>
    </div>
  )
}

function HeartIcon(props) { return <Award {...props} /> }
