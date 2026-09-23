import API_BASE from "../../lib/api"
import { useEffect, useState } from "react"
import { Heart, BookOpen, Users, Calendar, Tag, ExternalLink } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

const TAG_COLORS = {
  education:    "bg-blue-100 text-blue-700",
  health:       "bg-emerald-100 text-emerald-700",
  environment:  "bg-green-100 text-green-700",
  women:        "bg-pink-100 text-pink-700",
  food:         "bg-amber-100 text-amber-700",
  community:    "bg-violet-100 text-violet-700",
  youth:        "bg-orange-100 text-orange-700",
  default:      "bg-teal/10 text-teal",
}

function tagColor(tag) {
  if (!tag) return TAG_COLORS.default
  const key = tag.toLowerCase()
  return Object.keys(TAG_COLORS).find(k => key.includes(k))
    ? TAG_COLORS[Object.keys(TAG_COLORS).find(k => key.includes(k))]
    : TAG_COLORS.default
}

export default function VolunteerPrograms() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState("All")

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/programs`)
        const data = await res.json()
        if (data.success) setPrograms(data.programs)
      } catch (err) {
        console.error("Failed to fetch programs:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  const tags = ["All", ...Array.from(new Set(programs.map(p => p.tag).filter(Boolean)))]

  const filtered = programs.filter(p => {
    const matchSearch = `${p.title} ${p.description} ${p.tag}`.toLowerCase().includes(search.toLowerCase())
    const matchTag = activeTag === "All" || p.tag === activeTag
    return matchSearch && matchTag
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold sm:text-3xl text-primary">All Programs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Loading..." : `${filtered.length} program${filtered.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <BookOpen className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      {/* Tag Filter */}
      {!loading && tags.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold capitalize transition ${
                activeTag === tag
                  ? "border-teal bg-teal text-white shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-teal hover:text-teal"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-card overflow-hidden">
              <div className="h-44 bg-muted" />
              <div className="p-5 space-y-2">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Programs Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.06}>
              <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-lg hover:-translate-y-0.5">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal/20 to-[#4a8a2a]/20">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Heart className="size-12 text-teal/40" />
                    </div>
                  )}
                  {/* Tag badge */}
                  {p.tag && (
                    <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold capitalize ${tagColor(p.tag)}`}>
                      <Tag className="mr-1 inline size-3" />{p.tag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-base font-extrabold text-primary leading-snug">{p.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">{p.description}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Users className="size-3.5" />
                      <span>Open to volunteers</span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2.5 py-1 text-[10px] font-bold text-teal">
                      <Calendar className="size-3" /> Active
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Heart className="mb-3 size-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-muted-foreground">
            {search || activeTag !== "All" ? "No programs match your search." : "No programs available yet."}
          </p>
          {(search || activeTag !== "All") && (
            <button
              onClick={() => { setSearch(""); setActiveTag("All") }}
              className="mt-3 text-xs font-bold text-teal hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
