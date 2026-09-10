import { useEffect, useRef, useState } from "react"
import { stats } from "../data/content"
import Icon from "./Common/Icon"
import FadeIn from "./Common/FadeIn"

function CountUp({ value }) {
  const [display, setDisplay] = useState("0")
  const ref = useRef(null)

  useEffect(() => {
    const match = String(value).match(/^(.*?)([\d,]+)(.*)$/)
    if (!match) {
      setDisplay(value)
      return
    }

    const [, prefix, numeric, suffix] = match
    const target = Number(numeric.replace(/,/g, ""))
    let frame
    let start
    const duration = 1500

    const step = (time) => {
      if (!start) start = time
      const progress = Math.min((time - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(target * eased)
      setDisplay(`${prefix}${current.toLocaleString("en-IN")}${suffix}`)
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        frame = requestAnimationFrame(step)
        observer.disconnect()
      }
    }, { threshold: 0.35 })

    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [value])

  return <span ref={ref}>{display}</span>
}

export default function Stats() {
  return (
    <section aria-label="Foundation stats" className="w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn className="rounded-2xl border border-border/70 bg-white p-2 shadow-[0_10px_30px_rgba(6,29,73,0.07)] sm:rounded-3xl sm:p-4 lg:p-5">
          <div className="grid grid-cols-2 gap-1 sm:gap-3 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <FadeIn key={stat.id} delay={i * 0.08} className="flex min-h-[92px] items-center gap-3 rounded-xl px-3 py-4 sm:min-h-[108px] sm:gap-4 sm:rounded-2xl sm:px-5 sm:py-5">
                <span className={`grid size-10 shrink-0 place-items-center rounded-full text-white sm:size-12 ${stat.color === "accent" ? "bg-accent" : "bg-primary"}`}>
                  <Icon name={stat.icon} className="size-4 sm:size-5" />
                </span>
                <span className="leading-tight">
                  <span className="block font-heading text-lg font-extrabold text-primary sm:text-xl lg:text-2xl"><CountUp value={stat.value} /></span>
                  <span className="mt-1 block text-[10px] text-muted-foreground sm:text-xs">{stat.label}</span>
                </span>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
