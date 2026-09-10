import Hero from "../components/Hero"
import Stats from "../components/Stats"
import Mission from "../components/Mission"
import Causes from "../components/Causes"
import Impact from "../components/Impact"
import Programs from "../components/Programs"
import VolunteerCTA from "../components/VolunteerCTA"
import SupportMission from "../components/SupportMission"
import Gallery from "../components/Gallery"
import Testimonials from "../components/Testimonials"
import News from "../components/News"
import Partners from "../components/Partners"
import CampaignPopup from "../components/CampaignPopup"

export default function Home() {
  return (
    <main className="public-page home-page">
      <Hero />
      <Stats />
      <Mission />
      <Causes />
      <Impact />
      <Programs />
      <VolunteerCTA />
      <SupportMission />
      <Gallery />
      <Testimonials />
      <News />
      <Partners />
      <CampaignPopup />
    </main>
  )
}
