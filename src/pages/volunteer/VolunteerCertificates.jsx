import { Award, Download } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"

import { useApp } from "../../context/AppContext"

export default function VolunteerCertificates() {
  const { volunteerCertificates } = useApp()
  const handleDownload = (certName) => {
    alert(`Downloading ${certName}... (Simulation)`)
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-extrabold sm:text-3xl text-primary">Certificates</h1>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {volunteerCertificates.map((c, i) => (
          <FadeIn key={c.id} delay={i * 0.1}>
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex items-center gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
                <Award className="size-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-primary">{c.name}</h3>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Issued: {c.formatted_date} | By: {c.issuer}</p>
              </div>
              <button onClick={() => handleDownload(c.name)} className="grid size-8 place-items-center rounded-full bg-muted text-primary transition hover:bg-teal hover:text-white shrink-0">
                <Download className="size-4" />
              </button>
            </div>
          </FadeIn>
        ))}
      </div>
      
      {volunteerCertificates.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
          <Award className="mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">No certificates earned yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">Complete programs and campaigns to earn certificates.</p>
        </div>
      )}
    </div>
  )
}
