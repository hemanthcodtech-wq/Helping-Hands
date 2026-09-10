import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Bell, BookOpen, Calendar, CheckCircle, Clock, LogOut, XCircle } from "lucide-react"
import { useApp } from "../../context/AppContext"
import FadeIn from "../../components/Common/FadeIn"

const TYPE_STYLE = {
  assignment: { bg: "bg-teal/10", text: "text-teal", label: "Assignment" },
  activity: { bg: "bg-accent/10", text: "text-accent", label: "Activity" },
  announcement: { bg: "bg-purple-50", text: "text-purple-600", label: "Announcement" },
  reminder: { bg: "bg-amber-50", text: "text-amber-600", label: "Reminder" },
}

const STATUS_STYLE = {
  approved: { icon: CheckCircle, text: "text-teal", label: "Approved" },
  pending: { icon: Clock, text: "text-amber-600", label: "Pending Review" },
  rejected: { icon: XCircle, text: "text-red-500", label: "Rejected" },
}

export default function VolunteerUpdates() {
  const { loggedInVolunteer, volunteerLogout, volunteerUpdates } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loggedInVolunteer) navigate("/volunteer/login")
  }, [loggedInVolunteer, navigate])

  if (!loggedInVolunteer) return null

  const myUpdates = volunteerUpdates.filter((u) => u.volunteerId === loggedInVolunteer.id)
  const st = STATUS_STYLE[loggedInVolunteer.status] || STATUS_STYLE.pending
  const StatusIcon = st.icon

  const handleLogout = () => {
    volunteerLogout()
    navigate("/volunteer/login")
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="bg-teal text-white">
        <div className="page-shell flex items-center justify-between px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 sm:text-[11px]">My Updates</p>
            <h1 className="font-heading text-[22px] font-extrabold sm:text-3xl">
              Hello, {loggedInVolunteer.name.split(" ")[0]}!
            </h1>
          </motion.div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-white/10 sm:px-4 sm:text-xs">
            <LogOut className="size-3" /> Sign Out
          </button>
        </div>
      </div>

      <div className="page-shell px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Status card */}
        <FadeIn className="mb-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-5">
            <div className={`flex items-center gap-2 ${st.text}`}>
              <StatusIcon className="size-4" />
              <span className="text-[10px] font-bold sm:text-sm">{st.label}</span>
            </div>
            <p className="mt-1 text-[7px] text-muted-foreground sm:text-xs">Application Status</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-5">
            <div className="flex items-center gap-2 text-accent">
              <Bell className="size-4" />
              <span className="font-heading text-[18px] font-extrabold sm:text-2xl">{myUpdates.length}</span>
            </div>
            <p className="mt-1 text-[7px] text-muted-foreground sm:text-xs">Total Updates</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-5">
            <div className="flex items-center gap-2 text-teal">
              <BookOpen className="size-4" />
              <span className="font-heading text-[18px] font-extrabold sm:text-2xl">{loggedInVolunteer.hours}h</span>
            </div>
            <p className="mt-1 text-[7px] text-muted-foreground sm:text-xs">Volunteer Hours</p>
          </div>
        </FadeIn>

        {/* Updates list */}
        <FadeIn className="rounded-2xl border border-border bg-card sm:rounded-3xl">
          <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="text-[11px] font-bold text-primary sm:text-sm">Updates from Admin</h2>
          </div>

          {myUpdates.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
              <Bell className="size-8 text-muted-foreground/40" />
              <p className="mt-3 text-[10px] text-muted-foreground sm:text-sm">No updates yet. Check back soon!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {myUpdates.map((u, i) => {
                const ts = TYPE_STYLE[u.type] || TYPE_STYLE.announcement
                return (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="px-4 py-4 sm:px-6 sm:py-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[7px] font-bold sm:text-[10px] ${ts.bg} ${ts.text}`}>
                            {ts.label}
                          </span>
                          <h3 className="text-[10px] font-bold text-primary sm:text-sm">{u.title}</h3>
                        </div>
                        <p className="mt-1.5 text-[9px] leading-relaxed text-muted-foreground sm:text-xs">{u.message}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[7px] text-muted-foreground sm:text-[10px]">
                      <Calendar className="size-3" />
                      {u.date}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </FadeIn>
      </div>
    </main>
  )
}
