import { useState, useEffect } from "react"
import FadeIn from "../../components/Common/FadeIn"

export default function CoordinatorDashboard() {
  const [coord, setCoord] = useState(null)
  const [stats, setStats] = useState({ amount: 0, donors: 0 })

  useEffect(() => {
    const data = localStorage.getItem("coordinatorData")
    if (data) {
      const parsed = JSON.parse(data)
      setCoord(parsed)
      const stored = localStorage.getItem(`coord_collections_${parsed.id}`)
      if (stored) {
        const collections = JSON.parse(stored)
        const totalAmount = collections.reduce((acc, c) => acc + Number(c.amount), 0)
        const uniqueDonors = new Set(collections.map(c => c.mobile)).size
        setStats({ amount: totalAmount, donors: uniqueDonors })
      }
    }
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4">
        {[
          { label: "My Collections", value: `₹${stats.amount.toLocaleString()}` },
          { label: "Donors Brought", value: stats.donors.toString() },
          { label: "My Status", value: coord?.status || "Active" },
        ].map((s) => (
          <FadeIn key={s.label} className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-4">
            <p className="font-heading text-[18px] font-extrabold text-teal sm:text-2xl">{s.value}</p>
            <p className="text-[8px] text-muted-foreground sm:text-xs">{s.label}</p>
          </FadeIn>
        ))}
      </div>
      
      <FadeIn className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-2">Welcome {coord?.name ? coord.name : "to your Coordinator Portal"}!</h3>
        <p className="text-sm text-muted-foreground">This is your main dashboard. From here, you can track your collections, see the donors you've brought in, and contact support if you need any help.</p>
      </FadeIn>
    </div>
  )
}
