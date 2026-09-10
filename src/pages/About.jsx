import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Target, Users, Zap, ArrowLeft, RotateCw, QrCode } from "lucide-react"
import { team, impact, partners } from "../data/content"
import FadeIn from "../components/Common/FadeIn"
import SectionHeading from "../components/Common/SectionHeading"
import Partners from "../components/Partners"
import Testimonials from "../components/Testimonials"
import { useApp } from "../context/AppContext"

const VALUES = [
  { icon: Heart, title: "Compassion", desc: "We lead with empathy in every action we take.", color: "accent" },
  { icon: Target, title: "Impact", desc: "Every program is designed for measurable change.", color: "primary" },
  { icon: Users, title: "Community", desc: "We build with communities, not just for them.", color: "accent" },
  { icon: Zap, title: "Transparency", desc: "100% of donations go directly to programs.", color: "primary" },
]

const TEAM_DETAILS = {
  "Dr. Priya Nair": { bio: "Founder & Director", about: "Leads the foundation's long-term mission, partnerships and community programs with a focus on sustainable impact.", experience: "15+ years in community development" },
  "Arjun Mehta": { bio: "Program Head", about: "Coordinates education, healthcare and relief programs and works closely with local community teams.", experience: "10+ years in program management" },
  "Sunita Rao": { bio: "Volunteer Coordinator", about: "Builds volunteer teams, coordinates field activities and helps volunteers turn their time into meaningful service.", experience: "8+ years in volunteer engagement" },
}

export default function About() {
  const [flipped, setFlipped] = useState(null)
  const { bankAccounts } = useApp()
  const primaryBank = (bankAccounts || []).find(b => b.is_active) || null

  return (
    <main>
      <section className="relative overflow-hidden bg-primary-soft"><div className="page-shell px-3 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl"><p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-teal sm:text-[11px]">About Us</p><h1 className="font-heading text-[32px] font-extrabold leading-[1.04] tracking-[-0.03em] text-primary sm:text-5xl lg:text-[56px]">Who We Are</h1><p className="mt-3 text-[10px] leading-[1.65] text-muted-foreground sm:mt-5 sm:text-sm sm:leading-[1.75] lg:text-[15px]">Helping Hands Foundation was established in 2010 with a single belief — that every person deserves dignity, opportunity, and care. Today we operate across 120+ villages, touching 15,000+ lives every year.</p></motion.div></div></section>
      <section className="page-shell px-3 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"><div className="grid gap-4 sm:grid-cols-2 sm:gap-6"><FadeIn className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-8"><span className="inline-block rounded-full bg-teal/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-teal sm:text-[10px]">Mission</span><h2 className="mt-3 font-heading text-[20px] font-extrabold text-primary sm:text-2xl">We Serve, We Care, We Empower</h2><p className="mt-2 text-[9px] leading-[1.65] text-muted-foreground sm:text-sm">To provide sustainable support to underprivileged communities through education, healthcare, food security and women empowerment programs.</p></FadeIn><FadeIn delay={0.1} className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-8"><span className="inline-block rounded-full bg-accent/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-accent sm:text-[10px]">Vision</span><h2 className="mt-3 font-heading text-[20px] font-extrabold text-primary sm:text-2xl">A World Without Poverty</h2><p className="mt-2 text-[9px] leading-[1.65] text-muted-foreground sm:text-sm">A future where every child has access to education, every family has food security, and every woman has the opportunity to thrive.</p></FadeIn></div></section>
      <section className="page-shell px-3 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16"><FadeIn><SectionHeading>Our Values</SectionHeading></FadeIn><div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 lg:grid-cols-4">{VALUES.map((v, i) => <FadeIn key={v.title} delay={i * 0.08}><div className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5"><span className={`grid size-8 place-items-center rounded-full sm:size-11 ${v.color === "accent" ? "bg-accent-soft text-accent" : "bg-primary-soft text-teal"}`}><v.icon className="size-4 sm:size-5" /></span><h3 className="mt-2 text-[11px] font-bold text-primary sm:mt-3 sm:text-sm">{v.title}</h3><p className="mt-1 text-[8px] leading-[1.5] text-muted-foreground sm:text-xs">{v.desc}</p></div></FadeIn>)}</div></section>
      <section className="page-shell px-3 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16"><FadeIn className="rounded-2xl bg-teal-dark px-4 py-6 text-white sm:rounded-3xl sm:px-8 sm:py-10"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">{impact.stats.map((stat, i) => <FadeIn key={stat.id} delay={i * 0.08} className="text-center"><span className="font-heading text-[22px] font-extrabold sm:text-3xl lg:text-4xl">{stat.value}</span><p className="mt-1 text-[8px] text-white/75 sm:text-xs">{stat.label}</p></FadeIn>)}</div></FadeIn></section>
      <section className="page-shell px-3 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16"><FadeIn><SectionHeading>Our Team</SectionHeading></FadeIn><p className="mt-2 text-xs text-muted-foreground sm:text-sm">Tap or click a profile card to flip it and learn more.</p><div className="mt-5 grid gap-4 sm:grid-cols-3 sm:gap-5">{team.map((member, i) => { const detail = TEAM_DETAILS[member.name] || { bio: member.role, about: "A dedicated member of the Helping Hands Foundation team working to create positive community impact.", experience: "Community service team" }; const isFlipped = flipped === member.id; return <FadeIn key={member.id} delay={i * 0.1}><button type="button" onClick={() => setFlipped(isFlipped ? null : member.id)} className="group h-[265px] w-full [perspective:1100px] text-left" aria-label={`${isFlipped ? "Show front of" : "Learn more about"} ${member.name}`}><div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}><div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm [backface-visibility:hidden]"><img src={member.avatar} alt={member.name} className="size-20 rounded-full border-2 border-primary-soft object-cover" decoding="async" loading="lazy" /><h3 className="mt-4 text-sm font-bold text-primary">{member.name}</h3><p className="mt-1 text-xs text-muted-foreground">{member.role}</p><span className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold text-teal"><RotateCw className="size-3" /> Flip for details</span></div><div className="absolute inset-0 flex flex-col rounded-2xl border border-teal/20 bg-primary p-5 text-white shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"><span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#ffb74d]">About {member.name.split(" ")[1]}</span><h3 className="mt-2 text-base font-extrabold">{detail.bio}</h3><p className="mt-3 flex-1 text-xs leading-6 text-white/80">{detail.about}</p><p className="border-t border-white/15 pt-3 text-[10px] font-semibold text-white/70">{detail.experience}</p><span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#ffb74d]"><ArrowLeft className="size-3" /> Flip back</span></div></div></button></FadeIn>})}</div></section>
      <Partners />
      <Testimonials />
      <section className="page-shell px-3 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-teal">
            <QrCode className="size-6" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-extrabold text-primary">Support Helping Hands</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
            {primaryBank?.qr_code_url ? "Scan the QR below to make a quick donation." : "Scan the PhonePe QR to make a quick donation."}
          </p>
          <div className="mx-auto mt-5 grid size-48 place-items-center rounded-2xl border-4 border-[#ffb74d] bg-white p-2">
            {primaryBank && primaryBank.qr_code_url ? (
              <img src={primaryBank.qr_code_url} alt="QR Code" className="size-full object-contain" />
            ) : (
              <div className="grid size-full place-items-center border-2 border-dashed border-primary text-center text-xs font-extrabold text-primary">
                PHONEPE<br />QR CODE<br />
                <span className="mt-1 text-[9px] font-medium text-muted-foreground">Replace with your QR image</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-left">
             <h3 className="mb-2 text-xs font-bold text-primary">Bank Transfer Details</h3>
             <dl className="space-y-1.5 text-[10px] text-muted-foreground sm:text-xs">
                <div className="flex justify-between"><dt>Account Name:</dt><dd className="font-semibold text-primary">{primaryBank?.account_name || "Sarv Abhyudaya Foundation"}</dd></div>
                <div className="flex justify-between"><dt>Bank Name:</dt><dd className="font-semibold text-primary">{primaryBank?.bank_name || "State Bank of India"}</dd></div>
                <div className="flex justify-between"><dt>Account No:</dt><dd className="font-semibold text-primary">{primaryBank?.account_number || "To be configured"}</dd></div>
                <div className="flex justify-between"><dt>IFSC Code:</dt><dd className="font-semibold text-primary">{primaryBank?.ifsc_code || "To be configured"}</dd></div>
             </dl>
          </div>
        </div>
      </section>
    </main>
  )
}
