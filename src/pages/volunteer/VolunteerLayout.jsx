import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { LayoutDashboard, LogOut, Menu, UserCircle, X, Heart, Flag, IdCard, Award } from "lucide-react"
import Logo from "../../components/Common/Logo"
import { useApp } from "../../context/AppContext"

const NAV = [
  { to: "/volunteer-portal", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/volunteer-portal/campaigns", icon: Flag, label: "My Campaigns" },
  { to: "/volunteer-portal/programs", icon: Heart, label: "My Programs" },
  { to: "/volunteer-portal/id-card", icon: IdCard, label: "ID Card" },
  { to: "/volunteer-portal/certificates", icon: Award, label: "Certificates" },
]

export default function VolunteerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loggedInVolunteer, volunteerLogout } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loggedInVolunteer) {
      navigate("/volunteer/login")
    }
  }, [loggedInVolunteer, navigate])

  if (!loggedInVolunteer) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-30 bg-primary/40 backdrop-blur-sm lg:hidden ${sidebarOpen ? "block" : "hidden"}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar — fixed height, never scrolls the page */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex h-screen w-56 flex-shrink-0 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0 sm:w-64 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-5">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center"><Logo className="size-8" /></span>
            <span className="font-heading text-[13px] font-extrabold text-primary">Volunteer Portal</span>
          </NavLink>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground"><X className="size-5" /></button>
        </div>

        <div className="p-5 shrink-0">
          <div className="rounded-2xl bg-teal/10 p-4 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-white text-teal shadow-sm overflow-hidden">
              {loggedInVolunteer.photo ? (
                <img src={loggedInVolunteer.photo} alt={loggedInVolunteer.name} className="size-full object-cover" crossOrigin="anonymous" />
              ) : (
                <UserCircle className="size-6" />
              )}
            </div>
            <h3 className="mt-3 font-bold text-primary">{loggedInVolunteer.name}</h3>
            <span className="mt-1 inline-block rounded-full bg-teal/20 px-2 py-0.5 text-[9px] font-bold text-teal">Volunteer</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Menu</div>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-teal text-white shadow-md" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}>
              <item.icon className="size-4" /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-border p-4">
          <button onClick={volunteerLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main — independently scrollable */}
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="grid size-10 place-items-center rounded-xl border border-border text-primary lg:hidden hover:bg-muted"><Menu className="size-5" /></button>
          <div className="flex flex-1 items-center justify-end">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block"><p className="text-sm font-bold text-primary">{loggedInVolunteer.name}</p><p className="text-[10px] text-muted-foreground">{loggedInVolunteer.email}</p></div>
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-teal/10 text-teal font-bold overflow-hidden">
                {loggedInVolunteer.photo ? (
                  <img src={loggedInVolunteer.photo} alt={loggedInVolunteer.name} className="size-full object-cover" />
                ) : (
                  loggedInVolunteer.name.charAt(0)
                )}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></div>
      </main>
    </div>
  )
}
