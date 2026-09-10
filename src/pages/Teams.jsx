import { Link } from "react-router-dom"
import { ArrowRight, Users, HeartHandshake, Award, UserRound } from "lucide-react"

const TEAM_GROUPS = [
  { title: "Management Team", path: "/teams/management", icon: Users, accent: "#04458F", description: "Meet the people guiding our mission, programs and long-term direction." },
  { title: "General Members", path: "/teams/members", icon: UserRound, accent: "#196823", description: "Our wider member community helping turn plans into meaningful action." },
  { title: "Valued Donors", path: "/teams/donors", icon: Award, accent: "#EF9A0A", description: "People and supporters whose generosity helps communities move forward." },
  { title: "Volunteers", path: "/teams/volunteers", icon: HeartHandshake, accent: "#5E922C", description: "The hands, time and energy behind our work on the ground." },
]

export default function Teams() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-teal shadow-sm">Our People</span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">Meet Our Team</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">A community of leaders, members, donors and volunteers working together to create lasting impact.</p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_GROUPS.map(({ title, path, icon: Icon, accent, description }) => (
              <Link key={path} to={path} className="group overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="grid size-14 place-items-center rounded-2xl text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                  <Icon className="size-7" />
                </div>
                <h2 className="mt-6 font-heading text-xl font-bold text-primary">{title}</h2>
                <p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal transition group-hover:gap-3">Explore <ArrowRight className="size-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
