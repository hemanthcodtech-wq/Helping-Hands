import { motion } from "framer-motion"
import { HandHeart, Heart } from "lucide-react"
import { NavLink } from "react-router-dom"
import { hero } from "../data/content"

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden home-hero">
      <div className="page-shell grid items-center gap-8 px-4 py-10 sm:grid-cols-[0.95fr_1.05fr] sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-8 lg:py-16 xl:gap-16 xl:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center sm:text-left"
        >
          <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.18em] text-white/75 sm:mb-4 sm:text-[11px]">
            Helping Hands Foundation
          </p>
          <h1 className="font-heading mx-auto max-w-[620px] text-[clamp(2.25rem,7vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:mx-0 lg:text-[64px]">
            Together,
            <br />
            We Can
            <br />
            Change Lives
          </h1>
          <p className="mx-auto mt-4 max-w-[500px] text-sm leading-[1.7] text-white/80 sm:mx-0 sm:mt-5 sm:text-base lg:mt-6 lg:text-[15px] lg:leading-[1.7]">
            {hero.subtitle}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5 sm:mt-7 sm:justify-start sm:gap-3 lg:mt-8">
            <NavLink to="/donate" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-[10px] font-bold text-white shadow-lg transition hover:brightness-95 active:scale-95 sm:px-5 sm:text-[11px]">
              Donate Now <Heart className="size-3.5 fill-current sm:size-4" />
            </NavLink>
            <NavLink to="/volunteer" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-white/50 bg-white/10 px-4 py-2.5 text-[10px] font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-primary active:scale-95 sm:px-5 sm:text-[11px]">
              Become Volunteer <HandHeart className="size-3.5 sm:size-4" />
            </NavLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[560px] sm:mx-0 sm:max-w-none"
        >
          <div className="mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-[48%_52%_42%_58%/42%_43%_57%_58%] bg-white/15 p-1 shadow-2xl ring-1 ring-white/20 lg:aspect-[5/4] lg:max-h-[430px]">
            <img alt="Smiling child" src={hero.image} className="h-full w-full rounded-[inherit] object-cover object-center" decoding="async" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
