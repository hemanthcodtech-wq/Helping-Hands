// Centered "— OUR CAUSES —" style eyebrow heading with flanking rules.
export default function SectionHeading({ children }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <span className="h-px w-5 bg-primary/40 sm:w-6" aria-hidden="true" />
      <h2 className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
        {children}
      </h2>
      <span className="h-px w-5 bg-primary/40 sm:w-6" aria-hidden="true" />
    </div>
  )
}
