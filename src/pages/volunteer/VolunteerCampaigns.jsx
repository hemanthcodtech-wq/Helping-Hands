import { useEffect, useState } from "react"
import { Flag, Search, Target, TrendingUp, Users } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

export default function VolunteerCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/campaigns")
        const data = await res.json()
        if (data.success) setCampaigns(data.campaigns)
      } catch (err) {
        console.error("Failed to fetch campaigns:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  const filtered = campaigns.filter(c =>
    `${c.name} ${c.text}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold sm:text-3xl text-primary">All Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Loading..." : `${filtered.length} active campaign${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Flag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      {/* Stats row */}
      {!loading && campaigns.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-extrabold text-primary">{campaigns.length}</p>
            <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">Total Campaigns</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-extrabold text-teal">
              {campaigns.filter(c => c.raised >= 100).length}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">Goal Reached</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-extrabold text-[#4a8a2a]">
              ₹{campaigns.reduce((sum, c) => sum + Number(c.raised_amount || 0), 0).toLocaleString("en-IN")}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">Total Raised</p>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-card overflow-hidden">
              <div className="h-44 bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-2 w-full rounded-full bg-muted mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => {
            const pct = Math.min(c.raised || 0, 100)
            const reached = pct >= 100
            return (
              <FadeIn key={c.id} delay={i * 0.06}>
                <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-lg hover:-translate-y-0.5">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#4a8a2a]/20 to-teal/20">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Flag className="size-12 text-teal/40" />
                      </div>
                    )}
                    {/* Status badge */}
                    <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${reached ? "bg-emerald-500 text-white" : "bg-white/90 text-[#4a8a2a]"}`}>
                      {reached ? "✓ Goal Reached" : "Active"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-base font-extrabold text-primary leading-snug">{c.name}</h3>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">{c.text}</p>

                    {/* Progress bar */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-semibold">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="size-3" />
                          ₹{Number(c.raised_amount || 0).toLocaleString("en-IN")} raised
                        </span>
                        <span className="text-primary">Goal: {c.goal}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${reached ? "bg-emerald-500" : "bg-teal"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Users className="size-3" />
                          Open to volunteers
                        </span>
                        <span className={`text-[11px] font-bold ${reached ? "text-emerald-600" : "text-teal"}`}>
                          {pct}%
                        </span>
                      </div>
                    </div>

                    {/* Join button */}
                    <a
                      href="/donate"
                      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-white transition ${reached ? "bg-emerald-500 hover:bg-emerald-600" : "bg-teal hover:bg-teal-dark"}`}
                    >
                      <Target className="size-3.5" />
                      {reached ? "Campaign Completed" : "Support This Campaign"}
                    </a>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Flag className="mb-3 size-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">
            {search ? "No campaigns match your search." : "No campaigns available yet."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs font-bold text-teal hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  )
}
