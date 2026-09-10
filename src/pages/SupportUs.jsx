import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Heart, Users, Award, Megaphone } from "lucide-react"
import FadeIn from "../components/Common/FadeIn"
import SectionHeading from "../components/Common/SectionHeading"

const SUPPORT_OPTIONS = [
  { title: "Donate", description: "Support our programs and help us reach more families in need.", to: "/donate", icon: Heart, action: "Donate Now" },
  { title: "Volunteer Registration", description: "Give your time, skills and energy to meaningful community work.", to: "/volunteer", icon: Users, action: "Register as Volunteer" },
  { title: "Certificates", description: "View our registration and statutory certificates for transparency.", to: "/about/certificates", icon: Award, action: "View Certificates" },
  { title: "Campaigns", description: "Join an active campaign and help us move closer to its goal.", to: "/campaigns", icon: Megaphone, action: "Explore Campaigns" },
]

export default function SupportUs() {
  return (
    <main>
      <section className="relative overflow-hidden bg-teal text-white">
        <div className="page-shell px-3 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-3xl">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">Make a Difference</p>
            <h1 className="font-heading text-[34px] font-extrabold leading-tight sm:text-5xl lg:text-[56px]">Support Us</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              There are many ways to stand with Helping Hands. Choose how you would like to contribute, participate or learn more about our work.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="page-shell px-3 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <FadeIn><SectionHeading>Ways You Can Support</SectionHeading></FadeIn>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORT_OPTIONS.map((item, i) => {
            const Icon = item.icon
            return <FadeIn key={item.title} delay={i * 0.08}>
              <Link to={item.to} className="group block h-full rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-teal"><Icon className="size-6" /></span>
                <h2 className="mt-4 font-heading text-lg font-extrabold text-primary">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <span className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-bold text-white transition group-hover:bg-teal">{item.action}</span>
              </Link>
            </FadeIn>
          })}
        </div>
      </section>
    </main>
  )
}
