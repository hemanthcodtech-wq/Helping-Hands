import { useState, useEffect, useRef } from "react"
import { Plus, Trash2, Video, Image as ImageIcon, FileText, Upload, X, Search, Trophy, Newspaper } from "lucide-react"

const CATEGORIES = [
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'press', label: 'Press & Stories', icon: Newspaper },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'certificates', label: 'Certificates', icon: FileText },
  { id: 'registration', label: 'Registration', icon: FileText },
  { id: '12a', label: '12A', icon: FileText },
  { id: '80g', label: '80G', icon: FileText },
  { id: 'ngo-darpan', label: 'NGO Darpan', icon: FileText },
]

export default function AdminResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('photos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState("")

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "photos",
    file_url: ""
  })
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const fetchResources = async () => {
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/resources?category=${activeCategory}`)
      const data = await res.json()
      if (data.success) {
        setResources(data.resources)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [activeCategory])

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/resources/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchResources()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    const formData = new FormData()
    formData.append("title", form.title)
    formData.append("description", form.description)
    formData.append("category", form.category)
    
    // Support either direct file upload or URL paste
    if (file) {
      formData.append("file", file)
    } else if (form.file_url) {
      formData.append("file_url", form.file_url)
    }

    try {
      const res = await fetch("https://helpinghandsbe.vercel.app/api/resources", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setIsModalOpen(false)
        if (form.category === activeCategory) {
          fetchResources()
        } else {
          setActiveCategory(form.category)
        }
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
      alert("Error saving resource")
    } finally {
      setSubmitting(false)
    }
  }

  const openNewModal = () => {
    setForm({ title: "", description: "", category: activeCategory, file_url: "" })
    setFile(null)
    setIsModalOpen(true)
  }

  const filteredResources = resources.filter(r => 
    r.title?.toLowerCase().includes(search.toLowerCase()) || 
    r.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Media & Resources</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Manage photos, videos, reports and certificates.</p>
        </div>
        <button onClick={openNewModal} className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-dark">
          <Plus className="size-4" /> Add Resource
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {CATEGORIES.map(c => {
          const Icon = c.icon
          return (
            <button 
              key={c.id} 
              onClick={() => setActiveCategory(c.id)} 
              className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold transition ${activeCategory === c.id ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground hover:bg-muted'}`}
            >
              <Icon className="size-3.5" />
              {c.label}
            </button>
          )
        })}
      </div>

      <div className="relative mb-6 w-full max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          placeholder={`Search ${activeCategory}...`} 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="w-full rounded-xl border border-border bg-card py-2 pl-10 pr-4 text-xs shadow-sm focus:border-teal focus:outline-none" 
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading...</div>
      ) : filteredResources.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="text-sm text-muted-foreground">No resources found for this category.</p>
        </div>
      ) : activeCategory === 'photos' || activeCategory === 'achievements' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredResources.map((r) => (
            <div key={r.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
              <img src={r.file_url} alt={r.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/60 opacity-0 transition group-hover:opacity-100 flex flex-col justify-end p-4">
                <p className="text-xs font-bold text-white truncate">{r.title}</p>
                <button onClick={() => handleDelete(r.id)} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((r) => (
            <div key={r.id} className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div>
                <h3 className="font-bold text-primary">{r.title}</h3>
                {r.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{r.description}</p>}
                
                {activeCategory === 'videos' && (
                  <div className="mt-4 aspect-video overflow-hidden rounded-xl border border-border bg-black">
                    {r.file_url.includes('youtube') || r.file_url.includes('vimeo') ? (
                       <iframe src={r.file_url} className="w-full h-full" allowFullScreen></iframe>
                    ) : (
                      <video src={r.file_url} controls className="w-full h-full object-cover"></video>
                    )}
                  </div>
                )}
                
                {activeCategory !== 'videos' && (
                  <a href={r.file_url} target="_blank" rel="noreferrer" className="mt-4 block text-xs font-bold text-teal hover:underline">
                    View Link / Download
                  </a>
                )}
              </div>
              
              <button onClick={() => handleDelete(r.id)} className="absolute right-4 top-4 text-muted-foreground hover:text-red-500 transition">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl sm:p-8">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-muted-foreground hover:text-primary">
              <X className="size-5" />
            </button>
            <h3 className="font-heading text-xl font-bold text-primary">Add Resource</h3>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-primary">Category *</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-primary">Title *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-bold text-primary">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
              </div>

              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
                <label className="mb-2 block text-xs font-bold text-primary">Media / File</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files[0])} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-background border border-border py-2 text-xs font-bold transition hover:bg-muted">
                      <Upload className="size-4" /> {file ? file.name : 'Upload File'}
                    </button>
                    <span className="text-xs text-muted-foreground">OR</span>
                  </div>
                  <input type="url" placeholder="Paste external link (YouTube, PDF, Image URL)" value={form.file_url} onChange={e => setForm({...form, file_url: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs focus:border-teal focus:outline-none" disabled={!!file} />
                </div>
              </div>

              <button type="submit" disabled={submitting || (!file && !form.file_url)} className="mt-4 w-full rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal-dark disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Resource'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
