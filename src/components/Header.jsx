import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown, Zap, Phone, Heart, LogIn, UserRound } from "lucide-react"
import { useApp } from "../context/AppContext"

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about", dropdown: true, menu: [
    { label: "About Us", to: "/about" }, { label: "Leadership", to: "/about/leadership" }, { label: "Reports", to: "/about/reports" },
    { label: "Certificates", to: "/about/certificates", nested: true, children: [
      { label: "Registration", to: "/about/certificates/registration" }, { label: "12A", to: "/about/certificates/12a" }, { label: "80G", to: "/about/certificates/80g" }, { label: "NGO Darpan", to: "/about/certificates/ngo-darpan" }
    ]}, { label: "Legal & Terms", to: "/about/terms" }
  ]},
  { label: "Programs", to: "/programs" }, { label: "Campaigns", to: "/campaigns" },
  { label: "Teams", to: "/teams", dropdown: true, menu: [
    { label: "All Teams", to: "/teams" }, { label: "Management Team", to: "/teams/management" }, { label: "General Members", to: "/teams/members" }, { label: "Valued Donors", to: "/teams/donors" }, { label: "Volunteers", to: "/teams/volunteers" }
  ]},
  { label: "Events & News", to: "/events", dropdown: true, menu: [{ label: "Upcoming Events", to: "/events#upcoming" }, { label: "News & Updates", to: "/events#news" }]},
  { label: "Resources", to: "/resources", dropdown: true, menu: [{ label: "Photos", to: "/resources/photos" }, { label: "Videos", to: "/resources/videos" }, { label: "Achievements & Awards", to: "/resources/achievements-awards" }, { label: "Press & Stories", to: "/resources/press-stories" }]},
  { label: "Support Us", to: "/support-us", dropdown: true, menu: [{ label: "Donate", to: "/donate" }, { label: "Volunteer Registration", to: "/volunteer" }, { label: "Certificates", to: "/about/certificates" }, { label: "Campaigns", to: "/campaigns" }]},
  { label: "Contact", to: "/contact" }
]

const LOGO_URL = "https://res.cloudinary.com/dwmjz9csc/image/upload/v1786889497/9ec8064b-61d9-4e70-897d-4790e9ea2cdf-removebg-preview_ogtw6d.png"
const NEWS_ITEMS = ["Helping communities. Creating hope.", "Volunteer with Helping Hands and make an impact.", "Every contribution helps us reach another family in need."]
const SOCIAL_LINKS = [{ label: "Facebook", type: "facebook" }, { label: "Instagram", type: "instagram" }, { label: "YouTube", type: "youtube" }]

function SocialIcon({ type }) {
  if (type === "facebook") return <svg viewBox="0 0 24 24" className="size-3 sm:size-4" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.2Z" /></svg>
  if (type === "instagram") return <svg viewBox="0 0 24 24" className="size-3 sm:size-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
  return <svg viewBox="0 0 24 24" className="size-3 sm:size-4" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a31 31 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.8V8.2l6.3 3.8-6.3 3.8Z" /></svg>
}

function Dropdown({ link }) {
  const [open, setOpen] = useState(false)
  const [nestedOpen, setNestedOpen] = useState(false)
  const { pathname } = useLocation()
  const active = pathname === link.to || pathname.startsWith(`${link.to}/`)
  return <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => { setOpen(false); setNestedOpen(false) }}>
    <NavLink to={link.to} className={`${active ? "text-teal" : "text-primary hover:text-teal"} inline-flex items-center gap-1 text-sm font-semibold`}>{link.label}<ChevronDown className="size-3.5" /></NavLink>
    <div className={`absolute left-1/2 top-full z-[120] pt-3 w-64 -translate-x-1/2 transition-all duration-200 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
      <div className="rounded-2xl border border-border bg-card p-2 shadow-xl">
        {link.menu.map(item => item.nested ? <div key={item.to} className="relative" onMouseEnter={() => setNestedOpen(true)}>
          <NavLink to={item.to} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft">{item.label}<ChevronDown className="size-3 rotate-[-90deg]" /></NavLink>
          {nestedOpen && <div className="absolute left-full top-0 pl-2 w-52"><div className="rounded-2xl border border-border bg-card p-2 shadow-xl">{item.children.map(c => <NavLink key={c.to} to={c.to} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft">{c.label}</NavLink>)}</div></div>}
        </div> : <NavLink key={item.to} to={item.to} className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-primary-soft text-teal" : "text-primary hover:bg-primary-soft"}`}>{item.label}</NavLink>)}
      </div>
    </div>
  </div>
}

function LoginDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const { loggedInMember, loggedInVolunteer, isAdminLoggedIn } = useApp()

  if (loggedInMember) {
    return (
      <NavLink to="/member" onClick={onNavigate} className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full border-2 border-[#04458F] bg-[#04458F] px-2.5 py-2 text-white shadow-sm transition hover:bg-[#033a78] sm:gap-1.5 sm:px-4 sm:py-2.5">
        <UserRound className="size-4 sm:size-5" /><span className="hidden sm:inline text-sm font-extrabold">My Dashboard</span>
      </NavLink>
    )
  }

  return <div className="relative shrink-0" onMouseLeave={() => setOpen(false)}>
    <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-haspopup="menu" className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full border-2 border-[#04458F] bg-white px-2.5 py-2 text-[#04458F] shadow-sm transition hover:bg-[#eaf2fb] sm:gap-1.5 sm:px-4 sm:py-2.5">
      <LogIn className="size-4 sm:size-5" /><span className="hidden sm:inline text-sm font-extrabold">Login</span><ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    <div className={`absolute right-0 top-full z-[150] pt-2 w-48 transition-all ${open ? "visible opacity-100" : "invisible -translate-y-1 opacity-0"}`} role="menu">
      <div className="rounded-2xl border border-border bg-white p-2 shadow-xl">
        <NavLink to="/member/login" onClick={() => { setOpen(false); onNavigate?.() }} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft">Member Login</NavLink>
        <NavLink to="/volunteer/login" onClick={() => { setOpen(false); onNavigate?.() }} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft">Volunteer Login</NavLink>
        <NavLink to="/admin/login" onClick={() => { setOpen(false); onNavigate?.() }} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft">Admin Login</NavLink>
      </div>
    </div>
  </div>
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState(null)
  const [mobileNested, setMobileNested] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { globalSettings } = useApp()

  const s = globalSettings || {}
  const activeLogo = s.headerLogoUrl || LOGO_URL
  const phonePrimary = s.contactPhonePrimary || "+91 9818398199"

  useEffect(() => { setMobileOpen(false); setMobileDropdown(null); setMobileNested(false) }, [pathname])
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll) }, [])

  const mobileLinkClass = ({ isActive }) => `block min-w-0 rounded-xl px-3 py-3 text-[13px] font-semibold leading-5 ${isActive ? "bg-primary-soft text-teal" : "text-primary hover:bg-primary-soft"}`

  return <>
    {/* Top information bar intentionally scrolls away. It is NOT an ancestor of the sticky header. */}
    <div className="relative z-[70] w-full max-w-full overflow-x-clip border-b border-[#04458F]/20 bg-white text-[#061D49]">
      <div className="flex min-h-10 w-full min-w-0 items-stretch sm:min-h-11">
        <div className="flex shrink-0 items-center gap-2 bg-gradient-to-r from-[#196823] to-[#5E922C] px-2 text-white sm:gap-3 sm:px-5 lg:px-6">{SOCIAL_LINKS.map(({ label, type }) => <span key={label} title={label}><SocialIcon type={type} /></span>)}</div>
        <div className="flex min-w-0 flex-1 items-center overflow-hidden bg-white">
          <div className="flex h-full shrink-0 items-center gap-1 border-y border-[#04458F]/20 px-1.5 py-1 text-[9px] font-bold sm:gap-2 sm:px-2.5 sm:text-xs"><Zap className="size-3 shrink-0 text-[#EF9A0A]" /><span className="text-[#EF9A0A]">Latest</span></div>
          <div className="news-marquee-viewport min-w-0"><div className="news-marquee-track">{[...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => <span key={`${item}-${i}`} className="inline-flex shrink-0 items-center text-[9px] text-[#061D49] sm:text-sm"><span>{item}</span><span className="mx-4 text-[#04458F] sm:mx-8">•</span></span>)}</div></div>
        </div>
        <a href={`tel:${phonePrimary.replace(/[^\d+]/g, '')}`} className="flex shrink-0 items-center gap-1 bg-gradient-to-r from-[#196823] to-[#5E922C] px-2 text-[9px] font-semibold text-white sm:gap-2 sm:px-5 sm:text-sm"><Phone className="size-2.5 shrink-0 sm:size-3" /><span className="hidden min-[400px]:inline">{phonePrimary}</span><span className="min-[400px]:hidden">Call</span></a>
      </div>
    </div>

    {/* Sticky header is a sibling of the top bar, so its sticky containing block is the page, not the short header wrapper. */}
    <header className={`sticky top-0 z-[100] w-full max-w-full border-b border-border bg-card/95 backdrop-blur-md transition-shadow ${scrolled ? "shadow-md" : ""}`}>
      <div className="flex h-[68px] w-full min-w-0 items-center justify-between gap-1 px-2 sm:h-[82px] sm:gap-2 sm:px-5 lg:h-[97px] lg:px-6">
        <button type="button" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle navigation" className="order-first grid size-9 shrink-0 place-items-center rounded-xl text-teal lg:hidden"><span className="relative size-5"><Menu className={`absolute inset-0 size-5 ${mobileOpen ? "opacity-0" : "opacity-100"}`} /><X className={`absolute inset-0 size-5 ${mobileOpen ? "opacity-100" : "opacity-0"}`} /></span></button>
        <NavLink to="/" className="group flex min-w-0 max-w-[calc(100%-175px)] shrink items-center gap-1 sm:max-w-none sm:gap-3"><span className="grid size-12 shrink-0 place-items-center sm:size-18 lg:size-24"><img src={activeLogo} alt={s.siteTitle || "Helping Hands Foundation"} className="size-10 object-contain sm:size-16 lg:size-21" /></span><span className="min-w-0 leading-none"><span className="block truncate font-heading text-[9px] font-extrabold text-primary sm:text-[14px] lg:text-[16px]">{s.siteTitle || "HELPING HANDS"}</span><span className="mt-1 block truncate text-[5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:text-[9px] lg:text-[10px]">{s.siteSubtitle || "Foundation"}</span></span></NavLink>
        <nav className="hidden min-w-0 items-center gap-5 xl:gap-7 lg:flex" aria-label="Primary">{NAV_LINKS.map(link => link.dropdown ? <Dropdown key={link.to} link={link} /> : <NavLink key={link.to} to={link.to} className={({ isActive }) => `whitespace-nowrap text-sm font-semibold ${isActive ? "text-teal" : "text-primary hover:text-teal"}`}>{link.label}</NavLink>)}</nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2"><LoginDropdown onNavigate={() => setMobileOpen(false)} /><NavLink to="/donate" aria-label="Donate" title="Donate" className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-[#ff9700] px-2.5 py-2 text-white shadow-sm transition hover:bg-[#f28c00] sm:gap-1.5 sm:px-4 sm:py-2.5"><Heart className="size-4 fill-current sm:size-5" /><span className="hidden sm:inline text-sm font-extrabold">Donate</span></NavLink></div>
      </div>

      <div className={`fixed inset-0 z-[200] lg:hidden ${mobileOpen ? "visible" : "invisible pointer-events-none"}`}>
        <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close mobile navigation" className={`absolute inset-0 bg-black/45 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute inset-y-0 left-0 z-[210] flex h-dvh w-[min(86vw,360px)] max-w-full flex-col overflow-hidden bg-card shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-4"><span className="font-heading text-base font-extrabold text-primary">HELPING HANDS</span><button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="grid size-10 place-items-center rounded-xl text-teal"><X className="size-5" /></button></div>
          <nav className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 pb-8" aria-label="Mobile navigation">
            {NAV_LINKS.map(link => link.dropdown ? <div key={link.to} className="mb-1 min-w-0"><div className="flex min-w-0 items-center gap-1"><NavLink to={link.to} onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{link.label}</NavLink><button type="button" onClick={() => setMobileDropdown(mobileDropdown === link.to ? null : link.to)} className="grid size-9 shrink-0 place-items-center rounded-lg text-teal"><ChevronDown className={`size-4 transition-transform ${mobileDropdown === link.to ? "rotate-180" : ""}`} /></button></div>{mobileDropdown === link.to && <div className="ml-3 min-w-0 border-l-2 border-[#5E922C] pl-2">{link.menu.map(item => item.nested ? <div key={item.to} className="min-w-0"><div className="flex min-w-0 items-center"><NavLink to={item.to} onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{item.label}</NavLink><button type="button" onClick={() => setMobileNested(v => !v)} className="grid size-9 shrink-0 place-items-center text-teal"><ChevronDown className={`size-4 ${mobileNested ? "rotate-180" : ""}`} /></button></div>{mobileNested && <div className="ml-3 min-w-0 border-l border-[#5E922C] pl-2">{item.children.map(c => <NavLink key={c.to} to={c.to} onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{c.label}</NavLink>)}</div>}</div> : <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{item.label}</NavLink>)}</div>}</div> : <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{link.label}</NavLink>)}
            <div className="mt-3 border-t border-border pt-3"><LoginDropdown onNavigate={() => setMobileOpen(false)} /><NavLink to="/donate" onClick={() => setMobileOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#ff9700] px-4 py-3 text-sm font-extrabold text-white"><Heart className="size-4 fill-current" />Donate</NavLink></div>
          </nav>
        </aside>
      </div>
    </header>
  </>
}
