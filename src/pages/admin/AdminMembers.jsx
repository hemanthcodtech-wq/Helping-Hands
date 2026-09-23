import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Edit, FileText, Plus, Search, Trash2, ShieldCheck, UserRound, X } from "lucide-react"

export default function AdminMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [profileFile, setProfileFile] = useState(null)
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "",
    membership_tier: "Gram Panchayat Membership",
    aadhaar: "", address: "", state: "", district: "", pincode: "", blood_group: ""
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch("https://helpinghandsbe.vercel.app/api/members")
      const data = await res.json()
      if (data.success) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/members/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      })
      if (res.ok) fetchMembers()
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/members/${id}`, { method: "DELETE" })
      if (res.ok) fetchMembers()
    } catch (error) {
      console.error("Error deleting member:", error)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => data.append(key, formData[key]))
      if (profileFile) data.append("profile_picture", profileFile)

      const res = await fetch("https://helpinghandsbe.vercel.app/api/members/register", {
        method: "POST",
        body: data,
      })
      if (res.ok) {
        setIsModalOpen(false)
        setFormData({ name: "", email: "", phone: "", password: "", membership_tier: "Gram Panchayat Membership", aadhaar: "", address: "", state: "", district: "", pincode: "", blood_group: "" })
        setProfileFile(null)
        fetchMembers()
      } else {
        alert("Failed to add member. Email might already exist.")
      }
    } catch (error) {
      console.error("Error adding member:", error)
    }
  }

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery)
  )

  const inputClass = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-primary outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/10"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Member Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your foundation's members and donors.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-dark">
          <Plus className="size-4" /> Add Member
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search members by name, email or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/10" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                <th className="whitespace-nowrap px-6 py-4 font-bold">Member Info</th>
                <th className="whitespace-nowrap px-6 py-4 font-bold">Contact</th>
                <th className="whitespace-nowrap px-6 py-4 font-bold">Tier</th>
                <th className="whitespace-nowrap px-6 py-4 font-bold">Status</th>
                <th className="whitespace-nowrap px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">Loading members...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">No members found.</td></tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="transition hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary">{member.name}</div>
                      <div className="text-xs text-muted-foreground">Joined: {new Date(member.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-primary">{member.email}</div>
                      <div className="text-xs text-muted-foreground">{member.phone}</div>
                    </td>
                    <td className="px-6 py-4"><span className="inline-flex rounded-full bg-teal/10 px-2.5 py-1 text-[10px] font-bold text-teal">{member.membership_tier || 'N/A'}</span></td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleStatusToggle(member.id, member.is_active)} className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold transition ${member.is_active ? "bg-[#eef7e9] text-[#196823] hover:bg-red-100 hover:text-red-600" : "bg-red-50 text-red-600 hover:bg-[#eef7e9] hover:text-[#196823]"}`}>
                        {member.is_active ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDelete(member.id)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-500 transition"><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-primary/20 p-4 backdrop-blur-sm overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl rounded-3xl bg-card p-6 shadow-xl sm:p-8 mt-20 mb-20">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-extrabold text-primary">Add New Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"><X className="size-5" /></button>
            </div>
            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className="mb-1.5 block text-xs font-bold text-primary">Full Name *</span>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="Enter name" />
                </label>
                <label className="block"><span className="mb-1.5 block text-xs font-bold text-primary">Email *</span>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} placeholder="Enter email" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className="mb-1.5 block text-xs font-bold text-primary">Phone *</span>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} placeholder="Enter phone" />
                </label>
                <label className="block"><span className="mb-1.5 block text-xs font-bold text-primary">Password *</span>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className={inputClass} placeholder="Set a password" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className="mb-1.5 block text-xs font-bold text-primary">Membership Tier</span>
                  <select value={formData.membership_tier} onChange={e => setFormData({...formData, membership_tier: e.target.value})} className={inputClass}>
                    <option>Gram Panchayat Membership</option>
                    <option>Mandal Membership</option>
                    <option>District Membership</option>
                    <option>State Membership</option>
                    <option>National Membership</option>
                  </select>
                </label>
                <label className="block"><span className="mb-1.5 block text-xs font-bold text-primary">Aadhaar (Optional)</span>
                  <input type="text" value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} className={inputClass} placeholder="Aadhaar number" />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <label className="block col-span-3"><span className="mb-1.5 block text-xs font-bold text-primary">Address</span>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={inputClass} placeholder="Full address" />
                </label>
                <label className="block"><span className="mb-1.5 block text-xs font-bold text-primary">State</span>
                  <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className={inputClass} placeholder="State" />
                </label>
                <label className="block"><span className="mb-1.5 block text-xs font-bold text-primary">District</span>
                  <input type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className={inputClass} placeholder="District" />
                </label>
                <label className="block"><span className="mb-1.5 block text-xs font-bold text-primary">Pincode</span>
                  <input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className={inputClass} placeholder="Pincode" />
                </label>
                <label className="block col-span-3"><span className="mb-1.5 block text-xs font-bold text-primary">Profile Picture</span>
                  <input type="file" accept="image/*" onChange={e => setProfileFile(e.target.files[0])} className={`${inputClass} !py-2.5`} />
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 py-3 text-sm font-bold text-muted-foreground transition hover:bg-muted">Cancel</button>
                <button type="submit" className="rounded-xl bg-teal px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-dark shadow-md">Add Member</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
