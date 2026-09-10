import { useState } from "react"
import { Heart } from "lucide-react"
import { NavLink } from "react-router-dom"
import { donationTiers } from "../data/content"
import Logo from "./Common/Logo"
import FadeIn from "./Common/FadeIn"

export default function SupportMission() {
  const [selected, setSelected] = useState(donationTiers[0].id)

  return (
    <section id="support" className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn className="relative overflow-hidden rounded-3xl bg-teal-dark p-6 text-white shadow-lg sm:p-10 lg:p-12">
          <Logo variant="light" className="pointer-events-none absolute right-4 top-4 w-20 opacity-10 sm:right-7 sm:top-7 sm:w-32" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-[44px]">Support Our Mission</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">Every contribution helps us reach another family in need.</p>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {donationTiers.map((tier) => {
                const active = selected === tier.id
                return (
                  <button key={tier.id} type="button" onClick={() => setSelected(tier.id)} aria-pressed={active} className={`min-h-[84px] rounded-xl border p-4 text-center transition active:scale-[.98] sm:min-h-24 sm:rounded-2xl ${active ? "border-accent bg-accent/20" : "border-white/25 bg-white/10 hover:bg-white/15"}`}>
                    <span className="block text-base font-extrabold sm:text-lg">{tier.amount}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/80">{tier.label}</span>
                  </button>
                )
              })}
            </div>
            <NavLink to="/donate" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent/90 sm:w-auto sm:min-w-48">
              <Heart className="size-4" /> Donate Securely
            </NavLink>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
