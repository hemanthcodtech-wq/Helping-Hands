import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Shield, Trophy, Zap } from "lucide-react"
import { donationTiers } from "../data/content"
import { useApp } from "../context/AppContext"
import FadeIn from "../components/Common/FadeIn"
import SectionHeading from "../components/Common/SectionHeading"

const TRUST_BADGES = [
  { icon: Shield, label: "100% Secure" },
  { icon: Zap, label: "Instant Receipt" },
  { icon: Heart, label: "80G Tax Benefit" },
]

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Donors() {
  const { donors, addDonor } = useApp()
  const [selected, setSelected] = useState(donationTiers[0].id)
  const [custom, setCustom] = useState("")
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(null)

  const getAmount = () => {
    if (custom) return parseInt(custom, 10)
    return parseInt(donationTiers.find((t) => t.id === selected)?.amount.replace(/[^\d]/g, "") || "500", 10)
  }

  const getCampaign = () =>
    custom ? "Custom Donation" : donationTiers.find((t) => t.id === selected)?.label || "General"

  const handlePay = async (e) => {
    e.preventDefault()
    const amount = getAmount()
    if (!amount || amount < 1) return

    setPaying(true)
    const loaded = await loadRazorpay()

    if (!loaded) {
      alert("Razorpay failed to load. Check your internet connection.")
      setPaying(false)
      return
    }

    const options = {
      // Replace with your actual Razorpay Key ID
      key: "rzp_test_TZvGeQCY7vlXkN",
      amount: amount * 100, // paise
      currency: "INR",
      name: "Helping Hands Foundation",
      description: getCampaign(),
      image: "/placeholder-logo.svg",
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#087884" },
      handler(response) {
        const donor = {
          name: form.name,
          email: form.email,
          amount,
          campaign: getCampaign(),
          status: "success",
          txnId: response.razorpay_payment_id,
        }
        addDonor(donor)
        setSuccess(donor)
        setPaying(false)
        setForm({ name: "", email: "", phone: "" })
        setCustom("")
        setSelected(donationTiers[0].id)
      },
      modal: {
        ondismiss() {
          setPaying(false)
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on("payment.failed", (resp) => {
      addDonor({
        name: form.name,
        email: form.email,
        amount,
        campaign: getCampaign(),
        status: "failed",
        txnId: resp.error.metadata?.payment_id || "N/A",
      })
      setPaying(false)
      alert("Payment failed: " + resp.error.description)
    })
    rzp.open()
  }

  const successDonors = donors.filter((d) => d.status === "success")
  const totalRaised = successDonors.reduce((s, d) => s + d.amount, 0)

  if (success) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-teal/10 sm:size-20">
            <Heart className="size-8 fill-teal text-teal sm:size-10" />
          </div>
          <h1 className="mt-4 font-heading text-[26px] font-extrabold text-primary sm:text-4xl">Thank You, {success.name}!</h1>
          <p className="mt-2 text-[10px] text-muted-foreground sm:text-sm">
            Your donation of <strong className="text-teal">₹{success.amount.toLocaleString()}</strong> for <strong>{success.campaign}</strong> was successful.
          </p>
          <p className="mt-1 text-[9px] text-muted-foreground sm:text-xs">Transaction ID: {success.txnId}</p>
          <p className="mt-1 text-[9px] text-muted-foreground sm:text-xs">A receipt has been sent to {success.email}</p>
          <button
            onClick={() => setSuccess(null)}
            className="mt-6 rounded-full bg-teal px-6 py-2.5 text-[10px] font-bold text-white transition hover:bg-teal-dark sm:text-sm"
          >
            Donate Again
          </button>
        </motion.div>
      </main>
    )
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-primary-soft">
        <div className="page-shell px-3 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-teal sm:text-[11px]">Make a Difference</p>
            <h1 className="font-heading text-[32px] font-extrabold leading-[1.04] tracking-[-0.03em] text-primary sm:text-5xl lg:text-[56px]">
              Donate Now
            </h1>
            <p className="mt-3 text-[10px] leading-[1.65] text-muted-foreground sm:mt-5 sm:text-sm lg:text-[15px]">
              Every rupee you give directly funds education, healthcare, and food for families in need.
            </p>
            <div className="mt-4 flex items-center gap-4 sm:mt-6">
              <div>
                <p className="font-heading text-[22px] font-extrabold text-primary sm:text-3xl">
                  ₹{totalRaised.toLocaleString()}
                </p>
                <p className="text-[8px] text-muted-foreground sm:text-xs">Total Raised</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="font-heading text-[22px] font-extrabold text-primary sm:text-3xl">{successDonors.length}</p>
                <p className="text-[8px] text-muted-foreground sm:text-xs">Donors</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="page-shell px-3 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* Donation form */}
          <FadeIn>
            <form onSubmit={handlePay} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:rounded-3xl sm:p-8">
              <h2 className="font-heading text-[18px] font-bold text-primary sm:text-2xl">Choose Your Impact</h2>

              {/* Tiers */}
              <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
                {donationTiers.map((tier) => {
                  const active = selected === tier.id && !custom
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => { setSelected(tier.id); setCustom("") }}
                      className={`rounded-xl border p-2.5 text-center transition active:scale-95 sm:rounded-2xl sm:p-4 ${
                        active ? "border-teal bg-primary-soft" : "border-border bg-background hover:border-teal/40"
                      }`}
                    >
                      <span className={`block text-[13px] font-extrabold sm:text-xl ${active ? "text-teal" : "text-primary"}`}>
                        {tier.amount}
                      </span>
                      <span className="mt-0.5 block text-[7px] text-muted-foreground sm:mt-1 sm:text-xs">{tier.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Custom */}
              <div className="mt-3 sm:mt-4">
                <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">Or enter custom amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground sm:text-sm">₹</span>
                  <input
                    type="number"
                    value={custom}
                    onChange={(e) => { setCustom(e.target.value); setSelected(null) }}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-7 pr-3 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:py-3 sm:pl-8 sm:text-sm"
                  />
                </div>
              </div>

              {/* Donor info */}
              <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2">
                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Your name", required: true },
                  { key: "email", label: "Email", type: "email", placeholder: "your@email.com", required: true },
                  { key: "phone", label: "Phone (optional)", type: "tel", placeholder: "+91 00000 00000", required: false },
                ].map((f) => (
                  <div key={f.key} className={f.key === "phone" ? "sm:col-span-2" : ""}>
                    <label className="mb-1.5 block text-[8px] font-semibold text-muted-foreground sm:text-xs">{f.label}</label>
                    <input
                      type={f.type}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:py-3 sm:text-sm"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={paying}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-[10px] font-bold text-white transition hover:bg-accent/90 active:scale-[0.98] disabled:opacity-60 sm:mt-6 sm:rounded-2xl sm:py-4 sm:text-sm"
              >
                <Heart className="size-3.5 fill-current sm:size-4" />
                {paying ? "Opening Payment..." : `Pay ₹${getAmount().toLocaleString()} via Razorpay`}
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 sm:mt-4">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1 text-[7px] text-muted-foreground sm:text-[10px]">
                    <Icon className="size-3 text-teal sm:size-3.5" />
                    {label}
                  </div>
                ))}
              </div>
            </form>
          </FadeIn>

          {/* Sidebar */}
          <FadeIn delay={0.1} className="space-y-3 sm:space-y-4">
            {donationTiers.map((tier) => (
              <div key={tier.id} className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-[15px] font-extrabold text-primary sm:text-xl">{tier.amount}</span>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[7px] font-bold text-teal sm:text-[9px]">{tier.label}</span>
                </div>
                <p className="mt-1 text-[8px] text-muted-foreground sm:mt-2 sm:text-xs">{tier.description}</p>
              </div>
            ))}
            <div className="rounded-xl border border-border bg-primary-soft p-3 sm:rounded-2xl sm:p-5">
              <p className="text-[8px] font-semibold text-primary sm:text-xs">
                🏛️ Registered under <strong>Section 80G</strong>. Tax receipt within 24 hours.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Donor Leaderboard */}
      <section className="page-shell px-3 pb-10 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <FadeIn>
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-accent sm:size-5" />
            <SectionHeading>Our Generous Donors</SectionHeading>
          </div>
        </FadeIn>
        <FadeIn className="mt-4 overflow-hidden rounded-2xl border border-border bg-card sm:mt-6 sm:rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Donor", "Campaign", "Amount", "Date", "Status"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-3 sm:text-xs">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donors.map((d, i) => (
                  <tr key={d.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                    <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                      <div className="flex items-center gap-2">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-[8px] font-bold text-teal sm:size-8 sm:text-xs">
                          {d.name.charAt(0)}
                        </span>
                        <div>
                          <p className="text-[9px] font-semibold text-primary sm:text-sm">{d.name}</p>
                          <p className="text-[7px] text-muted-foreground sm:text-xs">{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-5 sm:py-3 sm:text-sm">{d.campaign}</td>
                    <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                      <span className="font-heading text-[10px] font-extrabold text-primary sm:text-sm">₹{d.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-2.5 text-[9px] text-muted-foreground sm:px-5 sm:py-3 sm:text-sm">{d.date}</td>
                    <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[7px] font-bold sm:text-[10px] ${
                        d.status === "success" ? "bg-teal/10 text-teal" : "bg-red-50 text-red-500"
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </section>
    </main>
  )
}
