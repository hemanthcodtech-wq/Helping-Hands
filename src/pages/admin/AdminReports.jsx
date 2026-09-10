import { useState, useEffect } from "react"
import FadeIn from "../../components/Common/FadeIn"

export default function AdminReports() {
  const [donors, setDonors] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donorsRes, volunteersRes] = await Promise.all([
          fetch("http://localhost:5000/api/donations/all"),
          fetch("http://localhost:5000/api/volunteers/all")
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
        console.error("Error fetching report data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const successDonors = donors.filter((d) => d.status === "success")
  // Convert amount to number, some might be strings in DB
  const totalRaised = successDonors.reduce((s, d) => s + (Number(d.amount) || 0), 0)
  const avgDonation = successDonors.length ? Math.round(totalRaised / successDonors.length) : 0

  const campaignMap = {}
  successDonors.forEach((d) => {
    const campaignName = d.campaign_name || d.designation || "General Donation"
    campaignMap[campaignName] = (campaignMap[campaignName] || 0) + (Number(d.amount) || 0)
  })
  const campaigns = Object.entries(campaignMap).sort((a, b) => b[1] - a[1])
  const maxCampaign = campaigns[0]?.[1] || 1

  const volByRole = {}
  volunteers.forEach((v) => { 
    const role = v.role || "Volunteer"
    volByRole[role] = (volByRole[role] || 0) + 1 
  })
  const roles = Object.entries(volByRole).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Reports</h2>
        <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Platform overview</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading reports data...</p>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "Total Raised", value: `₹${totalRaised.toLocaleString()}`, color: "text-teal" },
              { label: "Avg Donation", value: `₹${avgDonation.toLocaleString()}`, color: "text-accent" },
              { label: "Total Donors", value: successDonors.length, color: "text-primary" },
              { label: "Total Volunteers", value: volunteers.filter((v) => v.status === "approved").length, color: "text-teal" },
            ].map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.07} className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5">
                <p className={`font-heading text-[20px] font-extrabold sm:text-2xl ${s.color}`}>{s.value}</p>
                <p className="mt-0.5 text-[8px] text-muted-foreground sm:text-xs">{s.label}</p>
              </FadeIn>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Donations by campaign */}
            <FadeIn className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-6">
              <h3 className="mb-4 text-[11px] font-bold text-primary sm:text-sm">Donations by Campaign</h3>
              <div className="space-y-3">
                {campaigns.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No donation data available.</p>
                ) : campaigns.map(([name, amount]) => (
                  <div key={name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[9px] font-medium text-primary sm:text-sm">{name}</span>
                      <span className="text-[9px] font-bold text-teal sm:text-sm">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted sm:h-2">
                      <div
                        className="h-full rounded-full bg-teal transition-all duration-700"
                        style={{ width: `${(amount / maxCampaign) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Volunteers by role */}
            <FadeIn delay={0.1} className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-6">
              <h3 className="mb-4 text-[11px] font-bold text-primary sm:text-sm">Volunteers by Role</h3>
              <div className="space-y-3">
                {roles.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No volunteer data available.</p>
                ) : roles.map(([role, count]) => (
                  <div key={role}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[9px] font-medium text-primary sm:text-sm">{role}</span>
                      <span className="text-[9px] font-bold text-accent sm:text-sm">{count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted sm:h-2">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-700"
                        style={{ width: `${(count / volunteers.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </>
      )}
    </div>
  )
}
