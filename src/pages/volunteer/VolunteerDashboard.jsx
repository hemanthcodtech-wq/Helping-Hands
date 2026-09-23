import { BookOpen, CheckCircle, Clock, Heart, XCircle } from "lucide-react"
import { useApp } from "../../context/AppContext"
import FadeIn from "../../components/Common/FadeIn"

const STATUS_STYLE = {
  approved: { bg: "bg-teal/10", text: "text-teal", label: "Approved" },
  pending: { bg: "bg-amber-50", text: "text-amber-600", label: "Pending Review" },
  rejected: { bg: "bg-red-50", text: "text-red-500", label: "Rejected" },
}

export default function VolunteerDashboard() {
  const { loggedInVolunteer, volunteerActivities } = useApp()
  const me = loggedInVolunteer || {}

  const st = STATUS_STYLE[me.status] || STATUS_STYLE.pending
  const completedActivities = volunteerActivities.filter((a) => a.status === "completed")
  const totalHours = completedActivities.reduce((s, a) => s + a.hours, 0)

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-extrabold sm:text-3xl text-primary">Dashboard</h1>
      
      {/* Status banner */}
      <FadeIn className={`mb-6 flex items-center gap-3 rounded-2xl border p-3 sm:rounded-3xl sm:p-5 ${st.bg}`}>
        {me.status === "approved" && <CheckCircle className={`size-5 shrink-0 ${st.text} sm:size-6`} />}
        {me.status === "pending" && <Clock className={`size-5 shrink-0 ${st.text} sm:size-6`} />}
        {me.status === "rejected" && <XCircle className={`size-5 shrink-0 ${st.text} sm:size-6`} />}
        <div>
          <p className={`text-[10px] font-bold sm:text-sm ${st.text}`}>{st.label}</p>
          <p className="text-[8px] text-muted-foreground sm:text-xs">
            {me.status === "approved" && "Your application has been approved. You are an active volunteer."}
            {me.status === "pending" && "Your application is under review. We'll notify you within 48 hours."}
            {me.status === "rejected" && "Your application was not accepted this time. Please try again."}
          </p>
        </div>
      </FadeIn>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        {[
          { icon: Clock, label: "Total Hours", value: totalHours, color: "text-teal" },
          { icon: BookOpen, label: "Activities", value: completedActivities.length, color: "text-accent" },
          { icon: Heart, label: "Role", value: me.role?.split(" ")[0] || "Volunteer", color: "text-primary" },
          { icon: CheckCircle, label: "Status", value: st.label, color: st.text },
        ].map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.07}>
            <div className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5">
              <s.icon className={`size-4 ${s.color} sm:size-5`} />
              <p className={`mt-2 font-heading text-[18px] font-extrabold sm:text-2xl ${s.color}`}>{s.value}</p>
              <p className="mt-0.5 text-[7px] text-muted-foreground sm:text-xs">{s.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Profile card */}
      <FadeIn className="mb-6 rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-6">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">My Profile</h2>
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          {[
            { label: "Name", value: me.name },
            { label: "Email", value: me.email },
            { label: "Phone", value: me.phone || "N/A" },
            { label: "City", value: me.city || "N/A" },
            { label: "Role", value: me.role || "Volunteer" },
            { label: "Applied", value: me.appliedDate || "N/A" },
          ].map((f) => (
            <div key={f.label} className="rounded-xl bg-muted/30 px-3 py-2 sm:rounded-2xl">
              <p className="text-[7px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[9px]">{f.label}</p>
              <p className="mt-0.5 text-[9px] font-medium text-primary sm:text-sm">{f.value}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Activities */}
      <FadeIn className="rounded-2xl border border-border bg-card sm:rounded-3xl">
        <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-[11px] font-bold text-primary sm:text-sm">My Activities</h2>
        </div>
        <div className="divide-y divide-border">
          {volunteerActivities.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <p className="text-[9px] font-semibold text-primary sm:text-sm">{a.title}</p>
                <p className="mt-0.5 text-[7px] text-muted-foreground sm:text-xs">{a.formatted_date} · {a.hours} hrs</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[7px] font-bold sm:text-[10px] ${
                a.status === "completed" ? "bg-teal/10 text-teal" : "bg-amber-50 text-amber-600"
              }`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  )
}
