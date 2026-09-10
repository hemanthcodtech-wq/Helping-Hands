import { ArrowRight } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import FadeIn from "./Common/FadeIn"
import SectionHeading from "./Common/SectionHeading"

export default function Programs() {
  const [programsList, setProgramsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/programs")
        const data = await res.json()
        if (data.success) {
          // You might want to limit to the first 3 or 6 on the homepage
          setProgramsList(data.programs.slice(0, 3))
        }
      } catch (err) {
        console.error("Failed to fetch programs:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  return (
    <section id="programs" className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn><SectionHeading>Our Programs</SectionHeading></FadeIn>
        
        {loading ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">Loading programs...</p>
        ) : programsList.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">No programs found.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {programsList.map((program, i) => (
              <FadeIn key={program.id} delay={i * 0.1} className="w-full">
                <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={program.image_url || "/images/placeholder.jpg"} alt={program.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" decoding="async" loading="lazy" />
                    {program.category && <span className="absolute left-3 top-3 rounded-full bg-teal px-2.5 py-1 text-[8px] font-bold text-white sm:text-[9px]">{program.category}</span>}
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-primary sm:text-base">{program.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-[13px] line-clamp-3 flex-1">{program.description}</p>
                    <NavLink to="/programs" className="mt-4 inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-teal transition hover:gap-2.5">Learn More <ArrowRight className="size-3.5" /></NavLink>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
