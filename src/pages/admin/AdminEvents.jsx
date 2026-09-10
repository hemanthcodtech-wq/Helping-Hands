import { useState, useEffect } from "react"
import { Plus, Trash2, CalendarDays, Newspaper, X } from "lucide-react"

export default function AdminEvents() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [form, setForm] = useState({
    type: "event",
    title: "",
    event_date: "",
    location: "",
    content: "",
    image: null
  })

  const fetchItems = async () => {
    try {
      const res = await fetch("https://helpinghandsbe.vercel.app/api/events")
      const data = await res.json()
      if (data.success) {
        setItems(data.events)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/events/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchItems()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    const formData = new FormData()
    formData.append("type", form.type)
    formData.append("title", form.title)
    formData.append("event_date", form.event_date)
    formData.append("content", form.content)
    if (form.location) formData.append("location", form.location)
    if (form.image) formData.append("image", form.image)
    
    try {
      const res = await fetch("https://helpinghandsbe.vercel.app/api/events", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setIsModalOpen(false)
        fetchItems()
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error(error)
      alert("Failed to save.")
    } finally {
      setSubmitting(false)
    }
  }

  const openModal = () => {
    setForm({ type: "event", title: "", event_date: "", location: "", content: "", image: null })
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Events & News</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Manage upcoming events and news updates.</p>
        </div>
        <button onClick={openModal} className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-dark">
          <Plus className="size-4" /> Create New
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {['event', 'news'].map((type) => (
          <div key={type} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-primary capitalize">
              {type === 'event' ? <CalendarDays className="size-5 text-teal" /> : <Newspaper className="size-5 text-accent" />}
              {type === 'event' ? 'Upcoming Events' : 'News & Updates'}
            </h3>
            
            <div className="space-y-4">
              {items.filter(i => i.type === type).length === 0 ? (
                <p className="text-sm text-muted-foreground">No items found.</p>
              ) : (
                items.filter(i => i.type === type).map(item => (
                  <div key={item.id} className="relative rounded-xl border border-border p-4 transition hover:bg-muted/30">
                    <button onClick={() => handleDelete(item.id)} className="absolute right-3 top-3 text-muted-foreground hover:text-red-500">
                      <Trash2 className="size-4" />
                    </button>
                    {item.image_url && <img src={item.image_url} alt="" className="mb-3 h-24 w-full rounded-lg object-cover" />}
                    <p className="text-xs font-bold text-teal">{item.event_date}</p>
                    <h4 className="mt-1 font-bold text-primary">{item.title}</h4>
                    {item.location && <p className="mt-1 text-xs text-muted-foreground">Location: {item.location}</p>}
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl sm:p-8">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-muted-foreground hover:text-primary">
              <X className="size-5" />
            </button>
            <h3 className="font-heading text-xl font-bold text-primary">Create Entry</h3>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-primary">Type *</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none">
                  <option value="event">Event</option>
                  <option value="news">News</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-primary">Title *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-primary">Date (Text format) *</label>
                <input required placeholder="e.g. 15 Sep 2026" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
              </div>

              {form.type === 'event' && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-primary">Location *</label>
                  <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-primary">Content / Description *</label>
                <textarea required rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
              </div>

              {form.type === 'news' && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-primary">Cover Image</label>
                  <input type="file" accept="image/*" onChange={e => setForm({...form, image: e.target.files[0]})} className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-teal file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-teal-dark" />
                </div>
              )}

              <button type="submit" disabled={submitting} className="mt-4 w-full rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal-dark disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
