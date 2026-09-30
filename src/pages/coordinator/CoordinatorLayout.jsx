import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { LayoutDashboard, LogOut, Menu, LifeBuoy, X, IdCard, Landmark, HeartHandshake, Award, Folder, FileText, Users, Image as ImageIcon, Video, Medal, Briefcase, Shield, Settings, FileBox } from "lucide-react"

export default function CoordinatorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const [settings, setSettings] = useState({})

  useEffect(() => {
    if (!localStorage.getItem("coordinatorAuth")) navigate("/coordinator/login")
    
    // Fetch global settings to check which modules are enabled for coordinators
    fetch("https://helpinghandsbe.vercel.app/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings)
        }
      })
      .catch(err => console.error("Error fetching settings:", err))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("coordinatorAuth")
    navigate("/coordinator/login")
  }

  const linkClass = ({ isActive }) => `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition sm:text-sm ${isActive ? "bg-teal text-white shadow-sm" : "text-primary hover:bg-primary-soft"}`

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-border bg-card transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 sm:w-64 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-14 items-center gap-2 border-b border-border px-4 sm:h-16">
          <div className="leading-none"><p className="text-[9px] font-extrabold tracking-tight text-primary sm:text-[11px]">HELPING HANDS</p><p className="text-[6px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[8px]">Coordinator Portal</p></div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"><X className="size-4" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <NavLink to="/coordinator-portal" end className={linkClass} onClick={() => setSidebarOpen(false)}><LayoutDashboard className="size-4 shrink-0" />Dashboard</NavLink>
          <NavLink to="/coordinator-portal/collections" className={linkClass} onClick={() => setSidebarOpen(false)}><Landmark className="size-4 shrink-0" />Collections</NavLink>
          <NavLink to="/coordinator-portal/donors" className={linkClass} onClick={() => setSidebarOpen(false)}><HeartHandshake className="size-4 shrink-0" />Donors</NavLink>
          <NavLink to="/coordinator-portal/id-card" className={linkClass} onClick={() => setSidebarOpen(false)}><IdCard className="size-4 shrink-0" />My ID Card</NavLink>
          <NavLink to="/coordinator-portal/certificates" className={linkClass} onClick={() => setSidebarOpen(false)}><Award className="size-4 shrink-0" />Certificates</NavLink>
          <NavLink to="/coordinator-portal/support" className={linkClass} onClick={() => setSidebarOpen(false)}><LifeBuoy className="size-4 shrink-0" />Support</NavLink>

          {/* Conditional Menu Items from Global Toggles */}
          {settings.coordCampaignsManagement && <NavLink to="/coordinator-portal/campaigns" className={linkClass} onClick={() => setSidebarOpen(false)}><Folder className="size-4 shrink-0" />Campaigns Mgt</NavLink>}
          {settings.coordDonationsLedger && <NavLink to="/coordinator-portal/ledger" className={linkClass} onClick={() => setSidebarOpen(false)}><FileText className="size-4 shrink-0" />Donations Ledger</NavLink>}
          {settings.coordExpenseManager && <NavLink to="/coordinator-portal/expenses" className={linkClass} onClick={() => setSidebarOpen(false)}><Landmark className="size-4 shrink-0" />Expense Manager</NavLink>}
          
          {settings.coordAboutUs && <NavLink to="/coordinator-portal/about-us" className={linkClass} onClick={() => setSidebarOpen(false)}><FileBox className="size-4 shrink-0" />About Us Profile</NavLink>}
          {settings.coordEventsPortal && <NavLink to="/coordinator-portal/events" className={linkClass} onClick={() => setSidebarOpen(false)}><Folder className="size-4 shrink-0" />Events Portal</NavLink>}
          {settings.coordTestimonials && <NavLink to="/coordinator-portal/testimonials" className={linkClass} onClick={() => setSidebarOpen(false)}><Users className="size-4 shrink-0" />Testimonials</NavLink>}
          {settings.coordGallery && <NavLink to="/coordinator-portal/gallery" className={linkClass} onClick={() => setSidebarOpen(false)}><ImageIcon className="size-4 shrink-0" />Gallery</NavLink>}
          {settings.coordYoutube && <NavLink to="/coordinator-portal/youtube" className={linkClass} onClick={() => setSidebarOpen(false)}><Video className="size-4 shrink-0" />YouTube Videos</NavLink>}
          {settings.coordAchievements && <NavLink to="/coordinator-portal/achievements" className={linkClass} onClick={() => setSidebarOpen(false)}><Medal className="size-4 shrink-0" />Achievements</NavLink>}
          {settings.coordPartners && <NavLink to="/coordinator-portal/partners" className={linkClass} onClick={() => setSidebarOpen(false)}><Briefcase className="size-4 shrink-0" />Partners & Sponsors</NavLink>}
          {settings.coordProjects && <NavLink to="/coordinator-portal/projects" className={linkClass} onClick={() => setSidebarOpen(false)}><Folder className="size-4 shrink-0" />Our Projects</NavLink>}

          {settings.coordNews && <NavLink to="/coordinator-portal/news" className={linkClass} onClick={() => setSidebarOpen(false)}><FileText className="size-4 shrink-0" />News & Activities</NavLink>}
          {settings.coordDocuments && <NavLink to="/coordinator-portal/documents" className={linkClass} onClick={() => setSidebarOpen(false)}><FileBox className="size-4 shrink-0" />Public Documents</NavLink>}

          {settings.coordCertMembership && <NavLink to="/coordinator-portal/certs-membership" className={linkClass} onClick={() => setSidebarOpen(false)}><Award className="size-4 shrink-0" />Membership Certs</NavLink>}
          {settings.coordCertAppreciation && <NavLink to="/coordinator-portal/certs-appreciation" className={linkClass} onClick={() => setSidebarOpen(false)}><Award className="size-4 shrink-0" />Appreciation Certs</NavLink>}
          {settings.coordCertParticipation && <NavLink to="/coordinator-portal/certs-participation" className={linkClass} onClick={() => setSidebarOpen(false)}><Award className="size-4 shrink-0" />Participation Certs</NavLink>}
          {settings.coordCertVisitor && <NavLink to="/coordinator-portal/certs-visitor" className={linkClass} onClick={() => setSidebarOpen(false)}><Award className="size-4 shrink-0" />Visitor Certs</NavLink>}
          {settings.coordAppointmentLetters && <NavLink to="/coordinator-portal/appointment-letters" className={linkClass} onClick={() => setSidebarOpen(false)}><FileText className="size-4 shrink-0" />Appointment Letters</NavLink>}
          {settings.coordLettersComposer && <NavLink to="/coordinator-portal/letters-composer" className={linkClass} onClick={() => setSidebarOpen(false)}><FileText className="size-4 shrink-0" />Letters Composer</NavLink>}

          {settings.coordUsersAdmin && <NavLink to="/coordinator-portal/users-admin" className={linkClass} onClick={() => setSidebarOpen(false)}><Users className="size-4 shrink-0" />Users Admin</NavLink>}
          {settings.coordTeamAdmin && <NavLink to="/coordinator-portal/team-admin" className={linkClass} onClick={() => setSidebarOpen(false)}><Shield className="size-4 shrink-0" />Team Admin</NavLink>}
          {settings.coordReviewVolunteers && <NavLink to="/coordinator-portal/review-volunteers" className={linkClass} onClick={() => setSidebarOpen(false)}><Users className="size-4 shrink-0" />Review Volunteers</NavLink>}

        </nav>
        <div className="border-t border-border p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-orange-50 hover:text-accent sm:text-sm"><LogOut className="size-4 shrink-0" />Logout</button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-3 backdrop-blur-md sm:h-16 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="grid size-8 place-items-center rounded-xl text-teal hover:bg-primary-soft lg:hidden"><Menu className="size-5" /></button>
          <h1 className="text-[12px] font-bold text-primary sm:text-base">Coordinator Portal</h1>
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
