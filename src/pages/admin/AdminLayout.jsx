import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Award, BarChart2, FileBadge, Heart, Image, LayoutDashboard, LogOut, Menu, Users, X, FileEdit, HeartHandshake, UserPlus, Megaphone, Target, IdCard, Settings, Landmark } from "lucide-react"
import Logo from "../../components/Common/Logo"
import { useApp } from "../../context/AppContext"

const NAV = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/donors", icon: HeartHandshake, label: "Donors" },
  { to: "/admin/members", icon: Users, label: "Members" },
  { to: "/admin/volunteers", icon: UserPlus, label: "Volunteers" },
  { to: "/admin/volunteer-requests", icon: FileBadge, label: "Requests" },
  { to: "/admin/resources", icon: Image, label: "Media & Resources" },
  { to: "/admin/documents", icon: IdCard, label: "Member ID Cards" },
  { to: "/admin/certificates", icon: FileBadge, label: "Generate Certificates" },
  { to: "/admin/programs", icon: Target, label: "Programs" },
  { to: "/admin/events", icon: Megaphone, label: "Events & News" },
  { to: "/admin/campaigns", icon: Award, label: "Campaigns" },
  { to: "/admin/campaigns-revenue", icon: BarChart2, label: "Campaigns Revenue" },
  { to: "/admin/teams", icon: Users, label: "Teams & Members" },
  { to: "/admin/partners", icon: Heart, label: "Partners & Sponsors" },
  { to: "/admin/testimonials", icon: Target, label: "Testimonials" },
  { to: "/admin/content", icon: FileEdit, label: "Content" },
  { to: "/admin/reports", icon: BarChart2, label: "Reports" },
  { to: "/admin/bank-accounts", icon: Landmark, label: "Bank Accounts" },
  { to: "/admin/settings", icon: Settings, label: "Site Settings" },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAdminLoggedIn, adminLogout } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdminLoggedIn) navigate("/admin/login")
  }, [isAdminLoggedIn, navigate])

  if (!isAdminLoggedIn) return null
  const handleLogout = () => { adminLogout(); navigate("/admin/login") }
  const linkClass = ({ isActive }) => `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition sm:text-sm ${isActive ? "bg-teal text-white shadow-sm" : "text-primary hover:bg-primary-soft"}`

  return (
    <div className="flex min-h-screen bg-muted/30">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-border bg-card transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 sm:w-64 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-14 items-center gap-2 border-b border-border px-4 sm:h-16">
          <span className="grid size-7 place-items-center rounded-full border border-[#8fbe78] bg-[#eef7e9] sm:size-8"><Logo className="size-4 sm:size-5" /></span>
          <div className="leading-none"><p className="text-[9px] font-extrabold tracking-tight text-primary sm:text-[11px]">HELPING HANDS</p><p className="text-[6px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[8px]">Admin Panel</p></div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"><X className="size-4" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">{NAV.map(({ to, icon: Icon, label }) => <NavLink key={to} to={to} end={to === "/admin"} className={linkClass} onClick={() => setSidebarOpen(false)}><Icon className="size-4 shrink-0" />{label}</NavLink>)}</nav>
        <div className="border-t border-border p-3"><button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-orange-50 hover:text-accent sm:text-sm"><LogOut className="size-4 shrink-0" />Logout</button></div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-3 backdrop-blur-md sm:h-16 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="grid size-8 place-items-center rounded-xl text-teal hover:bg-primary-soft lg:hidden"><Menu className="size-5" /></button>
          <h1 className="text-[12px] font-bold text-primary sm:text-base">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-2"><span className="hidden text-[8px] text-muted-foreground sm:block">admin@helpinghands.org</span><span className="rounded-full bg-green-50 px-2.5 py-1 text-[8px] font-bold text-green-700 sm:text-[10px]">Super Admin</span></div>
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
