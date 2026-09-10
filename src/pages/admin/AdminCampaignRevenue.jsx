import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Download, Search, Filter } from "lucide-react"
import jsPDF from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"

export default function AdminCampaignRevenue() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campRes = await fetch(`https://helpinghandsbe.vercel.app/api/campaigns/${id}`)
        const campData = await campRes.json()
        if (campData.success) setCampaign(campData.campaign)

        const donRes = await fetch(`https://helpinghandsbe.vercel.app/api/campaigns/${id}/donors`)
        const donData = await donRes.json()
        if (donData.success) setDonors(donData.donors)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const filteredDonors = donors.filter(d => 
    (d.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (d.email || "").toLowerCase().includes(search.toLowerCase())
  )

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text(`Revenue Report: ${campaign?.name}`, 14, 15)
    doc.autoTable({
      head: [['Date', 'Donor', 'Email', 'Amount (INR)', 'TXN ID']],
      body: filteredDonors.map(d => [
        new Date(d.date).toLocaleDateString(),
        d.name,
        d.email,
        d.amount,
        d.txn_id
      ]),
      startY: 20
    })
    doc.save(`campaign_${id}_revenue.pdf`)
  }

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredDonors.map(d => ({
      Date: new Date(d.date).toLocaleDateString(),
      Donor: d.name,
      Email: d.email,
      Phone: d.phone,
      Amount: d.amount,
      Status: d.status,
      TransactionID: d.txn_id
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Revenue")
    XLSX.writeFile(wb, `campaign_${id}_revenue.xlsx`)
  }

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading...</div>
  if (!campaign) return <div className="p-10 text-center text-muted-foreground">Campaign not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/campaigns" className="grid size-8 place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-teal hover:text-white">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Campaign Revenue</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">{campaign.name}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Raised</p>
          <p className="mt-2 text-2xl font-extrabold text-teal">₹{campaign.raised_amount?.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Goal</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">{campaign.goal}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Donors</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">{donors.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search donors..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-xs focus:border-teal focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={exportPDF} className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-primary transition hover:bg-muted">
              <Download className="size-3.5" /> PDF
            </button>
            <button onClick={exportExcel} className="flex items-center gap-2 rounded-xl bg-teal px-3 py-2 text-xs font-bold text-white transition hover:bg-teal-dark">
              <Download className="size-3.5" /> Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Donor Info</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDonors.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-sm text-muted-foreground">No donors found</td></tr>
              ) : filteredDonors.map((d) => (
                <tr key={d.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3 text-[10px] sm:text-xs">{new Date(d.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <p className="text-[10px] font-bold text-primary sm:text-sm">{d.name}</p>
                    <p className="text-[8px] text-muted-foreground sm:text-[10px]">{d.email} • {d.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-bold text-primary sm:text-sm">₹{d.amount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-green-50 px-2 py-0.5 text-[8px] font-bold uppercase text-green-600 sm:text-[10px]">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
