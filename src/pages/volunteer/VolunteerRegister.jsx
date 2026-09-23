import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle, Mail, ShieldCheck, Upload, User, MapPin,
  Lock, Phone, CreditCard, Briefcase, Droplets, Calendar,
  Eye, EyeOff, Heart
} from "lucide-react"
import { volunteerRoles } from "../../data/content"
import Logo from "../../components/Common/Logo"

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

function FileUploadField({ label, required, accept, onChange, value }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 transition ${value ? "border-teal bg-teal/5" : "border-border bg-muted/30 hover:border-teal/50"}`}>
        <Upload className={`size-4 shrink-0 ${value ? "text-teal" : "text-muted-foreground"}`} />
        <span className={`flex-1 text-xs truncate ${value ? "font-semibold text-teal" : "text-muted-foreground"}`}>
          {value ? value.name : "Choose file…"}
        </span>
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          required={required}
          className="hidden"
        />
      </label>
    </div>
  )
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-5 py-3.5">
        <span className="grid size-7 place-items-center rounded-lg bg-teal/10">
          <Icon className="size-4 text-teal" />
        </span>
        <h3 className="text-sm font-extrabold text-primary">{title}</h3>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  )
}

export default function VolunteerRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "", role: "", gender: "", parent_name: "", dob: "", profession: "",
    blood_group: "", email: "", phone: "", password: "", aadhaar: "",
    state: "", district: "", working_area: "", pincode: "", address: "",
    message: "", otp: "", profile_picture: null, aadhaar_front: null, aadhaar_back: null
  })

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  const setFile = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.files[0] || null }))

  const inputCls = "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10 transition"
  const labelCls = "mb-1.5 block text-xs font-bold text-primary"

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!form.profile_picture || !form.aadhaar_front || !form.aadhaar_back) {
      setError("Please upload all required documents (Profile Picture, Aadhaar Front & Back).")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:5000/api/volunteers/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, name: form.name })
      })
      const data = await res.json()
      if (data.success) {
        setStep(2)
      } else {
        setError(data.message || "Failed to send OTP")
      }
    } catch {
      setError("Network error. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndApply = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const formData = new FormData()
    Object.keys(form).forEach(key => {
      if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
        formData.append(key, form[key])
      }
    })
    try {
      const res = await fetch("http://localhost:5000/api/volunteers/apply", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setStep(3)
      } else {
        setError(data.message || "Failed to submit application")
      }
    } catch {
      setError("Network error. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-muted/50 via-background to-teal/5 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-4xl"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid size-14 place-items-center rounded-2xl border border-teal/20 bg-teal/10 shadow-sm">
            <Logo className="w-10 h-auto" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">Volunteer Registration</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join Helping Hands Foundation and make a difference.</p>
          </div>

          {/* Step indicator */}
          {step !== 3 && (
            <div className="flex items-center gap-2 mt-1">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition ${step >= s ? "bg-teal text-white" : "bg-muted text-muted-foreground"}`}>
                    {step > s ? <CheckCircle className="size-4" /> : s}
                  </div>
                  <span className={`text-xs font-semibold ${step >= s ? "text-primary" : "text-muted-foreground"}`}>
                    {s === 1 ? "Fill Details" : "Verify OTP"}
                  </span>
                  {s < 2 && <div className={`h-px w-8 ${step > s ? "bg-teal" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
            >
              <span className="grid size-20 place-items-center rounded-full bg-teal/10">
                <CheckCircle className="size-10 text-teal" />
              </span>
              <div>
                <h2 className="font-heading text-xl font-extrabold text-primary">Application Submitted!</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Thank you <strong>{form.name}</strong>! Your profile has been sent to our admins for verification.
                  Once your ID documents are approved, you will be notified via email and can login using your password.
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => navigate("/volunteer/login")}
                  className="rounded-xl bg-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-dark transition">
                  Go to Login
                </button>
                <button onClick={() => navigate("/")}
                  className="rounded-xl border border-border px-6 py-2.5 text-sm font-bold text-primary hover:bg-muted transition">
                  Home
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: Form ── */}
          {step === 1 && (
            <motion.form key="form1"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOTP}
              className="space-y-5"
            >
              {/* Personal Information */}
              <SectionCard icon={User} title="Personal Information">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                  <input required value={form.name} onChange={set("name")} placeholder="Enter full name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Gender <span className="text-red-500">*</span></label>
                  <select required value={form.gender} onChange={set("gender")} className={inputCls}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Date of Birth <span className="text-red-500">*</span></label>
                  <input required type="date" value={form.dob} onChange={set("dob")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>S/o D/o W/o (Parent/Spouse)</label>
                  <input value={form.parent_name} onChange={set("parent_name")} placeholder="Parent / spouse name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Profession <span className="text-red-500">*</span></label>
                  <input required value={form.profession} onChange={set("profession")} placeholder="Enter profession" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Blood Group</label>
                  <select value={form.blood_group} onChange={set("blood_group")} className={inputCls}>
                    <option value="">Select group</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
              </SectionCard>

              {/* Account Details */}
              <SectionCard icon={Lock} title="Account Details">
                <div>
                  <label className={labelCls}>Area of Interest <span className="text-red-500">*</span></label>
                  <select required value={form.role} onChange={set("role")} className={inputCls}>
                    <option value="">Select interest</option>
                    {volunteerRoles.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
                  <input required pattern="[0-9]{10}" maxLength={10} value={form.phone} onChange={set("phone")} placeholder="10-digit mobile number" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input required type={showPassword ? "text" : "password"} minLength={6} value={form.password} onChange={set("password")} placeholder="Create a password" className={`${inputCls} pr-10`} />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Aadhaar Number <span className="text-red-500">*</span></label>
                  <input required pattern="[0-9]{12}" maxLength={12} value={form.aadhaar} onChange={set("aadhaar")} placeholder="12-digit Aadhaar number" className={inputCls} />
                </div>
              </SectionCard>

              {/* Address Details */}
              <SectionCard icon={MapPin} title="Address Details">
                <div>
                  <label className={labelCls}>State <span className="text-red-500">*</span></label>
                  <input required value={form.state} onChange={set("state")} placeholder="Enter state" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>District <span className="text-red-500">*</span></label>
                  <input required value={form.district} onChange={set("district")} placeholder="Enter district" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Working Area <span className="text-red-500">*</span></label>
                  <input required value={form.working_area} onChange={set("working_area")} placeholder="Village / Mandal / City" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Pincode <span className="text-red-500">*</span></label>
                  <input required pattern="[0-9]{6}" maxLength={6} value={form.pincode} onChange={set("pincode")} placeholder="6-digit pincode" className={inputCls} />
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className={labelCls}>Full Address <span className="text-red-500">*</span></label>
                  <input required value={form.address} onChange={set("address")} placeholder="House number, street, village/city, district" className={inputCls} />
                </div>
              </SectionCard>

              {/* Document Uploads */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-5 py-3.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-teal/10">
                    <Upload className="size-4 text-teal" />
                  </span>
                  <h3 className="text-sm font-extrabold text-primary">Document Uploads</h3>
                  <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">JPG, PNG or PDF</span>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-3">
                  <FileUploadField
                    label="Profile Picture"
                    required
                    accept="image/*"
                    onChange={setFile("profile_picture")}
                    value={form.profile_picture}
                  />
                  <FileUploadField
                    label="Aadhaar Card — Front"
                    required
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={setFile("aadhaar_front")}
                    value={form.aadhaar_front}
                  />
                  <FileUploadField
                    label="Aadhaar Card — Back"
                    required
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={setFile("aadhaar_back")}
                    value={form.aadhaar_back}
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600 text-center">
                  {error}
                </p>
              )}

              <div className="flex flex-col items-center gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-teal py-3.5 text-sm font-bold text-white shadow-lg shadow-teal/20 transition hover:bg-teal-dark disabled:opacity-60 active:scale-[0.98]">
                  <Mail className="size-4" />
                  {loading ? "Sending OTP..." : "Verify Email with OTP"}
                </button>
                <Link to="/volunteer/login" className="text-xs font-bold text-teal hover:underline">
                  Already registered? Login here
                </Link>
              </div>
            </motion.form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <motion.form key="form2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyAndApply}
              className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm text-center"
            >
              <span className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-teal/10">
                <ShieldCheck className="size-8 text-teal" />
              </span>
              <h3 className="font-heading text-xl font-bold text-primary">Verify Your Email</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter the 6-digit OTP sent to <strong className="text-primary">{form.email}</strong>
              </p>

              <div className="mt-6">
                <input
                  required autoFocus maxLength={6} value={form.otp} onChange={set("otp")}
                  placeholder="• • • • • •"
                  className="w-full rounded-xl border border-border bg-background py-4 text-center font-mono text-2xl tracking-[0.5em] text-primary focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10"
                />
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <button type="submit" disabled={loading || form.otp.length < 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal-dark disabled:opacity-60">
                  {loading ? "Submitting Application..." : "Verify & Complete Registration"}
                </button>
                <button type="button" onClick={() => { setStep(1); setError("") }} disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl border border-border py-3 text-sm font-bold text-primary transition hover:bg-muted disabled:opacity-60">
                  ← Back to Form
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
