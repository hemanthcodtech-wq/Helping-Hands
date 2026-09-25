import { useState } from "react"
import { NavLink } from "react-router-dom"
import { ChevronDown, ChevronUp, Heart, MessageCircle, Music2, Phone, ShieldCheck, UserRound } from "lucide-react"
import { useApp } from "../context/AppContext"

const COLUMNS = [
  { title: "ABOUT US", links: [["About Organization", "/about"], ["Leadership Desk", "/about/leadership"], ["Our Team", "/teams"], ["Volunteers", "/volunteer"], ["Legal Terms", "/about/legal-terms"]] },
  { title: "OUR WORK", links: [["Programs", "/programs"], ["Education", "/programs"], ["Healthcare", "/programs"], ["Food Distribution", "/programs"], ["Women Empowerment", "/programs"]] },
  { title: "CAMPAIGNS", links: [["Every Child Deserves Education", "/campaigns"], ["Healthy Communities", "/campaigns"], ["Meals With Dignity", "/campaigns"], ["Women Empowerment Initiative", "/campaigns"], ["All Campaigns", "/campaigns"]] },
  { title: "GET INVOLVED", links: [["Donate", "/donate"], ["Become a Member", "/support-us"], ["Volunteer Registration", "/volunteer"], ["Support Us", "/support-us"], ["Partner With Us", "/contact"]] },
  { title: "RESOURCE CENTRE", links: [["Reports", "/about/reports"], ["Certificates", "/about/certificates"], ["Photos", "/resources/photos"], ["Videos", "/resources/videos"], ["Achievements & Awards", "/resources/achievements-awards"], ["Press Stories", "/resources/press-stories"], ["Events", "/events"]] },
]

function FooterColumn({ title, links }) {
  return <div><h3 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-white sm:text-[14px]">{title}</h3><ul className="mt-5 space-y-3">{links.map(([label, to]) => <li key={`${title}-${label}`}><NavLink to={to} className="text-[10px] leading-5 text-white/75 transition hover:text-[#ffb74d] sm:text-[14px]">{label}</NavLink></li>)}</ul></div>
}

function MobileColumn({ title, links }) {
  const [open, setOpen] = useState(false)
  return <div className="border-b border-white/10"><button type="button" onClick={() => setOpen(v => !v)} className="flex min-h-12 w-full items-center justify-between text-left text-[10px] font-extrabold uppercase tracking-[0.12em] text-white">{title}{open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}</button>{open && <div className="overflow-hidden pb-3"><ul className="space-y-2">{links.map(([label, to]) => <li key={`${title}-${label}`}><NavLink to={to} className="text-xs text-white/70 hover:text-[#ffb74d]">{label}</NavLink></li>)}</ul></div>}</div>
}

export default function Footer() {
  const { globalSettings, bankAccounts } = useApp()
  const s = globalSettings || {}
  const phonePrimary = s.contactPhonePrimary || "+91 77993 73766"
  const phoneWhatsApp = "+91 70934 26966"
  const emailPrimary = s.contactEmail || "helpinghandsffoundation@gmail.com"
  const addressHead = "H.No: 4/211/2, SHAKTHI GUDI, ADONI 518301, ADONI MANDAL, KURNOOL DISTRICT, A.P."
  const addressPresent = s.contactFullAddress || "H.No: 4-187/4, AMBABHAVANI PET, GOWLI PET, ADONI 518301, ADONI MANDAL, KURNOOL DISTRICT, A.P."
  const workingHours = s.contactWorkingHours || "Mon – Sat: 10:00 – 18:00"
  const siteTitle = s.siteTitle || "Helping Hands Foundation"

  const primaryBank = (bankAccounts || []).find(b => b.is_active) || null

  return <>
    <footer id="footer" className="relative mt-0 overflow-hidden bg-[#04458F] text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-9 sm:px-10 lg:px-16 lg:py-14">
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-10">{COLUMNS.map(column => <FooterColumn key={column.title} {...column} />)}</div>
        <div className="lg:hidden">{COLUMNS.map(column => <MobileColumn key={column.title} {...column} />)}</div>
      </div>
      <div className="border-t border-white/15"><div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-8 sm:px-10 lg:grid-cols-[1.05fr_1.45fr_.65fr] lg:gap-12 lg:px-16 lg:py-10">
        <div><h3 className="text-base font-extrabold sm:text-lg">{siteTitle}</h3><p className="mt-3 text-xs leading-6 text-white/75 sm:text-sm">{s.metaDescription || "Helping communities through education, healthcare, food support and empowerment."}</p><p className="mt-3 text-xs leading-6 text-white/75 sm:text-sm">Head Office: {addressHead}</p><p className="mt-1 text-xs leading-6 text-white/75 sm:text-sm">Working Present: {addressPresent}</p><p className="mt-1 text-xs leading-6 text-white/75 sm:text-sm">Calling: {phonePrimary}</p><p className="mt-1 text-xs leading-6 text-white/75 sm:text-sm">WhatsApp: {phoneWhatsApp}</p><p className="mt-1 text-xs leading-6 text-white/75 sm:text-sm">Email: {emailPrimary}</p><p className="mt-2 text-xs text-white/75 sm:text-sm">{workingHours}</p></div>
        <div className="flex items-start"><p className="max-w-[650px] text-sm leading-7 text-white/75 sm:text-base">Helping Hands Foundation works with communities to create lasting opportunities for children, women, families and vulnerable groups across India.</p></div>
        <div className="lg:justify-self-end"><p className="flex items-center gap-2 text-sm font-extrabold">▦ Scan to Support Us</p>
          {primaryBank && primaryBank.qr_code_url ? (
            <div className="mt-4 grid size-36 place-items-center rounded-xl bg-white p-2">
              <img src={primaryBank.qr_code_url} alt="QR Code" className="size-full object-contain" />
            </div>
          ) : (
            <div className="mt-4 grid size-36 place-items-center rounded-xl border-4 border-[#ffb74d] bg-white text-center text-xs font-bold text-[#04458F]">QR<br />SUPPORT</div>
          )}
          <NavLink to="/donate" className="mt-5 inline-flex min-h-11 w-40 items-center justify-center gap-2 rounded-full bg-[#ff9700] px-5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#f38a00]"><Heart className="size-4 fill-current" /> Donate Now</NavLink><a href={`tel:${phonePrimary.replace(/[^\d+]/g, '')}`} className="mt-3 flex items-center gap-2 text-sm text-white/80"><Phone className="size-4 text-[#5E922C]" /> {phonePrimary}</a></div>
      </div></div>
      <div className="border-t border-white/15 bg-[#033a78]"><div className="mx-auto flex max-w-[1600px] flex-col items-center gap-3 px-5 py-4 text-center text-xs text-white/65 sm:px-10 lg:flex-row lg:justify-center lg:gap-5"><span>© {new Date().getFullYear()} {siteTitle} | All Rights Reserved</span><NavLink to="/about/terms" className="hover:text-white">Terms &amp; Conditions</NavLink><NavLink to="/about/privacy" className="hover:text-white">Privacy Policy</NavLink><NavLink to="/about/disclaimer" className="hover:text-white">Disclaimer</NavLink><NavLink to="/about/refund" className="hover:text-white">Refund Policy</NavLink></div></div>
    </footer>
    <FloatingActions s={s} />
  </>
}

function FloatingActions({ s }) {
  const phoneWhatsApp = "+91 70934 26966"
  const waLink = `https://wa.me/${phoneWhatsApp.replace(/[^\d]/g, '')}`

  return <>
    <a href={waLink} target="_blank" rel="noreferrer" className="fixed bottom-4 right-4 z-[180] grid size-14 place-items-center rounded-full bg-[#00d96b] text-white shadow-[0_10px_30px_rgba(0,0,0,.28)] transition hover:scale-105 lg:hidden" aria-label="WhatsApp support"><MessageCircle className="size-7" /></a>
    <div className="pointer-events-none fixed bottom-5 left-0 right-0 z-[180] hidden lg:flex items-end justify-between px-5 xl:px-8">
      <div className="pointer-events-auto flex items-center gap-3">
        <NavLink to="/volunteer" className="grid size-14 place-items-center rounded-full bg-[#ff9700] text-white shadow-xl transition hover:scale-105" title="Volunteer"><UserRound className="size-6" /></NavLink>
        <NavLink to="/support-us" className="grid size-14 place-items-center rounded-full bg-[#173d73] text-white shadow-xl transition hover:scale-105" title="Get Support"><ShieldCheck className="size-6" /></NavLink>
        <NavLink to="/donate" className="grid size-14 place-items-center rounded-full bg-[#ff9700] text-white shadow-xl transition hover:scale-105" title="Donate"><Heart className="size-6 fill-current" /></NavLink>
      </div>
      <div className="pointer-events-auto flex items-center gap-3">
        <a href={waLink} target="_blank" rel="noreferrer" className="grid size-14 place-items-center rounded-full bg-[#00d96b] text-white shadow-xl transition hover:scale-105" title="WhatsApp"><MessageCircle className="size-6" /></a>
        <button type="button" className="grid size-14 place-items-center rounded-full bg-[#ff9700] text-white shadow-xl transition hover:scale-105" title="Music" aria-label="Music"><Music2 className="size-6" /></button>
      </div>
    </div>
  </>
}
