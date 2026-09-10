import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Scale, Users, Download } from "lucide-react"

const DATA = {
  leadership: { title: "Leadership", description: "Meet the leadership structure guiding our mission, programs and community initiatives.", icon: Users },
  "legal-terms": { title: "Legal & Terms", description: "Organizational policies, terms and governance information for transparent engagement.", icon: Scale },
}

export default function AboutSubpage() {
  const { type } = useParams(); 
  const data = DATA[type] || DATA.leadership; 
  const Icon = data.icon;

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:5000/api/resources?category=${type}`)
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

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link to="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-teal"><ArrowLeft className="size-4" /> Back to About Us</Link>
          <div className="mt-7 flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary text-white"><Icon className="size-7" /></div>
            <div>
              <h1 className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">{data.title}</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">{data.description}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <p className="text-center text-muted-foreground py-10">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No items available at the moment.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item, i) => (
                <article key={item.id} className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
                  <span className="text-xs font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-4 font-heading text-lg font-bold text-primary">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground flex-1">{item.description || "No description provided."}</p>
                  {item.file_url && (
                    <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition">
                      <Download className="size-3.5" /> View / Download
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
