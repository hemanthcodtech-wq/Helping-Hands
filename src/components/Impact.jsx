import { useEffect, useRef, useState } from "react"
import { impact } from "../data/content"
import Icon from "./Common/Icon"
import FadeIn from "./Common/FadeIn"

function CountUp({ value }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const match = String(value).match(/([\d,]+)(.*)/)
  const target = match ? Number(match[1].replace(/,/g, "")) : 0
  const suffix = match ? match[2] : ""

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.35 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let frame
    const start = performance.now()
    const duration = 1800
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(target * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
      else setCount(target)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [started, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function Impact() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn className="rounded-3xl bg-primary-soft px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className="h-px w-8 bg-teal/40 sm:w-12" />
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-teal sm:text-xs">{impact.title}</h2>
            <span className="h-px w-8 bg-teal/40 sm:w-12" />
          </div>
          <div className="mt-7 grid grid-cols-2 gap-y-8 sm:mt-9 sm:grid-cols-4 sm:gap-6">
            {impact.stats.map((stat, i) => (
              <FadeIn key={stat.id} delay={i * 0.08} className="flex flex-col items-center text-center">
                <span className="grid size-11 place-items-center rounded-full bg-card text-teal shadow-sm sm:size-14">
                  <Icon name={stat.icon} className="size-5 sm:size-6" />
                </span>
                <span className="mt-2 font-heading text-xl font-extrabold text-primary sm:mt-3 sm:text-2xl"><CountUp value={stat.value} /></span>
                <span className="mt-1 text-[10px] text-muted-foreground sm:text-xs">{stat.label}</span>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
