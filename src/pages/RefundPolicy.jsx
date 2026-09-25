import { Link } from "react-router-dom"
import { ArrowLeft, RefreshCcw } from "lucide-react"

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <section className="border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-teal transition hover:text-primary mb-6"><ArrowLeft className="size-4" /> Back to Home</Link>
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-primary text-white shadow-lg"><RefreshCcw className="size-8" /></div>
          <h1 className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">Refund Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">Last updated: August 22, 2026</p>
        </div>
      </section>

      <section className="px-4 pt-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl prose prose-sm sm:prose-base prose-headings:font-heading prose-headings:text-primary prose-a:text-teal prose-strong:text-primary text-muted-foreground">
          <h2>1. Donation Refund Policy</h2>
          <p>At <strong>Helping Hands Foundation</strong>, we are deeply grateful for your generous support of our mission to uplift communities in India. We understand that occasionally, errors may occur in the donation process or circumstances may change.</p>
          <p>As a non-profit charitable organization, donations are generally considered non-refundable. However, we have established a refund policy for exceptional cases where a genuine mistake was made.</p>

          <h2>2. Requesting a Refund</h2>
          <p>Refund requests must be submitted within <strong>15 days</strong> of the donation date. We will examine each request on a case-by-case basis and endeavor to make the refund process as seamless as possible.</p>
          <p>To request a refund, please send an email to <strong>helpinghandsffoundation@gmail.com</strong> with the following details:</p>
          <ul>
            <li>Your full name (as it appears on your bank/payment method)</li>
            <li>Donation amount</li>
            <li>Date of transaction</li>
            <li>Transaction ID or Receipt Number</li>
            <li>Reason for the refund request</li>
          </ul>

          <h2>3. Processing Time</h2>
          <p>Once your refund request is received, our finance team will review it. If approved, the refund will be processed and credited back to the original method of payment used during the donation.</p>
          <p>Please allow <strong>7-14 business days</strong> for the refunded amount to reflect in your bank account, credit card, or UPI wallet, depending on your bank's processing times.</p>

          <h2>4. Exceptions</h2>
          <p>Please note that we may not be able to process a refund in the following situations:</p>
          <ul>
            <li>If the tax exemption certificate (80G) has already been generated and issued to you.</li>
            <li>If the funds have already been deployed or committed to a specific emergency relief campaign on your behalf.</li>
            <li>If the refund request is raised after the 15-day window has expired.</li>
          </ul>

          <h2>5. Contact Us</h2>
          <p>If you have any further queries regarding our refund policy, please do not hesitate to reach out to us at <strong>helpinghandsffoundation@gmail.com</strong> or call us at <strong>+91 77993 73766</strong>.</p>
        </div>
      </section>
    </main>
  )
}
