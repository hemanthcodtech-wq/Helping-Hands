import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import { causes } from "../data/content"
import Icon from "../components/Common/Icon"
import FadeIn from "../components/Common/FadeIn"
import SectionHeading from "../components/Common/SectionHeading"

export default function Programs() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/api/programs")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPrograms(data.programs)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      {/* Hero */}
      <section className="bg-primary-soft">
        <div className="page-shell px-3 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-teal sm:text-[11px]">What We Do</p>
            <h1 className="font-heading text-[32px] font-extrabold leading-[1.04] tracking-[-0.03em] text-primary sm:text-5xl lg:text-[56px]">
              Our Programs
            </h1>
            <p className="mt-3 text-[10px] leading-[1.65] text-muted-foreground sm:mt-5 sm:text-sm lg:text-[15px]">
              Every program is designed to create lasting change — not just immediate relief. We work alongside communities to build sustainable futures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Program Cards */}
      <section className="page-shell px-3 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground text-sm">Loading programs...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {programs.map((program, i) => (
              <FadeIn key={program.id} delay={i * 0.1}>
                <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted/30">
                    {program.image_url ? (
                      <img
                        src={program.image_url}
                        alt={program.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        decoding="async"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground/50 text-xs font-bold bg-teal/5">No Image</div>
                    )}
                    {program.tag && (
                      <span className="absolute left-3 top-3 rounded-full bg-teal px-2.5 py-1 text-[8px] font-bold text-white sm:text-[10px]">
                        {program.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <h2 className="font-heading text-[15px] font-bold text-primary sm:text-lg">{program.title}</h2>
                    <p className="mt-1.5 text-[9px] leading-[1.6] text-muted-foreground sm:text-sm line-clamp-3">{program.description}</p>
                    <NavLink
                      to="/donate"
                      className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold text-teal transition hover:gap-2.5 sm:mt-4 sm:text-sm"
                    >
                      Support This Program <ArrowRight className="size-3 sm:size-4" />
                    </NavLink>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* Causes */}
      <section className="page-shell px-3 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
        <FadeIn><SectionHeading>Our Focus Areas</SectionHeading></FadeIn>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 lg:grid-cols-4">
          {causes.map((cause, i) => (
            <FadeIn key={cause.id} delay={i * 0.08}>
              <div className={`rounded-xl border p-3 sm:rounded-2xl sm:p-5 ${cause.color === "accent" ? "border-accent/20 bg-accent-soft" : "border-primary/10 bg-primary-soft"}`}>
                <span className={`grid size-8 place-items-center rounded-full sm:size-11 ${cause.color === "accent" ? "bg-white text-accent" : "bg-white text-teal"}`}>
                  <Icon name={cause.icon} className="size-4 sm:size-5" />
                </span>
                <h3 className="mt-2 text-[11px] font-bold text-primary sm:mt-3 sm:text-sm">{cause.title}</h3>
                <ul className="mt-1.5 space-y-0.5 text-[7px] text-muted-foreground sm:mt-2 sm:space-y-1 sm:text-xs">
                  {cause.items.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="page-shell px-3 pb-10 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <FadeIn className="rounded-2xl bg-teal-dark p-6 text-center text-white sm:rounded-3xl sm:p-10">
          <h2 className="font-heading text-[22px] font-bold sm:text-3xl">Want to Support a Program?</h2>
          <p className="mt-2 text-[9px] text-white/80 sm:text-sm">Your donation directly funds these life-changing programs.</p>
          <NavLink
            to="/donate"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[10px] font-bold text-white transition hover:bg-accent/90 active:scale-95 sm:mt-6 sm:text-sm"
          >
            Donate Now <ArrowRight className="size-3.5 sm:size-4" />
          </NavLink>
        </FadeIn>
      </section>
    </main>
  )
}
