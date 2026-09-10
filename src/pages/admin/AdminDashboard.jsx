import { useNavigate } from "react-router-dom"
import { Heart, Image, TrendingUp, Users } from "lucide-react"
import { useApp } from "../../context/AppContext"
import FadeIn from "../../components/Common/FadeIn"

export default function AdminDashboard() {
  const { donors, volunteers, galleryImgs } = useApp()
  const navigate = useNavigate()

  const totalRaised = donors.filter((d) => d.status === "success").reduce((s, d) => s + d.amount, 0)
  const pendingVols = volunteers.filter((v) => v.status === "pending").length
  const approvedVols = volunteers.filter((v) => v.status === "approved").length

  const STATS = [
    { icon: Heart, label: "Total Raised", value: `₹${totalRaised.toLocaleString()}`, sub: `${donors.length} donations`, color: "text-accent", bg: "bg-accent/10", to: "/admin/donors" },
    { icon: Users, label: "Volunteers", value: volunteers.length, sub: `${pendingVols} pending`, color: "text-teal", bg: "bg-teal/10", to: "/admin/volunteers" },
    { icon: TrendingUp, label: "Approved", value: approvedVols, sub: "active volunteers", color: "text-primary", bg: "bg-primary-soft", to: "/admin/volunteers" },
    { icon: Image, label: "Gallery", value: galleryImgs.length, sub: "images uploaded", color: "text-purple-600", bg: "bg-purple-50", to: "/admin/gallery" },
  ]

  const recentDonors = donors.slice(0, 5)
  const recentVols = volunteers.slice(0, 5)

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Dashboard Overview</h2>
        <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Welcome back, Admin.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.07}>
            <button onClick={() => navigate(s.to)} className="w-full rounded-xl border border-border bg-card p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5">
              <span className={`grid size-8 place-items-center rounded-full ${s.bg} sm:size-11`}>
                <s.icon className={`size-4 ${s.color} sm:size-5`} />
              </span>
              <p className={`mt-2 font-heading text-[20px] font-extrabold sm:mt-3 sm:text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-[9px] font-semibold text-primary sm:text-sm">{s.label}</p>
              <p className="mt-0.5 text-[7px] text-muted-foreground sm:text-xs">{s.sub}</p>
            </button>
          </FadeIn>
        ))}
      </div>

      {/* Recent tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Donors */}
        <FadeIn className="rounded-2xl border border-border bg-card sm:rounded-3xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="text-[11px] font-bold text-primary sm:text-sm">Recent Donors</h3>
            <button onClick={() => navigate("/admin/donors")} className="text-[9px] font-semibold text-teal hover:underline sm:text-xs">View all</button>
          </div>
          <div className="divide-y divide-border">
            {recentDonors.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-primary-soft text-[8px] font-bold text-teal sm:size-8 sm:text-xs">
                    {d.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[9px] font-semibold text-primary sm:text-sm">{d.name}</p>
                    <p className="text-[7px] text-muted-foreground sm:text-xs">{d.campaign}</p>
                  </div>
                </div>
                <span className="font-heading text-[10px] font-extrabold text-teal sm:text-sm">₹{d.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Recent Volunteers */}
        <FadeIn delay={0.1} className="rounded-2xl border border-border bg-card sm:rounded-3xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="text-[11px] font-bold text-primary sm:text-sm">Recent Volunteers</h3>
            <button onClick={() => navigate("/admin/volunteers")} className="text-[9px] font-semibold text-teal hover:underline sm:text-xs">View all</button>
          </div>
          <div className="divide-y divide-border">
            {recentVols.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-teal/10 text-[8px] font-bold text-teal sm:size-8 sm:text-xs">
                    {v.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[9px] font-semibold text-primary sm:text-sm">{v.name}</p>
                    <p className="text-[7px] text-muted-foreground sm:text-xs">{v.role}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[7px] font-bold sm:text-[10px] ${
                  v.status === "approved" ? "bg-teal/10 text-teal"
                  : v.status === "pending" ? "bg-amber-50 text-amber-600"
                  : "bg-red-50 text-red-500"
                }`}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
