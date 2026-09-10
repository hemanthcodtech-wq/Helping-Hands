import { useState, useEffect, useRef } from "react"
import { Pencil, Trash2, Plus, X, Upload, ExternalLink } from "lucide-react"

export default function AdminPartners() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "partner",
    website_url: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const fetchPartners = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/partners")
      const data = await res.json()
      if (data.success) {
        setPartners(data.partners)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return
    try {
      await fetch(`http://localhost:5000/api/partners/${id}`, { method: "DELETE" })
      fetchPartners()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("type", form.type)
      formData.append("website_url", form.website_url)
      
      if (imageFile) {
        formData.append("image", imageFile)
      }

      await fetch("http://localhost:5000/api/partners", {
        method: "POST",
        body: formData,
      })
      
      setIsModalOpen(false)
      fetchPartners()
      resetForm()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm({ id: null, name: "", type: "partner", website_url: "" })
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Partners & Sponsors</h1>
          <p className="mt-2 text-text-light">Manage organizations that support the foundation.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2 font-bold text-white transition hover:bg-[#065f69]"
        >
          <Plus className="size-5" /> Add Partner
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-border border-t-teal"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div key={partner.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
              <div className="flex h-40 items-center justify-center bg-gray-50 p-6">
                {partner.image_url ? (
                  <img src={partner.image_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-4xl font-bold text-gray-300">{partner.name.charAt(0)}</div>
                )}
              </div>
              
              <div className="p-5 border-t border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-primary">{partner.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${partner.type === 'sponsor' ? 'bg-[#EF9A0A]/10 text-[#EF9A0A]' : 'bg-teal/10 text-teal'}`}>
                        {partner.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  {partner.website_url ? (
                    <a href={partner.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-teal hover:underline">
                      Visit Site <ExternalLink className="size-3" />
                    </a>
                  ) : <span></span>}
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(partner.id)} className="rounded-lg p-2 text-text-light transition hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Add Partner</h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="rounded-full p-2 text-text-light transition hover:bg-background">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-background transition hover:border-teal"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-contain p-2" />
                ) : (
                  <>
                    <Upload className="mb-2 size-6 text-text-light group-hover:text-teal" />
                    <span className="text-sm font-medium text-text-light group-hover:text-teal">Upload Logo</span>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-primary">Partner/Sponsor Name</label>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-teal focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-teal focus:outline-none">
                    <option value="partner">Partner</option>
                    <option value="sponsor">Sponsor</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">Website URL (Optional)</label>
                  <input type="url" placeholder="https://" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-teal focus:outline-none" />
                </div>
              </div>

              <button type="submit" disabled={submitting || !form.name || !imageFile} className="mt-4 w-full rounded-xl bg-teal py-3 font-bold text-white transition hover:bg-[#065f69] disabled:opacity-50">
                {submitting ? "Saving..." : "Save Partner"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
