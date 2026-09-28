import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Heart, Users, TrendingUp, Target, RefreshCw,
  ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle
} from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"
import API_BASE from "../../lib/api"

function StatCard({ icon: Icon, label, value, sub, color, bg, loading, onClick }) {
  return (
    <FadeIn>
      <button
        onClick={onClick}
        className="group w-full rounded-xl border border-border bg-card p-3 text-left transition-all hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl sm:p-5"
      >
        <div className="flex items-start justify-between">
          <span className={`grid size-8 place-items-center rounded-full ${bg} sm:size-11`}>
            <Icon className={`size-4 ${color} sm:size-5`} />
          </span>
          <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:size-4" />
        </div>
        {loading ? (
          <div className="mt-2 h-6 w-16 animate-pulse rounded bg-muted sm:mt-3 sm:h-8 sm:w-20" />
        ) : (
          <p className={`mt-2 font-heading text-[20px] font-extrabold sm:mt-3 sm:text-2xl ${color}`}>{value}</p>
        )}
        <p className="text-[9px] font-semibold text-primary sm:text-sm">{label}</p>
        <p className="mt-0.5 text-[7px] text-muted-foreground sm:text-xs">{sub}</p>
      </button>
    </FadeIn>
  )
}

function StatusBadge({ status }) {
  const config = {
    success: { icon: CheckCircle, cls: "bg-teal/10 text-teal" },
    approved: { icon: CheckCircle, cls: "bg-teal/10 text-teal" },
    pending: { icon: Clock, cls: "bg-amber-50 text-amber-600" },
    failed: { icon: XCircle, cls: "bg-red-50 text-red-500" },
    rejected: { icon: XCircle, cls: "bg-red-50 text-red-500" },
  }
  const { icon: Icon, cls } = config[status] || { icon: AlertCircle, cls: "bg-muted text-muted-foreground" }
  return (
    <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[7px] font-bold sm:gap-1 sm:text-[10px] ${cls}`}>
      <Icon className="size-2.5 sm:size-3" />
      {status}
    </span>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonations: 0,
    successDonations: 0,
    totalVolunteers: 0,
    pendingVolunteers: 0,
    approvedVolunteers: 0,
    totalCampaigns: 0,
    totalMembers: 0,
  })
  const [recentDonors, setRecentDonors] = useState([])
  const [recentVolunteers, setRecentVolunteers] = useState([])
  const [recentCampaigns, setRecentCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const [donationsRes, volunteersRes, campaignsRes, membersRes] = await Promise.allSettled([
        fetch(`${API_BASE}/api/donations/all`),
        fetch(`${API_BASE}/api/volunteers/all`),
        fetch(`${API_BASE}/api/campaigns`),
        fetch(`${API_BASE}/api/members`),
      ])

      let donations = []
      if (donationsRes.status === "fulfilled" && donationsRes.value.ok) {
        const data = await donationsRes.value.json()
        if (data.success) donations = data.donations || []
      }

      let volunteers = []
      if (volunteersRes.status === "fulfilled" && volunteersRes.value.ok) {
        const data = await volunteersRes.value.json()
        if (data.success) volunteers = data.volunteers || []
      }

      let campaigns = []
      if (campaignsRes.status === "fulfilled" && campaignsRes.value.ok) {
        const data = await campaignsRes.value.json()
        if (data.success) campaigns = data.campaigns || []
      }

      let members = []
      if (membersRes.status === "fulfilled" && membersRes.value.ok) {
        const data = await membersRes.value.json()
        if (data.success) members = data.members || []
      }

      const successDonations = donations.filter((d) => d.status === "success")
      const totalRaised = successDonations.reduce((s, d) => s + parseInt(d.amount || 0, 10), 0)
      const pendingVols = volunteers.filter((v) => v.status === "pending").length
      const approvedVols = volunteers.filter((v) => v.status === "approved").length

      setStats({
        totalRaised,
        totalDonations: donations.length,
        successDonations: successDonations.length,
        totalVolunteers: volunteers.length,
        pendingVolunteers: pendingVols,
        approvedVolunteers: approvedVols,
        totalCampaigns: campaigns.length,
        totalMembers: members.length,
      })

      setRecentDonors(donations.slice(0, 6))
      setRecentVolunteers(volunteers.slice(0, 6))
      setRecentCampaigns(campaigns.slice(0, 4))
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Dashboard fetch error:", err)
      setError("Failed to load dashboard data. Please refresh.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const STATS = [
    {
      icon: Heart,
      label: "Total Raised",
      value: `₹${stats.totalRaised.toLocaleString()}`,
      sub: `${stats.successDonations} successful donations`,
      color: "text-accent",
      bg: "bg-accent/10",
      to: "/admin/donors",
    },
    {
      icon: Users,
      label: "Volunteers",
      value: stats.totalVolunteers,
      sub: `${stats.pendingVolunteers} pending approval`,
      color: "text-teal",
      bg: "bg-teal/10",
      to: "/admin/volunteers",
    },
    {
      icon: TrendingUp,
      label: "Approved",
      value: stats.approvedVolunteers,
      sub: "active volunteers",
      color: "text-primary",
      bg: "bg-primary-soft",
      to: "/admin/volunteers",
    },
    {
      icon: Target,
      label: "Campaigns",
      value: stats.totalCampaigns,
      sub: `${stats.totalMembers} members registered`,
      color: "text-purple-600",
      bg: "bg-purple-50",
      to: "/admin/campaigns",
    },
  ]

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Dashboard Overview</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">
            Welcome back, Admin.{" "}
            {lastUpdated && (
              <span className="text-teal">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[9px] font-semibold text-primary transition hover:bg-muted disabled:opacity-50 sm:rounded-2xl sm:text-xs"
        >
          <RefreshCw className={`size-3 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 sm:rounded-2xl">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatCard
            key={s.label}
            {...s}
            loading={loading}
            onClick={() => navigate(s.to)}
          />
        ))}
      </div>

      {/* Recent Donations + Volunteers */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Donors */}
        <FadeIn className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
            <div>
              <h3 className="text-[11px] font-bold text-primary sm:text-sm">Recent Donations</h3>
              <p className="text-[8px] text-muted-foreground sm:text-xs">
                {loading ? "Loading..." : `${stats.totalDonations} total`}
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/donors")}
              className="text-[9px] font-semibold text-teal hover:underline sm:text-xs"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
                  <div className="size-6 animate-pulse rounded-full bg-muted sm:size-8" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2.5 w-24 animate-pulse rounded bg-muted sm:h-3 sm:w-32" />
                    <div className="h-2 w-16 animate-pulse rounded bg-muted sm:h-2.5 sm:w-20" />
                  </div>
                  <div className="h-3 w-12 animate-pulse rounded bg-muted sm:h-4 sm:w-16" />
                </div>
              ))
            ) : recentDonors.length === 0 ? (
              <p className="px-5 py-6 text-center text-xs text-muted-foreground">No donations yet.</p>
            ) : (
              recentDonors.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-[8px] font-bold text-teal sm:size-8 sm:text-xs">
                      {(d.name || "?").charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[9px] font-semibold text-primary sm:text-sm">{d.name}</p>
                      <p className="truncate text-[7px] text-muted-foreground sm:text-xs">
                        {d.campaign_name || d.campaign || "General Donation"}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex shrink-0 flex-col items-end gap-1">
                    <span className="font-heading text-[10px] font-extrabold text-teal sm:text-sm">
                      ₹{parseInt(d.amount || 0, 10).toLocaleString()}
                    </span>
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </FadeIn>

        {/* Recent Volunteers */}
        <FadeIn delay={0.1} className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
            <div>
              <h3 className="text-[11px] font-bold text-primary sm:text-sm">Recent Volunteers</h3>
              <p className="text-[8px] text-muted-foreground sm:text-xs">
                {loading ? "Loading..." : `${stats.pendingVolunteers} pending`}
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/volunteers")}
              className="text-[9px] font-semibold text-teal hover:underline sm:text-xs"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
                  <div className="size-6 animate-pulse rounded-full bg-muted sm:size-8" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2.5 w-24 animate-pulse rounded bg-muted sm:h-3 sm:w-32" />
                    <div className="h-2 w-16 animate-pulse rounded bg-muted sm:h-2.5 sm:w-20" />
                  </div>
                  <div className="h-4 w-12 animate-pulse rounded-full bg-muted sm:w-16" />
                </div>
              ))
            ) : recentVolunteers.length === 0 ? (
              <p className="px-5 py-6 text-center text-xs text-muted-foreground">No volunteers yet.</p>
            ) : (
              recentVolunteers.map((v) => (
                <div key={v.id} className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-teal/10 text-[8px] font-bold text-teal sm:size-8 sm:text-xs">
                      {(v.name || "?").charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[9px] font-semibold text-primary sm:text-sm">{v.name}</p>
                      <p className="truncate text-[7px] text-muted-foreground sm:text-xs">
                        {v.role || v.city || "Volunteer"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={v.status || "pending"} />
                </div>
              ))
            )}
          </div>
        </FadeIn>
      </div>

      {/* Campaigns Overview */}
      {!loading && recentCampaigns.length > 0 && (
        <FadeIn delay={0.15} className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
            <div>
              <h3 className="text-[11px] font-bold text-primary sm:text-sm">Active Campaigns</h3>
              <p className="text-[8px] text-muted-foreground sm:text-xs">{stats.totalCampaigns} campaigns running</p>
            </div>
            <button
              onClick={() => navigate("/admin/campaigns")}
              className="text-[9px] font-semibold text-teal hover:underline sm:text-xs"
            >
              Manage
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentCampaigns.map((c) => {
              const pct = Math.min(c.raised || 0, 100)
              const raised = parseInt(c.raised_amount || 0, 10)
              const target = parseInt(c.target_amount || 1, 10)
              return (
                <div key={c.id} className="px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex items-center justify-between">
                    <p className="max-w-[60%] truncate text-[9px] font-semibold text-primary sm:text-sm">{c.name}</p>
                    <span className="text-[9px] font-bold text-teal sm:text-sm">
                      ₹{raised.toLocaleString()} / ₹{target.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted sm:mt-2 sm:h-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal to-primary transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-[7px] text-muted-foreground sm:text-xs">{pct}% of goal reached</p>
                </div>
              )
            })}
          </div>
        </FadeIn>
      )}

      {/* Summary bar */}
      {!loading && (
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "Total Donations", value: stats.totalDonations, color: "text-primary" },
              { label: "Successful", value: stats.successDonations, color: "text-teal" },
              { label: "Failed / Pending", value: stats.totalDonations - stats.successDonations, color: "text-red-500" },
              { label: "Members", value: stats.totalMembers, color: "text-purple-600" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-4">
                <p className={`font-heading text-[18px] font-extrabold sm:text-2xl ${s.color}`}>{s.value}</p>
                <p className="text-[8px] text-muted-foreground sm:text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  )
}
