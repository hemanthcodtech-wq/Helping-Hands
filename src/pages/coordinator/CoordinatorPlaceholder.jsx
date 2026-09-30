import { Construction } from "lucide-react"

export default function CoordinatorPlaceholder({ title }) {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6 text-center">
      <div className="mb-4 grid size-16 place-items-center rounded-full bg-teal/10 text-teal">
        <Construction className="size-8" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-primary">{title || "Coming Soon"}</h2>
      <p className="max-w-md text-text-light">
        This administration panel is currently under development. You will be able to manage this feature here once it is fully built.
      </p>
    </div>
  )
}
