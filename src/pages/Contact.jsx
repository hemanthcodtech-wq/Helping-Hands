import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Mail, MapPin, Phone } from "lucide-react"
import FadeIn from "../components/Common/FadeIn"
import { useApp } from "../context/AppContext"

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const { globalSettings } = useApp()
  const s = globalSettings || {}

  const CONTACT_INFO = [
    { icon: MapPin, label: "Address", value: s.contactFullAddress || "H.No: 4-187/4, Ambabhavani Pet, Gowli Pet, Adoni – 518301, Kurnool District, A.P." },
    { icon: Phone, label: "Phone", value: s.contactPhonePrimary || "+91 77993 73766" },
    { icon: Mail, label: "Email", value: s.contactEmail || "helpinghandsffoundation@gmail.com" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-primary-soft">
        <div className="page-shell px-3 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-teal sm:text-[11px]">Get In Touch</p>
            <h1 className="font-heading text-[32px] font-extrabold leading-[1.04] tracking-[-0.03em] text-primary sm:text-5xl lg:text-[56px]">
              Contact Us
            </h1>
            <p className="mt-3 text-[10px] leading-[1.65] text-muted-foreground sm:mt-5 sm:text-sm lg:text-[15px]">
              Have a question, want to partner with us, or just want to say hello? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards + Form */}
      <section className="page-shell px-3 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-10">
          {/* Info */}
          <FadeIn className="space-y-3 sm:space-y-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-teal sm:size-11">
                  <Icon className="size-4 sm:size-5" />
                </span>
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px]">{label}</p>
                  <p className="mt-0.5 text-[9px] font-medium text-primary sm:text-sm">{value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5">
              <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px]">Office Hours</p>
              <p className="mt-1 text-[9px] text-primary sm:text-sm">{s.contactWorkingHours || "Mon – Sat: 9:00 AM – 6:00 PM"}</p>
            </div>
          </FadeIn>
          
          {s.googleMapEmbedUrl && (
            <FadeIn delay={0.2} className="mt-6 w-full overflow-hidden rounded-2xl border border-border sm:mt-8">
              <div dangerouslySetInnerHTML={{ __html: s.googleMapEmbedUrl.replace('width="600"', 'width="100%"').replace('height="450"', 'height="300"') }} className="w-full" />
            </FadeIn>
          )}

          {/* Form */}
          <FadeIn delay={0.1}>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:rounded-3xl sm:p-8">
              <h2 className="font-heading text-[18px] font-bold text-primary sm:text-2xl">Send a Message</h2>
              <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Full Name</label>
                  <input type="text" required placeholder="Your name" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:py-3 sm:text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Email</label>
                  <input type="email" required placeholder="your@email.com" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:py-3 sm:text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Phone (optional)</label>
                  <input type="tel" placeholder="+91 00000 00000" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:py-3 sm:text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Subject</label>
                  <select className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary focus:border-teal focus:outline-none sm:rounded-2xl sm:py-3 sm:text-sm">
                    <option>General Inquiry</option>
                    <option>Donation</option>
                    <option>Volunteering</option>
                    <option>Partnership</option>
                    <option>Media</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Message</label>
                  <textarea rows={4} required placeholder="How can we help you?" className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm" />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-[10px] font-bold text-white transition hover:bg-teal-dark active:scale-[0.98] sm:mt-6 sm:rounded-2xl sm:py-4 sm:text-sm"
              >
                {submitted ? <><Check className="size-4" /> Message Sent!</> : "Send Message"}
              </button>
            </form>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
