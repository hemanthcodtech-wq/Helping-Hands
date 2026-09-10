import { useState, useEffect } from "react"
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  
  // Form State
  const [form, setForm] = useState({ title: "", description: "", tag: "", image_url: "" })
  const [imageFile, setImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const fetchPrograms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/programs")
      const data = await res.json()
      if (data.success) {
        setPrograms(data.programs)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  const handleEdit = (p) => {
    setEditingId(p.id)
    setForm({ title: p.title, description: p.description, tag: p.tag, image_url: p.image_url })
    setImageFile(null)
    setError("")
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ title: "", description: "", tag: "", image_url: "" })
    setImageFile(null)
    setError("")
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return
    try {
      const res = await fetch(`http://localhost:5000/api/programs/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchPrograms()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("title", form.title)
      formData.append("description", form.description)
      formData.append("tag", form.tag)
      if (form.image_url) formData.append("image_url", form.image_url)
      if (imageFile) formData.append("image", imageFile)

      const url = editingId ? `http://localhost:5000/api/programs/${editingId}` : `http://localhost:5000/api/programs`
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        handleCancel()
        fetchPrograms()
      } else {
        setError(data.message || "Failed to save program")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-[10px] text-primary focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm"
  const labelCls = "mb-1 block text-[8px] font-semibold text-muted-foreground sm:text-xs"

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Programs</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">{loading ? "Loading..." : `${programs.length} programs`}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Form Panel */}
        <FadeIn className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
              <h3 className="text-[11px] font-bold text-primary sm:text-sm">
                {editingId ? "Edit Program" : "Add New Program"}
              </h3>
              {editingId && (
                <button onClick={handleCancel} className="text-muted-foreground hover:text-primary">
                  <X className="size-4" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
              <div>
                <label className={labelCls}>Title *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputCls} placeholder="e.g. Free Health Camp" />
              </div>
              
              <div>
                <label className={labelCls}>Tag *</label>
                <input required value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} className={inputCls} placeholder="e.g. Healthcare" />
              </div>

              <div>
                <label className={labelCls}>Description *</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`${inputCls} resize-none`} placeholder="Short description of the program" />
              </div>

              <div>
                <label className={labelCls}>Image</label>
                {!imageFile && form.image_url && (
                  <div className="mb-2 relative inline-block">
                    <img src={form.image_url} alt="Current" className="h-16 w-16 object-cover rounded-lg border border-border" />
                  </div>
                )}
                <div className="relative overflow-hidden rounded-xl border border-border bg-background transition-colors hover:bg-muted sm:rounded-2xl">
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="absolute inset-0 cursor-pointer opacity-0" />
                  <div className="flex items-center justify-center gap-2 py-2.5 text-center text-[9px] font-semibold text-muted-foreground sm:text-xs">
                    <Upload className="size-3.5" />
                    <span>{imageFile ? imageFile.name : "Choose an image..."}</span>
                  </div>
                </div>
              </div>

              {error && <p className="text-[10px] font-medium text-red-500">{error}</p>}

              <button type="submit" disabled={isSubmitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-2 text-[10px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-70 sm:rounded-2xl sm:text-sm sm:py-2.5">
                {isSubmitting ? "Saving..." : editingId ? "Update Program" : "Create Program"}
              </button>
            </form>
          </div>
        </FadeIn>

        {/* List Panel */}
        <FadeIn className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">Program</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">Description</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan={3} className="p-6 text-center text-sm text-muted-foreground">Loading...</td></tr>
                  ) : programs.length === 0 ? (
                    <tr><td colSpan={3} className="p-6 text-center text-sm text-muted-foreground">No programs found.</td></tr>
                  ) : programs.map((p) => (
                    <tr key={p.id} className="transition hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="size-10 rounded-lg object-cover sm:size-12" />
                          ) : (
                            <div className="grid size-10 place-items-center rounded-lg bg-teal/10 text-teal sm:size-12">No Img</div>
                          )}
                          <div>
                            <p className="text-[10px] font-bold text-primary sm:text-sm">{p.title}</p>
                            <span className="mt-0.5 inline-block rounded-md bg-teal/10 px-1.5 py-0.5 text-[8px] font-semibold text-teal sm:text-[10px]">{p.tag}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p className="text-[9px] leading-relaxed text-muted-foreground sm:text-xs line-clamp-3">{p.description}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleEdit(p)} className="grid size-7 place-items-center rounded-lg bg-muted text-muted-foreground transition hover:bg-teal hover:text-white">
                            <Pencil className="size-3.5" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="grid size-7 place-items-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
