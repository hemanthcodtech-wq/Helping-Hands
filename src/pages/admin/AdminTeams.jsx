import { useState, useEffect, useRef } from "react"
import { Pencil, Trash2, Plus, X, Upload, Eye, EyeOff } from "lucide-react"

const GROUPS = [
  { id: 'management', label: 'Management Team' },
  { id: 'members', label: 'General Members' },
  { id: 'donors', label: 'Valued Donors' },
  { id: 'volunteers', label: 'Volunteers' }
]

export default function AdminTeams() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState('all')

  const [form, setForm] = useState({
    id: null,
    name: "",
    role: "",
    group_name: "management",
    email: "",
    is_visible: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const fetchMembers = async () => {
    try {
      const res = await fetch("https://helpinghandsbe.vercel.app/api/teams")
      const data = await res.json()
      if (data.success) {
        setMembers(data.members)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
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

  const handleEdit = (member) => {
    setForm({
      id: member.id,
      name: member.name,
      role: member.role,
      group_name: member.group_name,
      email: member.email || "",
      is_visible: member.is_visible
    })
    setImagePreview(member.image_url || "")
    setImageFile(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team member?")) return
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/teams/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchMembers()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleVisibility = async (member) => {
    try {
      const formData = new FormData()
      formData.append("name", member.name)
      formData.append("role", member.role)
      formData.append("group_name", member.group_name)
      formData.append("email", member.email || "")
      formData.append("is_visible", !member.is_visible)
      
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/teams/${member.id}`, {
        method: "PUT",
        body: formData
      })
      if ((await res.json()).success) {
        fetchMembers()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("role", form.role)
    formData.append("group_name", form.group_name)
    formData.append("email", form.email)
    formData.append("is_visible", form.is_visible)
    if (imageFile) formData.append("image", imageFile)

    const url = form.id ? `https://helpinghandsbe.vercel.app/api/teams/${form.id}` : "https://helpinghandsbe.vercel.app/api/teams"
    const method = form.id ? "PUT" : "POST"

    try {
      const res = await fetch(url, { method, body: formData })
      const data = await res.json()
      if (data.success) {
        setIsModalOpen(false)
        fetchMembers()
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
      alert("Error saving member")
    } finally {
      setSubmitting(false)
    }
  }

  const openNewModal = () => {
    setForm({ id: null, name: "", role: "", group_name: "management", email: "", is_visible: true })
    setImagePreview("")
    setImageFile(null)
    setIsModalOpen(true)
  }

  const filteredMembers = activeGroup === 'all' ? members : members.filter(m => m.group_name === activeGroup)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Team Management</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Manage members across Management, Donors, Volunteers.</p>
        </div>
        <button onClick={openNewModal} className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-dark">
          <Plus className="size-4" /> Add Member
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveGroup('all')} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${activeGroup === 'all' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-border'}`}>All</button>
        {GROUPS.map(g => (
          <button key={g.id} onClick={() => setActiveGroup(g.id)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${activeGroup === g.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-border'}`}>{g.label}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Group</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">Loading...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">No members found.</td></tr>
              ) : filteredMembers.map(m => (
                <tr key={m.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={m.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}`} alt={m.name} className="size-10 rounded-full object-cover shadow-sm" />
                      <div>
                        <p className="text-xs font-bold text-primary sm:text-sm">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground">{m.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md bg-indigo-50 px-2 py-1 text-[9px] font-bold text-indigo-600 sm:text-[10px]">
                      {GROUPS.find(g => g.id === m.group_name)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleVisibility(m)} className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold transition ${m.is_visible ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                      {m.is_visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {m.is_visible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => handleEdit(m)} className="grid size-7 place-items-center rounded-lg bg-muted text-muted-foreground transition hover:bg-teal hover:text-white">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="grid size-7 place-items-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl sm:p-8">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-muted-foreground hover:text-primary">
              <X className="size-5" />
            </button>
            <h3 className="font-heading text-xl font-bold text-primary">{form.id ? 'Edit' : 'Add'} Team Member</h3>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div onClick={() => fileInputRef.current?.click()} className="group relative grid size-20 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition hover:border-teal">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="size-full object-cover transition group-hover:opacity-50" />
                  ) : (
                    <Upload className="size-5 text-muted-foreground transition group-hover:text-teal" />
                  )}
                  {imagePreview && <Upload className="absolute size-5 text-white opacity-0 transition group-hover:opacity-100" />}
                </div>
                <div className="text-xs text-muted-foreground">Upload a profile photo.<br />Square aspect ratio recommended.</div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 text-xs font-bold text-primary">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:border-teal focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 text-xs font-bold text-primary">Role / Title *</label>
                  <input required value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:border-teal focus:outline-none" placeholder="e.g. Program Director" />
                </div>
                <div>
                  <label className="mb-1 text-xs font-bold text-primary">Team Group *</label>
                  <select value={form.group_name} onChange={e => setForm({...form, group_name: e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:border-teal focus:outline-none">
                    {GROUPS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="mt-4 w-full rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal-dark disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
