import { useState, useEffect } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"
import { useApp } from "../../context/AppContext"

export default function MemberLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { memberLogin, loggedInMember } = useApp()

  useEffect(() => {
    if (loggedInMember) navigate("/member")
  }, [loggedInMember, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/members/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (data.success) {
        memberLogin(data.member)
        navigate("/member")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center bg-[#f7fbff] px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-[#dce4ee] bg-white shadow-xl">
          <div className="bg-[#04458F] px-8 py-8 text-center text-white">
            <h1 className="font-heading text-2xl font-extrabold">Member Login</h1>
            <p className="mt-2 text-sm text-white/80">Welcome back to Helping Hands</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</div>}
              
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#061D49]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b98aa]" />
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-[#dce4ee] bg-[#f7fbff] py-3 pl-11 pr-4 text-sm text-[#061D49] outline-none transition focus:border-[#04458F] focus:ring-2 focus:ring-[#04458F]/10" placeholder="Enter your email" />
                </div>
              </div>
              
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#061D49]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b98aa]" />
                  <input type={showPassword ? "text" : "password"} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-xl border border-[#dce4ee] bg-[#f7fbff] py-3 pl-11 pr-11 text-sm text-[#061D49] outline-none transition focus:border-[#04458F] focus:ring-2 focus:ring-[#04458F]/10" placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b98aa] transition hover:text-[#04458F]">
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff9700] py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#f38a00] disabled:opacity-70">
                {isLoading ? "Signing in..." : "Sign In"} <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
          
          <div className="border-t border-[#dce4ee] bg-[#f7fbff] p-5 text-center">
            <p className="text-sm text-[#52627a]">Not a member yet? <NavLink to="/donate" className="font-bold text-[#04458F] hover:underline">Become a Member</NavLink></p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
