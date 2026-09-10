import { useState, useEffect } from "react"
import FadeIn from "./Common/FadeIn"
import SectionHeading from "./Common/SectionHeading"
import AutoSlider from "./Common/AutoSlider"

export default function Partners() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("https://helpinghandsbe.vercel.app/api/partners")
        const data = await res.json()
        if (data.success && data.partners.length > 0) {
          setPartners(data.partners)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPartners()
  }, [])

  if (loading || partners.length === 0) return null

  return (
    <section className="w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn><SectionHeading>Our Partners & Sponsors</SectionHeading></FadeIn>
        <div className="mt-6 sm:mt-8">
          <AutoSlider duration={30} gap="gap-4 sm:gap-6">
            {partners.map((partner, i) => (
              <FadeIn key={`partner-${partner.id}-${i}`} delay={i * 0.05} className="w-[160px] shrink-0 sm:w-[220px]">
                {partner.website_url ? (
                  <a href={partner.website_url} target="_blank" rel="noreferrer" className="block outline-none focus-visible:ring-2 focus-visible:ring-teal">
                    <div className="flex h-24 items-center justify-center rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:scale-105 hover:border-teal hover:shadow-md sm:h-32 sm:rounded-3xl sm:p-6">
                      {partner.image_url ? (
                        <img src={partner.image_url} alt={partner.name} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-center text-xs font-bold text-muted-foreground sm:text-sm">{partner.name}</span>
                      )}
                    </div>
                  </a>
                ) : (
                  <div className="flex h-24 items-center justify-center rounded-2xl border border-border bg-card p-4 shadow-sm sm:h-32 sm:rounded-3xl sm:p-6">
                    {partner.image_url ? (
                      <img src={partner.image_url} alt={partner.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-center text-xs font-bold text-muted-foreground sm:text-sm">{partner.name}</span>
                    )}
                  </div>
                )}
              </FadeIn>
            ))}
          </AutoSlider>
        </div>
      </div>
    </section>
  )
}
