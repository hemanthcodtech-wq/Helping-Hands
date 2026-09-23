import { Link } from "react-router-dom"
import { ArrowLeft, Shield } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <section className="border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-teal transition hover:text-primary mb-6"><ArrowLeft className="size-4" /> Back to Home</Link>
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-primary text-white shadow-lg"><Shield className="size-8" /></div>
          <h1 className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">Last updated: August 22, 2026</p>
        </div>
      </section>

      <section className="px-4 pt-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl prose prose-sm sm:prose-base prose-headings:font-heading prose-headings:text-primary prose-a:text-teal prose-strong:text-primary text-muted-foreground">
          <h2>1. Introduction</h2>
          <p><strong>Helping Hands Foundation</strong> respects your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard the information you provide to us when you visit our website, donate, or volunteer.</p>
          
          <h2>2. Information We Collect</h2>
          <p>We may collect personal identification information from you in a variety of ways, including but not limited to:</p>
          <ul>
            <li><strong>Personal Details:</strong> Name, email address, phone number, date of birth, and gender.</li>
            <li><strong>Financial Details:</strong> Information necessary to process donations, such as PAN card details for tax exemption (80G) and transaction IDs. We do not store your credit card or UPI pin details directly.</li>
            <li><strong>Documentation:</strong> Aadhaar details or profile pictures submitted during volunteer or donor registration for verification purposes.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>Helping Hands Foundation uses the collected data for the following purposes:</p>
          <ul>
            <li>To process donations and issue 80G tax exemption receipts.</li>
            <li>To manage and coordinate our volunteer network.</li>
            <li>To send periodic emails and updates regarding our campaigns (e.g., Every Child Deserves Education, Meals With Dignity).</li>
            <li>To maintain internal records and ensure compliance with statutory NGO regulations (e.g., NGO Darpan, 12A, 80G).</li>
          </ul>

          <h2>4. Information Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our partners and trusted affiliates. We may disclose your personal information if required to do so by law or in response to valid requests by public authorities.</p>

          <h2>5. Data Security</h2>
          <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site.</p>

          <h2>6. Third-Party Links</h2>
          <p>Our website may contain links to external sites (such as payment gateways like Razorpay/Stripe). These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites.</p>

          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:</p>
          <p>
            <strong>Helping Hands Foundation</strong><br />
            H.No: 4-187/4, Ambabhavani Pet, Gowli Pet, Adoni – 518301, Kurnool District, A.P.<br />
            Email: helpinghandsffoundation@gmail.com<br />
            Phone: +91 77993 73766
          </p>
        </div>
      </section>
    </main>
  )
}
