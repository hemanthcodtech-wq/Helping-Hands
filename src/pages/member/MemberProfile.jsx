import { useState } from "react"
import { useApp } from "../../context/AppContext"
import { CheckCircle, Save, UserCircle } from "lucide-react"

export default function MemberProfile() {
  const { loggedInMember, memberLogin } = useApp()
  const [formData, setFormData] = useState({
    name: loggedInMember.name || "",
    phone: loggedInMember.phone || "",
    address: loggedInMember.address || "",
    state: loggedInMember.state || "",
    district: loggedInMember.district || "",
    pincode: loggedInMember.pincode || "",
    blood_group: loggedInMember.blood_group || "",
    aadhaar: loggedInMember.aadhaar || "",
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage("")

    try {
      // In a real app, you would have a PUT /api/members/:id endpoint
      // For now we will just simulate success and update context
      setTimeout(() => {
        memberLogin({ ...loggedInMember, ...formData })
        setMessage("Profile updated successfully!")
        setIsSaving(false)
        setTimeout(() => setMessage(""), 3000)
      }, 1000)
    } catch (error) {
      console.error(error)
      setIsSaving(false)
    }
  }

  const inputClass = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-primary outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/10"

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">Profile Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your personal information and contact details.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6 sm:p-8 flex items-center gap-6">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-muted bg-primary-soft">
            {loggedInMember.profile_picture_url ? (
              <img src={loggedInMember.profile_picture_url} alt="Profile" className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center text-3xl font-bold text-teal">{loggedInMember.name.charAt(0)}</div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-primary">{loggedInMember.name}</h2>
            <p className="text-sm text-muted-foreground">{loggedInMember.email}</p>
            <span className="mt-2 inline-block rounded-full bg-teal/10 px-2.5 py-1 text-[10px] font-bold text-teal">
              {loggedInMember.membership_tier || "Member"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {message && (
            <div className="flex items-center gap-2 rounded-xl bg-[#eef7e9] p-4 text-sm font-semibold text-[#196823]">
              <CheckCircle className="size-5" /> {message}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Phone Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Blood Group</label>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={inputClass}>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Aadhaar Number</label>
              <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} className={inputClass} placeholder="Optional" />
            </div>
          </div>

          <hr className="border-border" />

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label className="mb-1.5 block text-xs font-bold text-primary">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-dark disabled:opacity-70">
              <Save className="size-4" /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
