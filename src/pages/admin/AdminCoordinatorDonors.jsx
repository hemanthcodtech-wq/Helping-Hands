import React, { useState, useEffect } from "react"
import { Search, HeartHandshake, ChevronDown, ChevronRight } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

export default function AdminCoordinatorDonors() {
  const [donors, setDonors] = useState([])
  const [rawDonors, setRawDonors] = useState([])
  const [search, setSearch] = useState("")
  const [expandedRow, setExpandedRow] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/api/coordinators/donors")
      .then(res => res.json())
      .then(data => { 
        if(data.success) {
          // Aggregate by coordinator
          const aggregated = {};
          data.donors.forEach(d => {
            if (!aggregated[d.coordinator_name]) {
              aggregated[d.coordinator_name] = { name: d.coordinator_name, totalAmountNeeded: 0, donors: new Set() };
            }
            aggregated[d.coordinator_name].totalAmountNeeded += Number(d.amount_needed);
            aggregated[d.coordinator_name].donors.add(d.id);
          });
          const result = Object.values(aggregated).map(a => ({
            coordinator: a.name,
            totalAmountNeeded: a.totalAmountNeeded,
            donorsCount: a.donors.size
          }));
          setDonors(result);
          setRawDonors(data.donors);
        }
      })
      .catch(console.error)
  }, [])

  const filtered = donors.filter(d => d.coordinator?.toLowerCase().includes(search.toLowerCase()))

  const totalDonors = donors.reduce((acc, d) => acc + d.donorsCount, 0)
  const topCoordinator = donors.length > 0 ? donors.reduce((prev, current) => (prev.donorsCount > current.donorsCount) ? prev : current).coordinator : "N/A"

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Coordinator Donors</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Donors created under coordinators needing assistance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4">
        {[
          { label: "Total Donors", value: totalDonors, color: "text-teal" },
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
                {["", "Coordinator", "Total Amount Needed", "Donors Count"].map((h) => (
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
                    <td className="px-3 py-2.5 sm:px-5 sm:py-3 font-extrabold text-teal">₹{c.totalAmountNeeded.toLocaleString()}</td>
                    <td className="px-3 py-2.5 sm:px-5 sm:py-3 text-muted-foreground">{c.donorsCount}</td>
                  </tr>
                  {expandedRow === c.coordinator && (
                    <tr className="bg-muted/10 border-b border-border">
                      <td colSpan={4} className="p-0">
                        <div className="px-5 py-4 sm:px-12">
                          <h4 className="mb-3 text-xs font-bold text-primary">Individual Donors</h4>
                          <div className="rounded-xl border border-border bg-card overflow-hidden">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-border bg-muted/40 text-[9px] uppercase text-muted-foreground">
                                  <th className="px-4 py-2 font-semibold">Date</th>
                                  <th className="px-4 py-2 font-semibold">Donor Name</th>
                                  <th className="px-4 py-2 font-semibold">Aadhar Number</th>
                                  <th className="px-4 py-2 font-semibold">Amount Given</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rawDonors.filter(rd => rd.coordinator_name === c.coordinator).map(rd => (
                                  <tr key={rd.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                                    <td className="px-4 py-2">{new Date(rd.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 font-medium">{rd.name}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{rd.aadhar_number}</td>
                                    <td className="px-4 py-2 font-bold text-teal">₹{rd.amount_needed}</td>
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
