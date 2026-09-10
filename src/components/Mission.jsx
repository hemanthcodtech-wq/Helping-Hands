import { ArrowRight } from "lucide-react"
import { NavLink } from "react-router-dom"
import { mission } from "../data/content"
import Logo from "./Common/Logo"
import FadeIn from "./Common/FadeIn"

export default function Mission() {
  return (
    <section id="mission" className="relative overflow-hidden px-3 pb-7 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
      <div className="page-shell">
        <Logo className="pointer-events-none absolute -right-4 top-0 w-28 opacity-[0.08] sm:-right-6 sm:top-6 sm:w-40 lg:w-56" aria-hidden="true" />
        <FadeIn className="relative rounded-2xl bg-[#fffdfa] px-3 py-5 sm:rounded-3xl sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <p className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-teal sm:text-[11px]">{mission.eyebrow}</p>
          <h2 className="mt-1.5 max-w-xl font-heading text-[24px] font-extrabold leading-[1.03] text-primary sm:text-3xl lg:text-[40px]">{mission.title}</h2>
          <p className="mt-2 max-w-[560px] text-[10px] leading-[1.65] text-muted-foreground sm:mt-4 sm:text-sm sm:leading-[1.75]">{mission.body}</p>
          <NavLink to="/about" className="mt-3 inline-flex min-h-8 items-center gap-1.5 text-[8px] font-bold text-teal transition hover:gap-2 sm:mt-5 sm:text-[11px]">
            Read More
            <ArrowRight className="size-3 sm:size-4" />
          </NavLink>
        </FadeIn>
      </div>
    </section>
  )
}
