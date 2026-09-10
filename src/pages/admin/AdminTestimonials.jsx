import { useState, useEffect, useRef } from "react"
import { Pencil, Trash2, Plus, X, Upload, Star } from "lucide-react"

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form, setForm] = useState({
    id: null,
    name: "",
    role: "",
    quote: "",
    rating: 5,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/testimonials")
      const data = await res.json()
      if (data.success) {
        setTestimonials(data.testimonials)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
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
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return
    try {
      await fetch(`http://localhost:5000/api/testimonials/${id}`, { method: "DELETE" })
      fetchTestimonials()
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
      formData.append("role", form.role)
      formData.append("quote", form.quote)
      formData.append("rating", form.rating)
      
      if (imageFile) {
        formData.append("image", imageFile)
      }

      await fetch("http://localhost:5000/api/testimonials", {
        method: "POST",
        body: formData,
      })
      
      setIsModalOpen(false)
      fetchTestimonials()
      resetForm()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm({ id: null, name: "", role: "", quote: "", rating: 5 })
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Testimonials</h1>
          <p className="mt-2 text-text-light">Manage community feedback and donor testimonials.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2 font-bold text-white transition hover:bg-[#065f69]"
        >
          <Plus className="size-5" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-border border-t-teal"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`size-4 ${i < testimonial.rating ? "fill-[#EF9A0A] text-[#EF9A0A]" : "fill-gray-200 text-gray-200"}`} />
                ))}
              </div>
              <p className="mb-6 text-sm italic leading-relaxed text-text">"{testimonial.quote}"</p>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 overflow-hidden rounded-full bg-gray-100">
                    {testimonial.image_url ? (
                      <img src={testimonial.image_url} alt={testimonial.name} className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-lg font-bold text-gray-400">{testimonial.name.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">{testimonial.name}</h3>
                    <p className="text-xs text-text-light">{testimonial.role}</p>
                  </div>
                </div>
                
                <button onClick={() => handleDelete(testimonial.id)} className="rounded-lg p-2 text-text-light transition hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Add Testimonial</h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="rounded-full p-2 text-text-light transition hover:bg-background">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex gap-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex size-24 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-background transition hover:border-teal"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="size-full object-cover" />
                  ) : (
                    <Upload className="size-6 text-text-light group-hover:text-teal" />
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>

                <div className="flex flex-1 flex-col justify-center gap-4">
                  <div>
                    <input required type="text" placeholder="Person's Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                  </div>
                  <div>
                    <input required type="text" placeholder="Role (e.g., Volunteer, Donor)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-primary">Quote / Feedback</label>
                <textarea required rows="4" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-teal focus:outline-none"></textarea>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-primary">Rating (1-5)</label>
                <input required type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-teal focus:outline-none" />
              </div>

              <button type="submit" disabled={submitting || !form.name || !form.quote} className="mt-4 w-full rounded-xl bg-teal py-3 font-bold text-white transition hover:bg-[#065f69] disabled:opacity-50">
                {submitting ? "Saving..." : "Save Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
