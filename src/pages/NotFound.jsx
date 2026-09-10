import { NavLink } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import Logo from "../components/Common/Logo"

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <Logo className="size-14 opacity-30 sm:size-20" />
      <h1 className="mt-6 font-heading text-[64px] font-extrabold leading-none text-primary/20 sm:text-[100px]">404</h1>
      <h2 className="mt-2 font-heading text-[20px] font-bold text-primary sm:text-2xl">Page Not Found</h2>
      <p className="mt-2 max-w-sm text-[10px] text-muted-foreground sm:text-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <NavLink
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-[10px] font-bold text-white transition hover:bg-teal-dark active:scale-95 sm:text-sm"
      >
        Back to Home <ArrowRight className="size-3.5 sm:size-4" />
      </NavLink>
    </main>
  )
}
