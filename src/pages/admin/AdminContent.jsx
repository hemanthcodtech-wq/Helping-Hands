import { useState, useEffect } from "react"
import { Trash2, Upload, FileText, Award, Scale, Users } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

const CATEGORIES = [
  { id: "reports", label: "Reports", icon: FileText },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "legal-terms", label: "Legal & Terms", icon: Scale },
  { id: "leadership", label: "Leadership", icon: Users }
]

const SUB_CATEGORIES = {
  certificates: [
    { id: "registration", label: "Registration" },
    { id: "12a", label: "12A" },
    { id: "80g", label: "80G" },
    { id: "ngo-darpan", label: "NGO Darpan" }
  ]
}

export default function AdminContent() {
  const [activeCategory, setActiveCategory] = useState("reports")
  const [activeSubCategory, setActiveSubCategory] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [form, setForm] = useState({ title: "", description: "" })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const fetchItems = async (categoryToFetch) => {
    setLoading(true)
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/resources?category=${categoryToFetch}`)
      const data = await res.json()
      if (data.success) {
        setItems(data.resources)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeCategory === "certificates" && !activeSubCategory) {
      setActiveSubCategory(SUB_CATEGORIES.certificates[0].id)
      return
    }
    
    if (activeCategory !== "certificates") {
      setActiveSubCategory(null)
    }

    const categoryToFetch = activeCategory === "certificates" ? activeSubCategory : activeCategory
    if (categoryToFetch) {
      fetchItems(categoryToFetch)
    }
  }, [activeCategory, activeSubCategory])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!form.title) return setError("Title is required")
    
    setUploading(true)
    setError("")

    const formData = new FormData()
    const categoryToSave = activeCategory === "certificates" ? activeSubCategory : activeCategory
    formData.append("category", categoryToSave)
    formData.append("title", form.title)
    formData.append("description", form.description)
    if (file) formData.append("file", file)

    try {
      const res = await fetch("https://helpinghandsbe.vercel.app/api/resources", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setForm({ title: "", description: "" })
        setFile(null)
        fetchItems(categoryToSave)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Failed to upload resource")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/resources/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        const categoryToFetch = activeCategory === "certificates" ? activeSubCategory : activeCategory
        fetchItems(categoryToFetch)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Content Management</h2>
        <p className="mt-1 text-[9px] text-muted-foreground sm:text-sm">Manage dynamic content for About Us, Reports, Certificates and Legal Terms.</p>
      </div>

      <div className="flex flex-col gap-3 border-b border-border pb-4">
        <div className="flex gap-2">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeCategory === id ? "bg-teal text-white shadow-sm" : "bg-card text-primary hover:bg-muted"}`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>
        
        {activeCategory === "certificates" && (
          <div className="flex gap-2">
            {SUB_CATEGORIES.certificates.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveSubCategory(id)}
                className={`rounded-xl border px-3 py-1.5 text-[10px] font-bold transition ${activeSubCategory === id ? "border-teal bg-primary-soft text-teal" : "border-border bg-card text-primary hover:bg-muted"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] items-start">
        {/* List Items */}
        <FadeIn className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
          <h3 className="mb-4 font-heading text-lg font-extrabold text-primary capitalize">
            {activeCategory === "certificates" && activeSubCategory 
              ? SUB_CATEGORIES.certificates.find(c => c.id === activeSubCategory)?.label 
              : CATEGORIES.find(c => c.id === activeCategory)?.label} Items
          </h3>
          
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading items...</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
              <FileText className="mb-2 size-8 text-border" />
              <p className="text-sm">No items found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 transition hover:border-teal/30">
                  <div className="min-w-0">
                    <h4 className="truncate font-bold text-primary">{item.title}</h4>
                    {item.description && <p className="mt-1 truncate text-xs text-muted-foreground">{item.description}</p>}
                    {item.file_url && (
                      <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10px] font-semibold text-teal hover:underline">
                        View Attached File
                      </a>
                    )}
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="grid size-9 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </FadeIn>

        {/* Add Form */}
        <FadeIn className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm sticky top-24">
          <h3 className="mb-4 font-heading text-lg font-extrabold text-primary">Add New Item</h3>
          
          <form onSubmit={handleUpload} className="space-y-4">
            {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}
            
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-primary">Title <span className="text-orange-500">*</span></span>
              <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-primary focus:border-teal focus:outline-none" placeholder="e.g. Annual Report 2026" required />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-primary">Description (Optional)</span>
              <textarea rows={3} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-primary focus:border-teal focus:outline-none" placeholder="Short description..." />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-primary">Upload File (Optional)</span>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background py-5 text-center transition hover:border-teal hover:bg-primary-soft">
                <Upload className="mb-2 size-5 text-teal" />
                <span className="text-xs font-bold text-primary">Choose File</span>
                <span className="mt-1 max-w-[200px] truncate text-[10px] text-muted-foreground">{file ? file.name : "PDF, JPG, PNG"}</span>
                <input type="file" className="sr-only" onChange={e => setFile(e.target.files[0])} accept="image/*,.pdf,.mp4,.mov,.avi" />
              </label>
            </label>

            <button type="submit" disabled={uploading} className="mt-2 w-full rounded-xl bg-teal py-3.5 text-sm font-bold text-white transition hover:bg-teal-dark disabled:opacity-50">
              {uploading ? "Uploading..." : "Save Item"}
            </button>
          </form>
        </FadeIn>
      </div>
    </div>
  )
}
