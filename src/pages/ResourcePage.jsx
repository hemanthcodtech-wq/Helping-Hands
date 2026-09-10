import { useState, useEffect } from "react"
import { Link, useParams, useLocation } from "react-router-dom"
import { ArrowLeft, FileText, Award, Image, Video, Trophy, Newspaper, Download } from "lucide-react"

const DATA = {
  reports: { title: "Reports", description: "Annual and audit reports documenting our work, impact and financial accountability.", icon: FileText },
  certificates: { title: "Certificates", description: "Registration and statutory certificates for transparent organizational information.", icon: Award },
  registration: { title: "Registration Certificate", description: "Official registration details and organizational registration certificate of Helping Hands Foundation.", icon: Award },
  "12a": { title: "12A Certificate", description: "Statutory 12A registration information supporting the foundation's tax-exempt charitable status.", icon: Award },
  "80g": { title: "80G Certificate", description: "80G certification information for eligible donations made in support of Helping Hands Foundation.", icon: Award },
  "ngo-darpan": { title: "NGO Darpan Registration", description: "NGO Darpan registration information and organizational identification details.", icon: Award },
  photos: { title: "Photos", description: "A visual collection of community activities, programs and outreach initiatives.", icon: Image },
  videos: { title: "Videos", description: "Stories and highlights from our programs and community initiatives.", icon: Video },
  achievements: { title: "Achievements & Awards", description: "Milestones, recognitions and achievements from our journey.", icon: Trophy },
  press: { title: "Press & Stories", description: "News coverage, stories and public highlights about our work.", icon: Newspaper },
}

export default function ResourcePage() {
  const { type } = useParams()
  const location = useLocation()
  
  let resolvedType = type
  if (!resolvedType) {
    const parts = location.pathname.split('/').filter(Boolean)
    resolvedType = parts[parts.length - 1]
  }
  
  const categoryMap = {
    'press-stories': 'press',
    'achievements-awards': 'achievements'
  }
  const dbCategory = categoryMap[resolvedType] || resolvedType || 'reports'
  
  const data = DATA[dbCategory] || DATA.reports
  const Icon = data.icon

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const res = await fetch(`https://helpinghandsbe.vercel.app/api/resources?category=${dbCategory}`)
        const json = await res.json()
        if (json.success) {
          setItems(json.resources)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [type])

  const renderContent = () => {
    if (loading) return <p className="text-center text-muted-foreground py-10">Loading items...</p>
    if (items.length === 0) return <p className="text-center text-muted-foreground py-10">No items available at the moment.</p>

    if (dbCategory === 'photos' || dbCategory === 'achievements') {
      return (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="group relative break-inside-avoid overflow-hidden rounded-2xl bg-card shadow-sm border border-border">
              <img src={item.file_url} alt={item.title} className="w-full h-auto object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 flex flex-col justify-end p-4">
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                {item.description && <p className="mt-1 text-xs text-white/80 line-clamp-2">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (dbCategory === 'videos') {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="aspect-video bg-black w-full">
                {item.file_url.includes('youtube') || item.file_url.includes('vimeo') ? (
                  <iframe src={item.file_url} title={item.title} className="w-full h-full" allowFullScreen></iframe>
                ) : (
                  <video src={item.file_url} controls className="w-full h-full object-cover"></video>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-primary">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <article key={item.id} className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">{String(i + 1).padStart(2, "0")}</span>
              <Icon className="size-5 text-teal" />
            </div>
            <h2 className="mt-5 font-heading text-lg font-bold text-primary">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground flex-1">{item.description || "Official document or media can be viewed here."}</p>
            {item.file_url && (
              <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90">
                <Download className="size-3.5" /> View / Download
              </a>
            )}
          </article>
        ))}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-14 sm:px-6 lg:px-10 lg:py-18">
        <div className="mx-auto max-w-6xl">
          <Link to="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-primary transition"><ArrowLeft className="size-4" /> Back to About Us</Link>
          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="grid size-14 sm:size-16 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-md"><Icon className="size-7 sm:size-8" /></div>
            <div>
              <h1 className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">{data.title}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{data.description}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          {renderContent()}
        </div>
      </section>
    </main>
  )
}
