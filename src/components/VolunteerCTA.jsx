import { ArrowRight, Check } from "lucide-react"
import { NavLink } from "react-router-dom"
import { volunteer } from "../data/content"
import FadeIn from "./Common/FadeIn"

export default function VolunteerCTA() {
  return (
    <section id="volunteer" className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn className="relative min-h-[300px] overflow-hidden rounded-3xl bg-teal text-white shadow-lg sm:min-h-[340px]">
          <img src={volunteer.image} alt="Volunteers" className="absolute inset-0 h-full w-full object-cover opacity-45" decoding="async" loading="lazy" />
          <div className="absolute inset-0 bg-teal/80" />
          <div className="relative z-10 flex min-h-[300px] items-center px-5 py-8 sm:min-h-[340px] sm:px-10 sm:py-10 lg:px-14">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-[46px]">{volunteer.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">{volunteer.subtitle}</p>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 text-xs sm:grid-cols-2 sm:gap-3 sm:text-sm">
                {volunteer.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent"><Check className="size-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <NavLink to="/volunteer" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-teal transition hover:bg-accent hover:text-white sm:text-sm">
                Join Now <ArrowRight className="size-4" />
              </NavLink>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
