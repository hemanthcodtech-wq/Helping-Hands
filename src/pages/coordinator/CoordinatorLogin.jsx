import toast from "react-hot-toast";

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogIn } from "lucide-react"

export default function CoordinatorLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/coordinators/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem("coordinatorAuth", "true")
        localStorage.setItem("coordinatorData", JSON.stringify(data.coordinator))
        navigate("/coordinator-portal")
      } else {
        toast.error(data.message || "Login failed")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-2xl border border-border">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-primary">Coordinator Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="coordinator@example.com" className="mt-1 w-full rounded-xl border p-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="********" className="mt-1 w-full rounded-xl border p-3 text-sm" />
          </div>
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal/90 disabled:opacity-70">
            <LogIn className="size-4" /> {loading ? "Logging in..." : "Login to Portal"}
          </button>
        </form>
      </div>
    </div>
  )
}
