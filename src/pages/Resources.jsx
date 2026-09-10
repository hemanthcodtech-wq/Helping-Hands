import { Link } from "react-router-dom"
import { ArrowRight, Image as ImageIcon, Video, Trophy, Newspaper, FolderOpen } from "lucide-react"

const RESOURCE_GROUPS = [
  { 
    title: "Photos", 
    path: "/resources/photos", 
    icon: ImageIcon, 
    accent: "#04458F", 
    description: "A visual collection of our community activities, programs and outreach initiatives." 
  },
  { 
    title: "Videos", 
    path: "/resources/videos", 
    icon: Video, 
    accent: "#E11D48", 
    description: "Watch stories, highlights and testimonials from our programs and community initiatives." 
  },
  { 
    title: "Achievements & Awards", 
    path: "/resources/achievements-awards", 
    icon: Trophy, 
    accent: "#EF9A0A", 
    description: "Milestones, recognitions and achievements from our journey in social service." 
  },
  { 
    title: "Press & Stories", 
    path: "/resources/press-stories", 
    icon: Newspaper, 
    accent: "#196823", 
    description: "Read news coverage, stories and public highlights about our ongoing work." 
  },
]

export default function Resources() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-teal shadow-sm">Media Center</span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">Resources & Media</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Explore our visual journey, watch impactful stories, and read about our achievements in the community.</p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RESOURCE_GROUPS.map(({ title, path, icon: Icon, accent, description }) => (
              <Link key={path} to={path} className="group overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col">
                <div className="grid size-14 place-items-center rounded-2xl text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                  <Icon className="size-7" />
                </div>
                <h2 className="mt-6 font-heading text-xl font-bold text-primary">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground flex-1">{description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal transition group-hover:gap-3">View Collection <ArrowRight className="size-4" /></span>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-primary px-6 py-10 sm:px-12 sm:py-14 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
            <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-accent/20 blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white mb-4">
                <FolderOpen className="size-3.5" /> Official Documents
              </div>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Looking for Official Reports?</h2>
              <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed">Access our Annual Reports, Audit Statements, 12A, 80G and other statutory organizational certificates in our document center.</p>
            </div>
            
            <Link to="/about/reports" className="relative z-10 whitespace-nowrap rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary transition hover:bg-gray-100 shadow-xl flex items-center gap-2">
              View Documents <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
