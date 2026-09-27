import React, { useState, useEffect } from "react"
import { Search, Landmark, ChevronDown, ChevronRight } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

export default function AdminCoordinatorCollections() {
  const [collections, setCollections] = useState([])
  const [rawCollections, setRawCollections] = useState([])
  const [search, setSearch] = useState("")
  const [expandedRow, setExpandedRow] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/api/coordinators/collections")
      .then(res => res.json())
      .then(data => { 
        if(data.success) {
          // Aggregate by coordinator
          const aggregated = {};
          data.collections.forEach(c => {
            if (!aggregated[c.coordinator_name]) {
              aggregated[c.coordinator_name] = { name: c.coordinator_name, totalAmount: 0, donors: new Set() };
            }
            aggregated[c.coordinator_name].totalAmount += Number(c.amount);
            aggregated[c.coordinator_name].donors.add(c.mobile);
          });
          const result = Object.values(aggregated).map(a => ({
            coordinator: a.name,
            totalAmount: a.totalAmount,
            donorsCount: a.donors.size
          }));
          setCollections(result);
          setRawCollections(data.collections);
        }
      })
      .catch(console.error)
  }, [])

  const filtered = collections.filter(c => c.coordinator?.toLowerCase().includes(search.toLowerCase()))

  const totalAmount = collections.reduce((acc, c) => acc + c.totalAmount, 0)
  const topCoordinator = collections.length > 0 ? collections.reduce((prev, current) => (prev.totalAmount > current.totalAmount) ? prev : current).coordinator : "N/A"

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Coordinator Collections</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Track amounts collected by coordinators</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4">
        {[
          { label: "Total Collected", value: `₹${totalAmount.toLocaleString()}`, color: "text-teal" },
          { label: "Top Coordinator", value: topCoordinator, color: "text-teal" },
        ].map((s) => (
          <FadeIn key={s.label} className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-4">
            <p className={`font-heading text-[18px] font-extrabold sm:text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-[8px] text-muted-foreground sm:text-xs">{s.label}</p>
          </FadeIn>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by coordinator..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-8 pr-3 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm"
          />
        </div>
      </div>

      <FadeIn className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["", "Coordinator", "Total Amount", "Donors Count"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-3 sm:text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">No records found.</td></tr>
              ) : filtered.map((c, i) => (
                <React.Fragment key={i}>
                  <tr 
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === c.coordinator ? null : c.coordinator)}
                  >
                    <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                      {expandedRow === c.coordinator ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
                    </td>
                    <td className="px-3 py-2.5 sm:px-5 sm:py-3 font-semibold text-primary">{c.coordinator}</td>
                    <td className="px-3 py-2.5 sm:px-5 sm:py-3 font-extrabold text-teal">₹{c.totalAmount.toLocaleString()}</td>
                    <td className="px-3 py-2.5 sm:px-5 sm:py-3 text-muted-foreground">{c.donorsCount}</td>
                  </tr>
                  {expandedRow === c.coordinator && (
                    <tr className="bg-muted/10 border-b border-border">
                      <td colSpan={4} className="p-0">
                        <div className="px-5 py-4 sm:px-12">
                          <h4 className="mb-3 text-xs font-bold text-primary">Individual Collections</h4>
                          <div className="rounded-xl border border-border bg-card overflow-hidden">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-border bg-muted/40 text-[9px] uppercase text-muted-foreground">
                                  <th className="px-4 py-2 font-semibold">Date</th>
                                  <th className="px-4 py-2 font-semibold">Donor Name</th>
                                  <th className="px-4 py-2 font-semibold">Mobile</th>
                                  <th className="px-4 py-2 font-semibold">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rawCollections.filter(rc => rc.coordinator_name === c.coordinator).map(rc => (
                                  <tr key={rc.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                                    <td className="px-4 py-2">{rc.collection_date ? new Date(rc.collection_date).toLocaleDateString() : new Date(rc.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 font-medium">{rc.name}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{rc.mobile}</td>
                                    <td className="px-4 py-2 font-bold text-teal">₹{rc.amount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>
    </div>
  )
}
