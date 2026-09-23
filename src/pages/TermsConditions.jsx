import { Link } from "react-router-dom"
import { ArrowLeft, Scale } from "lucide-react"

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <section className="border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-teal transition hover:text-primary mb-6"><ArrowLeft className="size-4" /> Back to Home</Link>
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-primary text-white shadow-lg"><Scale className="size-8" /></div>
          <h1 className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">Last updated: August 22, 2026</p>
        </div>
      </section>

      <section className="px-4 pt-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl prose prose-sm sm:prose-base prose-headings:font-heading prose-headings:text-primary prose-a:text-teal prose-strong:text-primary text-muted-foreground">
          <h2>1. Introduction</h2>
          <p>Welcome to <strong>Helping Hands Foundation</strong>. These Terms and Conditions govern your use of our website and services. By accessing our platform, participating in our campaigns, or making a donation, you agree to be bound by these terms.</p>
          
          <h2>2. About Us</h2>
          <p>Helping Hands Foundation is a registered non-profit organization dedicated to empowering communities through education, healthcare, food distribution, and women's empowerment initiatives across India.</p>

          <h2>3. Donations and Contributions</h2>
          <p>All donations made through our website are voluntary. By making a donation, you confirm that you are legally authorized to use the provided payment method. Donations made to Helping Hands Foundation may be eligible for tax exemption under Section 80G of the Income Tax Act, 1961, subject to the prevailing laws and your submission of accurate PAN and identity details.</p>

          <h2>4. Use of Website Content</h2>
          <p>All content on this website, including text, graphics, logos, images, and campaign details, is the property of Helping Hands Foundation. You may not reproduce, distribute, or use any of our materials for commercial purposes without prior written consent.</p>

          <h2>5. Volunteer Conduct</h2>
          <p>If you register as a volunteer, you agree to act in accordance with the core values of Helping Hands Foundation. You must treat all community members, beneficiaries, and staff with respect and dignity. The foundation reserves the right to terminate volunteer registration in cases of misconduct.</p>

          <h2>6. Limitation of Liability</h2>
          <p>Helping Hands Foundation endeavors to keep the information on this website accurate and up-to-date. However, we do not guarantee the completeness or absolute accuracy of all materials. We shall not be liable for any direct or indirect damages arising from the use of our website.</p>

          <h2>7. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms & Conditions at any time. Any changes will be posted on this page with an updated revision date. Continued use of the website following such changes constitutes your acceptance of the revised terms.</p>

          <h2>8. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Andhra Pradesh.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at <strong>helpinghandsffoundation@gmail.com</strong> or call us at <strong>+91 77993 73766</strong>.</p>
        </div>
      </section>
    </main>
  )
}
