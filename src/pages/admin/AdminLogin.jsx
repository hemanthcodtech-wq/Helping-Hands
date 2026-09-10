import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, LogIn } from "lucide-react"
import { useApp } from "../../context/AppContext"
import Logo from "../../components/Common/Logo"

const DEMO = { email: "admin@helpinghands.org", password: "Admin@1234" }

export default function AdminLogin() {
  const { adminLogin } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await adminLogin(form.email, form.password)
    if (result.success) navigate("/admin")
    else setError(result.error)
    setLoading(false)
  }

  const fillDemo = () => setForm(DEMO)

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="grid size-12 place-items-center rounded-full border border-green-300 bg-green-50">
            <Logo className="size-6" />
          </span>
          <h1 className="font-heading text-[22px] font-extrabold text-primary sm:text-2xl">Admin Sign In</h1>
          <p className="text-[9px] text-muted-foreground sm:text-xs">Helping Hands Foundation · Admin Panel</p>
        </div>

        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wider text-green-700 sm:text-[10px]">Demo Credentials</p>
              <p className="mt-0.5 text-[8px] text-muted-foreground sm:text-xs">{DEMO.email}</p>
              <p className="text-[8px] text-muted-foreground sm:text-xs">{DEMO.password}</p>
            </div>
            <button type="button" onClick={fillDemo} className="rounded-xl bg-green-100 px-3 py-1.5 text-[8px] font-bold text-green-700 transition hover:bg-green-600 hover:text-white sm:text-xs">Fill</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-7">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Email</label>
              <input required type="email" value={form.email} onChange={set("email")} placeholder="admin@helpinghands.org" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Password</label>
              <div className="relative">
                <input required type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••••" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pr-9 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">{showPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}</button>
              </div>
            </div>
          </div>

          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[9px] font-medium text-red-500 sm:text-xs">{error}</p>}

          <button type="submit" disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-[10px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-60 sm:mt-5 sm:rounded-2xl sm:text-sm">
            <LogIn className="size-3.5" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[8px] text-muted-foreground sm:text-xs"><Lock className="size-3" /> Restricted access · Authorised personnel only</p>
      </motion.div>
    </main>
  )
}
