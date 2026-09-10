import { useEffect, useState } from "react"
import { Quote, Star } from "lucide-react"
import { testimonials as staticTestimonials } from "../data/content"
import FadeIn from "./Common/FadeIn"

const SLOT_STYLES = {
  center: { x: 0, z: 40, scale: 1, opacity: 1 },
  left1: { x: -270, z: 30, scale: 0.9, opacity: 0.72 },
  left2: { x: -510, z: 20, scale: 0.8, opacity: 0.48 },
  right1: { x: 270, z: 30, scale: 0.9, opacity: 0.72 },
  right2: { x: 510, z: 20, scale: 0.8, opacity: 0.48 },
  hidden: { x: 0, z: 0, scale: 0.65, opacity: 0 },
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/testimonials")
        const data = await res.json()
        if (data.success && data.testimonials.length > 0) {
          setTestimonials(data.testimonials)
        } else {
          setTestimonials(staticTestimonials)
        }
      } catch (err) {
        console.error(err)
        setTestimonials(staticTestimonials)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (testimonials.length === 0) return
    const timer = setInterval(() => setActive((current) => (current + 1) % testimonials.length), 3600)
    return () => clearInterval(timer)
  }, [testimonials])

  const getSlot = (index) => {
    const count = testimonials.length
    if (count === 0) return "hidden"
    const offset = (index - active + count) % count
    if (offset === 0) return "center"
    if (offset === 1) return "right1"
    if (offset === 2) return "right2"
    if (offset === count - 1) return "left1"
    if (offset === count - 2) return "left2"
    return "hidden"
  }

  if (loading || testimonials.length === 0) return null

  return (
    <section className="w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 bg-[#fafafa]">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary sm:text-lg">What People Say</h2>
        </FadeIn>

        <div className="relative mx-auto mt-7 h-[355px] w-full max-w-[1260px] [perspective:1400px] sm:mt-9 sm:h-[330px]">
          {testimonials.map((item, index) => {
            const slot = getSlot(index)
            const style = SLOT_STYLES[slot]
            const visible = slot !== "hidden"

            return (
              <article
                key={item.id}
                onClick={() => visible && setActive(index)}
                aria-hidden={!visible}
                style={{
                  transform: `translate3d(calc(-50% + ${style.x}px), -50%, ${slot === "center" ? 0 : -Math.abs(style.x) / 3}px) scale(${style.scale})`,
                  opacity: style.opacity,
                  zIndex: style.z,
                }}
                className={`absolute left-1/2 top-1/2 h-[250px] w-[min(82vw,440px)] rounded-3xl border border-border bg-[#fffdfa] p-6 shadow-xl [transform-style:preserve-3d] transition-[transform,opacity] duration-[850ms] ease-[cubic-bezier(.22,.61,.36,1)] sm:h-[260px] sm:w-[440px] sm:p-7 ${visible ? "cursor-pointer" : "pointer-events-none invisible"} ${slot === "center" ? "shadow-2xl" : ""}`}
              >
                <Quote className="size-7 text-teal/50 sm:size-8" aria-hidden="true" />
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground sm:text-[15px] sm:leading-7">{item.quote}</p>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-border/60 pt-4 sm:bottom-7 sm:left-7 sm:right-7">
                  <div className="flex items-center gap-3">
                    <div className="size-9 overflow-hidden rounded-full border border-border bg-gray-100 sm:size-10">
                      {item.image_url || item.avatar ? (
                        <img src={item.image_url || item.avatar} alt={item.name} className="size-full object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center font-bold text-gray-400">{item.name.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary sm:text-sm">{item.name}</p>
                      <p className="text-[10px] font-semibold tracking-wider text-muted-foreground sm:text-[11px]">{item.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-0.5" aria-label={`Rating: ${item.rating || 5} stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`size-3 sm:size-3.5 ${i < (item.rating || 5) ? "fill-[#EF9A0A] text-[#EF9A0A]" : "fill-gray-200 text-gray-200"}`} />
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
