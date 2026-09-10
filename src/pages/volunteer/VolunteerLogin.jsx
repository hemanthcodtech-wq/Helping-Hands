import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import { useApp } from "../../context/AppContext"
import { volunteerRoles } from "../../data/content"
import Logo from "../../components/Common/Logo"

export default function VolunteerLogin() {
  const { volunteerLogin, addVolunteer } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState("signin") // "signin" | "apply"

  // Sign in state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  // Apply state
  const [applyForm, setApplyForm] = useState({ name: "", email: "", phone: "", city: "", role: "", message: "" })
  const [applied, setApplied] = useState(false)

  const setLogin = (k) => (e) => setLoginForm((p) => ({ ...p, [k]: e.target.value }))
  const setApply = (k) => (e) => setApplyForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)
    const result = await volunteerLogin(loginForm.email, loginForm.password)
    if (result.success) {
      navigate("/volunteer/updates")
    } else {
      setLoginError(result.error)
    }
    setLoginLoading(false)
  }

  const handleApply = (e) => {
    e.preventDefault()
    addVolunteer({ name: applyForm.name, email: applyForm.email, phone: applyForm.phone, city: applyForm.city, role: applyForm.role })
    setApplied(true)
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm"
  const labelCls = "mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs"

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <span className="grid size-12 place-items-center rounded-full border border-teal/30 bg-teal/10">
            <Logo className="size-6" />
          </span>
          <h1 className="font-heading text-[22px] font-extrabold text-primary sm:text-2xl">Volunteer Portal</h1>
          <p className="text-[9px] text-muted-foreground sm:text-xs">Sign in to your account or apply to join</p>
        </div>

        {/* Toggle */}
        <div className="mb-4 flex rounded-2xl border border-border bg-card p-1">
          {[{ key: "signin", icon: LogIn, label: "Sign In" }, { key: "apply", icon: UserPlus, label: "Apply" }].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => { setTab(key); setLoginError(""); setApplied(false) }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[9px] font-bold transition sm:text-xs ${
                tab === key ? "bg-teal text-white shadow-sm" : "text-muted-foreground hover:text-primary"
              }`}>
              <Icon className="size-3.5" /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "signin" && (
            <motion.div key="signin"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}>
              <form onSubmit={handleSignIn} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-6">
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Email</label>
                    <input required type="email" value={loginForm.email} onChange={setLogin("email")}
                      placeholder="your@email.com" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Password <span className="font-normal">(last 4 digits of phone)</span></label>
                    <div className="relative">
                      <input required type={showPw ? "text" : "password"} value={loginForm.password} onChange={setLogin("password")}
                        placeholder="••••" className={`${inputCls} pr-9`} />
                      <button type="button" onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                        {showPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                {loginError && (
                  <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[9px] font-medium text-red-500 sm:text-xs">{loginError}</p>
                )}
                <button type="submit" disabled={loginLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-[10px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-60 sm:rounded-2xl sm:text-sm">
                  <LogIn className="size-3.5" />
                  {loginLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </motion.div>
          )}

          {tab === "apply" && (
            <motion.div key="apply"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}>
              {applied ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:rounded-3xl">
                  <CheckCircle className="size-10 text-teal" />
                  <h2 className="font-heading text-[18px] font-extrabold text-primary sm:text-xl">Application Submitted!</h2>
                  <p className="text-[9px] text-muted-foreground sm:text-xs">
                    Thank you <strong>{applyForm.name}</strong>! We'll review your application within 48 hours.
                  </p>
                  <button onClick={() => { setApplied(false); setApplyForm({ name: "", email: "", phone: "", city: "", role: "", message: "" }); setTab("signin") }}
                    className="mt-1 rounded-xl bg-teal px-5 py-2.5 text-[10px] font-bold text-white transition hover:bg-teal-dark sm:rounded-2xl sm:text-sm">
                    Sign In Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input required value={applyForm.name} onChange={setApply("name")} placeholder="Your name" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email *</label>
                      <input required type="email" value={applyForm.email} onChange={setApply("email")} placeholder="your@email.com" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Phone *</label>
                      <input required value={applyForm.phone} onChange={setApply("phone")} placeholder="+91 00000 00000" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>City *</label>
                      <input required value={applyForm.city} onChange={setApply("city")} placeholder="Your city" className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Area of Interest *</label>
                      <select required value={applyForm.role} onChange={setApply("role")} className={inputCls}>
                        <option value="">Select a role</option>
                        {volunteerRoles.map((r) => <option key={r.id} value={r.title}>{r.title}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Why do you want to volunteer?</label>
                      <textarea rows={2} value={applyForm.message} onChange={setApply("message")} placeholder="Tell us about yourself..."
                        className={`${inputCls} resize-none`} />
                    </div>
                  </div>
                  <button type="submit"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-[10px] font-bold text-white transition hover:bg-teal-dark active:scale-[0.98] sm:rounded-2xl sm:text-sm">
                    <UserPlus className="size-3.5" /> Submit Application
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
