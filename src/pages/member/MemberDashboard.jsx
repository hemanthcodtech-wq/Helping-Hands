import { useApp } from "../../context/AppContext"
import { motion } from "framer-motion"
import { CreditCard, FileBadge, Heart, Target, Award } from "lucide-react"

export default function MemberDashboard() {
  const { loggedInMember, donors } = useApp()
  
  const memberDonations = donors.filter(d => d.email === loggedInMember.email)
  const totalDonated = memberDonations.reduce((sum, d) => sum + (d.status === "success" ? d.amount : 0), 0)
  
  const stats = [
    { label: "Total Contribution", value: `₹${totalDonated.toLocaleString("en-IN")}`, icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    { label: "Membership Tier", value: loggedInMember.membership_tier || "Member", icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Donations Made", value: memberDonations.filter(d => d.status === "success").length, icon: CreditCard, color: "text-teal", bg: "bg-teal/10" },
    { label: "Impact Areas", value: new Set(memberDonations.map(d => d.campaign)).size, icon: Target, color: "text-indigo-500", bg: "bg-indigo-50" },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg sm:p-8">
        <h1 className="font-heading text-2xl font-extrabold sm:text-3xl">Welcome back, {loggedInMember.name.split(" ")[0]}!</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">Thank you for being a valued member of the Helping Hands Foundation. Your continued support is making a real difference in communities across India.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className={`mb-4 inline-flex rounded-xl ${stat.bg} p-3 ${stat.color}`}>
              <stat.icon className="size-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-primary">{stat.value}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-extrabold text-primary">Recent Donations</h2>
          {memberDonations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <Heart className="mx-auto size-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm font-semibold text-muted-foreground">You haven't made any donations yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {memberDonations.slice(0, 3).map(donation => (
                <div key={donation.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <p className="font-bold text-primary">{donation.campaign}</p>
                    <p className="text-xs text-muted-foreground">{new Date(donation.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{donation.amount}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${donation.status === "success" ? "bg-teal/10 text-teal" : "bg-red-50 text-red-500"}`}>
                      {donation.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-extrabold text-primary">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/30 p-6 text-center transition hover:border-teal hover:bg-primary-soft hover:text-teal">
              <CreditCard className="size-6 text-muted-foreground" />
              <span className="text-sm font-bold text-primary">Make a Donation</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/30 p-6 text-center transition hover:border-teal hover:bg-primary-soft hover:text-teal">
              <FileBadge className="size-6 text-muted-foreground" />
              <span className="text-sm font-bold text-primary">Download ID Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
