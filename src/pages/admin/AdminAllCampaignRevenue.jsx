import { useState, useEffect } from "react"
import { Download, Search, Filter } from "lucide-react"
import jsPDF from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"

export default function AdminAllCampaignRevenue() {
  const [donations, setDonations] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState("")
  const [campaignFilter, setCampaignFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donRes, campRes] = await Promise.all([
          fetch("https://helpinghandsbe.vercel.app/api/donations/all"),
          fetch("https://helpinghandsbe.vercel.app/api/campaigns")
        ])
        const donData = await donRes.json()
        const campData = await campRes.json()
        
        if (donData.success) {
          // Only show donations that are tied to a campaign
          const campaignDonations = donData.donations.filter(d => d.campaign_id != null && d.status === 'success')
          setDonations(campaignDonations)
        }
        if (campData.success) {
          setCampaigns(campData.campaigns)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredDonations = donations.filter(d => {
    const matchSearch = (d.name || "").toLowerCase().includes(search.toLowerCase()) || (d.email || "").toLowerCase().includes(search.toLowerCase()) || (d.txn_id || "").toLowerCase().includes(search.toLowerCase())
    const matchCampaign = campaignFilter === "all" || d.campaign_id.toString() === campaignFilter
    return matchSearch && matchCampaign
  })

  const totalRevenue = filteredDonations.reduce((sum, d) => sum + parseInt(d.amount || 0), 0)

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text(`Overall Campaign Revenue Report`, 14, 15)
    doc.autoTable({
      head: [['Date', 'Campaign', 'Donor', 'Email', 'Amount (INR)', 'TXN ID']],
      body: filteredDonations.map(d => [
        new Date(d.date).toLocaleDateString(),
        d.campaign_name || `Campaign #${d.campaign_id}`,
        d.name,
        d.email,
        d.amount,
        d.txn_id
      ]),
      startY: 20
    })
    doc.save(`all_campaigns_revenue.pdf`)
  }

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredDonations.map(d => ({
      Date: new Date(d.date).toLocaleDateString(),
      Campaign: d.campaign_name || `Campaign #${d.campaign_id}`,
      Donor: d.name,
      Email: d.email,
      Phone: d.phone,
      Amount: d.amount,
      TransactionID: d.txn_id
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Revenue")
    XLSX.writeFile(wb, `all_campaigns_revenue.xlsx`)
  }

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">All Campaigns Revenue</h2>
        <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Manage and export all campaign donations across the platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Raised (Filtered)</p>
          <p className="mt-2 text-2xl font-extrabold text-teal">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Donors (Filtered)</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">{filteredDonations.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search donors, email, txn..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-xs focus:border-teal focus:outline-none" />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <select value={campaignFilter} onChange={e => setCampaignFilter(e.target.value)} className="w-full appearance-none rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-xs focus:border-teal focus:outline-none">
                <option value="all">All Campaigns</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
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
                <th className="px-4 py-3">Date & TXN</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Donor Info</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDonations.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-sm text-muted-foreground">No donations match your filters</td></tr>
              ) : filteredDonations.map((d) => (
                <tr key={d.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="text-[10px] sm:text-xs">{new Date(d.date).toLocaleDateString()}</p>
                    <p className="mt-0.5 text-[8px] font-mono text-muted-foreground">{d.txn_id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md bg-indigo-50 px-2 py-1 text-[8px] font-bold text-indigo-600 sm:text-[10px]">
                      {d.campaign_name || `Campaign #${d.campaign_id}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[10px] font-bold text-primary sm:text-sm">{d.name}</p>
                    <p className="text-[8px] text-muted-foreground sm:text-[10px]">{d.email} • {d.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-bold text-primary sm:text-sm">₹{d.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
