import { ArrowRight } from "lucide-react"
import { NavLink } from "react-router-dom"
import { causes } from "../data/content"
import Icon from "./Common/Icon"
import FadeIn from "./Common/FadeIn"
import SectionHeading from "./Common/SectionHeading"
import AutoSlider from "./Common/AutoSlider"

export default function Causes() {
  return (
    <section id="causes" className="w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn><SectionHeading>Our Causes</SectionHeading></FadeIn>
        <div className="mt-6 sm:mt-8">
          <AutoSlider duration={28} gap="gap-4 sm:gap-5 lg:gap-6">
            {causes.map((cause, i) => (
              <FadeIn key={cause.id} delay={i * 0.08} className="w-[82vw] max-w-[330px] shrink-0 sm:w-[300px] lg:w-[305px]">
                <article className="group flex h-full min-h-[250px] flex-col rounded-2xl border border-[#eee9df] bg-[#fffdfa] p-5 shadow-[0_6px_20px_rgba(40,63,70,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-6">
                  <span className={`grid size-11 place-items-center rounded-2xl ${cause.color === "accent" ? "bg-accent-soft text-accent" : "bg-primary-soft text-teal"}`}>
                    <Icon name={cause.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-primary sm:text-lg">{cause.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                    {cause.items.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                  <NavLink to="/programs" className={`mt-auto inline-flex min-h-9 items-center gap-1.5 pt-5 text-xs font-bold transition hover:gap-2.5 ${cause.color === "accent" ? "text-accent" : "text-teal"}`}>
                    Learn More <ArrowRight className="size-3.5" />
                  </NavLink>
                </article>
              </FadeIn>
            ))}
          </AutoSlider>
        </div>
      </div>
    </section>
  )
}
