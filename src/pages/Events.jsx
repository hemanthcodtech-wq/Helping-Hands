import { useState, useEffect } from "react"
import { CalendarDays, ArrowRight, MapPin, Newspaper } from "lucide-react"
import { Link } from "react-router-dom"

export default function Events() {
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNews, setSelectedNews] = useState(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events")
        const data = await res.json()
        if (data.success) {
          setEvents(data.events.filter(i => i.type === 'event'))
          setNews(data.events.filter(i => i.type === 'news'))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal shadow-sm"><CalendarDays className="size-4" /> Events & News</span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold text-primary sm:text-5xl">Stay Connected With Our Work</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Follow upcoming community events, latest announcements and stories from Helping Hands Foundation.</p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">What's next</p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold text-primary">Upcoming Events</h2>
            </div>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-muted-foreground">No upcoming events scheduled at the moment.</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {events.map(event => (
                <article key={event.id} className="overflow-hidden flex flex-col rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="bg-primary px-6 py-5 text-white">
                    <p className="text-sm font-bold text-white/80">{event.event_date}</p>
                    <h3 className="mt-1 font-heading text-xl font-bold">{event.title}</h3>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-teal"><MapPin className="size-4" />{event.location}</div>
                    )}
                    <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">{event.content}</p>
                    <button type="button" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">Event details <ArrowRight className="size-4" /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary-soft px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end gap-3">
            <Newspaper className="size-7 text-accent" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Latest</p>
              <h2 className="mt-1 font-heading text-3xl font-extrabold text-primary">News & Updates</h2>
            </div>
          </div>
          {loading ? (
            <p className="mt-8 text-muted-foreground">Loading news...</p>
          ) : news.length === 0 ? (
            <p className="mt-8 text-muted-foreground">No news updates available at the moment.</p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {news.map(item => (
                  <article key={item.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm flex flex-col group cursor-pointer" onClick={() => setSelectedNews(item)}>
                    {item.image_url && (
                      <div className="h-48 w-full overflow-hidden">
                        <img src={item.image_url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <time className="text-xs font-bold text-accent">{item.event_date}</time>
                      <h3 className="mt-3 font-heading text-xl font-bold text-primary group-hover:text-teal transition">{item.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground line-clamp-3">{item.content}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal">Read story <ArrowRight className="size-4" /></span>
                    </div>
                  </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNews(null)} />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-card shadow-2xl">
            {selectedNews.image_url && (
              <img src={selectedNews.image_url} alt="" className="h-64 w-full object-cover sm:h-80" />
            )}
            <div className="p-6 sm:p-10">
              <button onClick={() => setSelectedNews(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition">
                <span className="sr-only">Close</span>
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                <Newspaper className="size-3.5" /> News Update
              </div>
              <time className="ml-3 text-xs font-bold text-muted-foreground">{selectedNews.event_date}</time>
              
              <h2 className="mt-4 font-heading text-2xl font-extrabold text-primary sm:text-3xl">{selectedNews.title}</h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {selectedNews.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
