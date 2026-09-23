import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Award, CreditCard, LayoutDashboard, LogOut, Menu, UserCircle, X, FileBadge } from "lucide-react"
import Logo from "../../components/Common/Logo"
import { useApp } from "../../context/AppContext"

const NAV = [
  { to: "/member", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/member/donations", icon: CreditCard, label: "My Donations" },
  { to: "/member/documents", icon: FileBadge, label: "My Documents" },
  { to: "/member/profile", icon: UserCircle, label: "Profile Settings" },
]

export default function MemberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loggedInMember, memberLogout } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loggedInMember) {
      navigate("/member/login")
    }
  }, [loggedInMember, navigate])

  if (!loggedInMember) return null

  return (
    <div className="flex min-h-screen bg-background">
      <div className={`fixed inset-0 z-30 bg-primary/40 backdrop-blur-sm lg:hidden ${sidebarOpen ? "block" : "hidden"}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-border bg-card transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 sm:w-64 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-5">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center"><Logo className="size-8" /></span>
            <span className="font-heading text-[13px] font-extrabold text-primary">Member Portal</span>
          </NavLink>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground"><X className="size-5" /></button>
        </div>
        
        <div className="p-5">
          <div className="rounded-2xl bg-primary-soft p-4 text-center">
            <div className="mx-auto size-12 rounded-full bg-white text-teal shadow-sm overflow-hidden flex items-center justify-center">
              {loggedInMember.profile_picture_url ? (
                <img src={loggedInMember.profile_picture_url} alt={loggedInMember.name} className="size-full object-cover" crossOrigin="anonymous" />
              ) : (
                <span className="text-lg font-bold text-teal">{loggedInMember.name.charAt(0)}</span>
              )}
            </div>
            <h3 className="mt-3 font-bold text-primary">{loggedInMember.name}</h3>
            <span className="mt-1 inline-block rounded-full bg-teal/10 px-2 py-0.5 text-[9px] font-bold text-teal">{loggedInMember.membership_tier || "Member"}</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Menu</div>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-teal text-white shadow-md" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}>
              <item.icon className={`size-4 ${({ isActive }) => isActive ? "text-white" : "text-muted-foreground"}`} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <button onClick={memberLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="grid size-10 place-items-center rounded-xl border border-border text-primary lg:hidden hover:bg-muted"><Menu className="size-5" /></button>
          <div className="flex flex-1 items-center justify-end">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block"><p className="text-sm font-bold text-primary">{loggedInMember.name}</p><p className="text-[10px] text-muted-foreground">{loggedInMember.email}</p></div>
              <div className="size-10 rounded-full bg-primary-soft overflow-hidden flex items-center justify-center font-bold text-teal">
                {loggedInMember.profile_picture_url ? (
                  <img src={loggedInMember.profile_picture_url} alt={loggedInMember.name} className="size-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <span>{loggedInMember.name.charAt(0)}</span>
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
