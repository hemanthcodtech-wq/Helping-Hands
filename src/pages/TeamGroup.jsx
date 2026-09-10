import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Mail, UserRound } from "lucide-react"

const GROUPS = {
  management: { title: "Management Team", intro: "The leadership team guiding Helping Hands Foundation.", accent: "#04458F" },
  members: { title: "General Members", intro: "Members contributing their skills, ideas and community connections.", accent: "#196823" },
  donors: { title: "Valued Donors", intro: "Supporters who make our programs and community initiatives possible.", accent: "#EF9A0A" },
  volunteers: { title: "Volunteers", intro: "People giving their time and energy to serve communities.", accent: "#5E922C" },
}

export default function TeamGroup() {
  const { group } = useParams()
  const data = GROUPS[group] || GROUPS.members
  
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`https://helpinghandsbe.vercel.app/api/teams/${group}`)
        const json = await res.json()
        if (json.success) {
          setMembers(json.members)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [group])

  return (
    <main className="min-h-screen bg-background">
      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-18" style={{ background: `linear-gradient(135deg, ${data.accent}12, transparent)` }}>
        <div className="mx-auto max-w-6xl">
          <Link to="/teams" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-primary"><ArrowLeft className="size-4" /> Back to Teams</Link>
          <h1 className="mt-7 font-heading text-4xl font-extrabold text-primary sm:text-5xl">{data.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{data.intro}</p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Loading members...</div>
          ) : members.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">We are updating our member directory. Check back soon!</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((m) => (
                <article key={m.id} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="aspect-[4/3] grid place-items-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${data.accent}22, ${data.accent}08)` }}>
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="grid size-24 place-items-center rounded-full bg-white shadow-md transition duration-500 group-hover:scale-110" style={{ color: data.accent }}>
                        <UserRound className="size-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: data.accent }}>{m.role}</p>
                    <h2 className="mt-2 font-heading text-lg font-bold text-primary">{m.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Helping Hands Foundation</p>
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark">
                        <Mail className="size-4" /> Contact
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
