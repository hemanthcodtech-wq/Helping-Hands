import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn, UserPlus, ArrowRight, Heart, Shield, Users } from "lucide-react"
import { useApp } from "../../context/AppContext"
import Logo from "../../components/Common/Logo"

export default function VolunteerLogin() {
  const { volunteerLogin } = useApp()
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  const setLogin = (k) => (e) => setLoginForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)
    const result = await volunteerLogin(loginForm.email, loginForm.password)
    if (result.success) {
      navigate("/volunteer-portal")
    } else {
      setLoginError(result.error)
    }
    setLoginLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/50 via-background to-teal/5 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo & Title */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="grid size-14 place-items-center rounded-2xl border border-teal/20 bg-teal/10 shadow-sm">
            <Logo className="w-9 h-auto" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-primary">Volunteer Portal</h1>
            <p className="mt-1 text-xs text-muted-foreground">Sign in to access your dashboard</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Email Address</label>
              <input
                required type="email"
                value={loginForm.email} onChange={setLogin("email")}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Password</label>
              <div className="relative">
                <input
                  required type={showPw ? "text" : "password"}
                  value={loginForm.password} onChange={setLogin("password")}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-10 text-sm text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10 transition"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          {loginError && (
            <p className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs font-semibold text-red-600">
              {loginError}
            </p>
          )}

          <button type="submit" disabled={loginLoading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-bold text-white shadow-lg shadow-teal/20 transition hover:bg-teal-dark disabled:opacity-60 active:scale-[0.98]">
            <LogIn className="size-4" />
            {loginLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register CTA */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-bold text-primary">New Volunteer?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create your account with personal details, documents, and OTP email verification.
          </p>
          <Link to="/volunteer/register"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-teal/40 bg-teal/5 py-2.5 text-sm font-bold text-teal transition hover:bg-teal hover:text-white">
            <UserPlus className="size-4" /> Register as Volunteer <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-5 flex items-center justify-center gap-6">
          {[
            { icon: Shield, label: "Secure Login" },
            { icon: Heart, label: "Make Impact" },
            { icon: Users, label: "Join 500+" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="size-4 text-teal" />
              <span className="text-[9px] font-semibold text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  )
}
