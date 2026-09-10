import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { LogIn } from "lucide-react"
import { volunteerRoles } from "../data/content"
import Icon from "../components/Common/Icon"
import FadeIn from "../components/Common/FadeIn"
import SectionHeading from "../components/Common/SectionHeading"

const STEPS = [
  { step: "01", title: "Apply Online", desc: "Fill out the volunteer application form below." },
  { step: "02", title: "Get Reviewed", desc: "Our team reviews your application within 48 hours." },
  { step: "03", title: "Orientation", desc: "Attend a brief online or in-person orientation session." },
  { step: "04", title: "Start Serving", desc: "Get assigned to activities and start making an impact." },
]

export default function Volunteer() {
  const navigate = useNavigate()

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-teal text-white">
        <div className="page-shell px-3 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">Join Us</p>
            <h1 className="font-heading text-[32px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[56px]">
              Become a Volunteer
            </h1>
            <p className="mt-3 text-[10px] leading-[1.65] text-white/80 sm:mt-5 sm:text-sm lg:text-[15px]">
              Your time and skills can transform lives. Join 800+ volunteers who are already making a difference across India.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
              <button
                onClick={() => navigate("/volunteer/register")}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[10px] font-bold text-teal transition hover:bg-white/90 sm:text-xs"
              >
                Register as a Volunteer
              </button>
              <button
                onClick={() => navigate("/volunteer/login")}
                className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-[9px] font-bold text-white transition hover:bg-white/10 sm:text-xs"
              >
                <LogIn className="size-3.5" /> Already a volunteer? Sign In
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="page-shell px-3 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <FadeIn><SectionHeading>How It Works</SectionHeading></FadeIn>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <FadeIn key={s.step} delay={i * 0.08}>
              <div className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5">
                <span className="font-heading text-[28px] font-extrabold text-primary/10 sm:text-4xl">{s.step}</span>
                <h3 className="mt-1 text-[10px] font-bold text-primary sm:mt-2 sm:text-sm">{s.title}</h3>
                <p className="mt-1 text-[7px] leading-[1.5] text-muted-foreground sm:text-xs">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="page-shell px-3 pb-10 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <FadeIn><SectionHeading>Open Volunteer Roles</SectionHeading></FadeIn>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 lg:grid-cols-4">
          {volunteerRoles.map((role, i) => (
            <FadeIn key={role.id} delay={i * 0.08}>
              <div className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5">
                <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-teal sm:size-11">
                  <Icon name={role.icon} className="size-4 sm:size-5" />
                </span>
                <h3 className="mt-2 text-[10px] font-bold text-primary sm:mt-3 sm:text-sm">{role.title}</h3>
                <p className="mt-1 text-[7px] leading-[1.5] text-muted-foreground sm:text-xs">{role.desc}</p>
                <div className="mt-2 flex items-center gap-1 sm:mt-3">
                  <span className="size-1.5 rounded-full bg-teal" />
                  <span className="text-[7px] font-semibold text-teal sm:text-[10px]">{role.slots} slots open</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  )
}
