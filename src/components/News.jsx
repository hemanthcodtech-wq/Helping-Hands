import { ArrowRight, Calendar } from "lucide-react"
import { news } from "../data/content"
import FadeIn from "./Common/FadeIn"
import AutoSlider from "./Common/AutoSlider"

export default function News() {
  return (
    <section id="news" className="w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn><h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary sm:text-lg">Latest News & Events</h2></FadeIn>
        <div className="mt-6 sm:mt-8">
          <AutoSlider duration={30} gap="gap-5 sm:gap-6">
            {news.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.08} className="w-[86vw] max-w-[380px] shrink-0 sm:w-[340px] lg:w-[365px]">
                <article className="group h-full overflow-hidden rounded-3xl border border-border bg-card shadow-[0_8px_25px_rgba(6,29,73,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" decoding="async" loading="lazy" />
                    {item.tag && <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[9px] font-bold text-white">{item.tag}</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold leading-snug text-primary sm:text-lg">{item.title}</h3>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="size-3.5" />{item.date}</p>
                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">{item.excerpt}</p>
                    <a href="#" className="mt-4 inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-teal transition hover:gap-2.5">Read More <ArrowRight className="size-3.5" /></a>
                  </div>
                </article>
              </FadeIn>
            ))}
          </AutoSlider>
        </div>
      </div>
    </section>
  )
}
