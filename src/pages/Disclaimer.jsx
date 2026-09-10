import { Link } from "react-router-dom"
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <section className="border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-teal transition hover:text-primary mb-6"><ArrowLeft className="size-4" /> Back to Home</Link>
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-primary text-white shadow-lg"><AlertTriangle className="size-8" /></div>
          <h1 className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">Disclaimer</h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">Last updated: August 22, 2026</p>
        </div>
      </section>

      <section className="px-4 pt-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl prose prose-sm sm:prose-base prose-headings:font-heading prose-headings:text-primary prose-a:text-teal prose-strong:text-primary text-muted-foreground">
          <h2>1. General Information</h2>
          <p>The information provided by <strong>Helping Hands Foundation</strong> on this website is for general informational purposes only. While we strive to keep the information up-to-date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, programs, services, or related graphics contained on the website for any purpose.</p>

          <h2>2. Charitable Contributions and Tax</h2>
          <p>Donations made to Helping Hands Foundation may be eligible for tax deduction under Section 80G of the Income Tax Act, 1961 (India). However, the information on this site does not constitute financial, legal, or tax advice. We strongly recommend that donors consult with their own tax advisors or financial planners regarding the specific tax consequences of their donations.</p>

          <h2>3. External Links</h2>
          <p>Through this website, you may be able to link to other websites which are not under the control of Helping Hands Foundation. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>

          <h2>4. Use of Funds</h2>
          <p>While we make every effort to allocate funds to the specific campaigns (e.g., Education, Healthcare, Food Distribution) as requested by the donor, Helping Hands Foundation reserves the right to redirect funds to the area of greatest need in the event that a specific campaign becomes fully funded, cancelled, or if the funds are urgently required elsewhere to fulfill our charitable objectives.</p>

          <h2>5. Limitation of Liability</h2>
          <p>In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.</p>
        </div>
      </section>
    </main>
  )
}
