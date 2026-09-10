import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Target, Heart, ShieldCheck, Wallet, Upload } from "lucide-react"

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

export default function CampaignDetail() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)

  // Form State
  const [form, setForm] = useState({
    name: "", email: "", phone: "", amount: "", pan: "", address: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`https://helpinghandsbe.vercel.app/api/campaigns/${id}`)
      const data = await res.json()
      if (data.success) {
        setCampaign(data.campaign)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaign()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const loaded = await loadRazorpay()

    if (!loaded) {
      alert("Razorpay failed to load. Check your internet connection.")
      setSubmitting(false)
      return
    }

    const options = {
      key: "rzp_test_TZvGeQCY7vlXkN", // Replace with your actual Razorpay Key ID
      amount: parseInt(form.amount) * 100, // paise
      currency: "INR",
      name: "Helping Hands Foundation",
      description: campaign?.name || "Campaign Donation",
      image: "/placeholder-logo.svg",
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#087884" },
      handler: async function (response) {
        try {
          const formData = new FormData()
          formData.append("name", form.name)
          formData.append("email", form.email)
          formData.append("phone", form.phone)
          formData.append("amount", form.amount)
          formData.append("aadhaar", form.pan)
          formData.append("address", form.address)
          formData.append("campaign_id", id)
          formData.append("designation", "General Donation")
          formData.append("payment_method", "razorpay")
          formData.append("txn_id", response.razorpay_payment_id)
          
          const res = await fetch("https://helpinghandsbe.vercel.app/api/donations/donate", {
            method: "POST",
            body: formData,
          })
          
          const data = await res.json()
          if (data.success) {
            setSuccess(true)
            fetchCampaign() // Refresh progress bar
          }
        } catch (err) {
          console.error(err)
          alert("Error saving donation details.")
        } finally {
          setSubmitting(false)
        }
      },
      modal: {
        ondismiss: function () {
          setSubmitting(false)
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on("payment.failed", function (response) {
      setSubmitting(false)
      alert("Payment failed: " + response.error.description)
    })
    rzp.open()
  }

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading campaign...</div>
  if (!campaign) return <div className="py-20 text-center text-muted-foreground">Campaign not found.</div>

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"

  return (
    <main className="min-h-screen bg-background pb-20">
      <section className="border-b border-border bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <Link to="/campaigns" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-teal transition hover:gap-3"><ArrowLeft className="size-4" /> Back to Campaigns</Link>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent shadow-sm"><Target className="size-4" /> Active Campaign</span>
              <h1 className="mt-5 font-heading text-4xl font-extrabold text-primary sm:text-5xl">{campaign.name}</h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{campaign.text}</p>
              
              <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-primary">Progress</span>
                  <span className="text-teal">{campaign.raised}%</span>
                </div>
                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-primary-soft">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#04458F] to-[#5E922C] transition-all duration-1000" style={{ width: `${campaign.raised}%` }} />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div>Raised: <strong className="text-primary">₹{campaign.raised_amount.toLocaleString('en-IN')}</strong></div>
                  <div>Goal: <strong className="text-primary">{campaign.goal}</strong></div>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative aspect-square overflow-hidden rounded-3xl sm:aspect-[4/3] lg:aspect-square">
              <img src={campaign.image || "/images/hero-girl.png"} alt={campaign.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-3xl px-4 sm:px-6 lg:px-10">
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-border bg-card p-10 text-center shadow-xl">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-green-50 text-green-600">
              <ShieldCheck className="size-10" />
            </div>
            <h2 className="mt-6 font-heading text-3xl font-extrabold text-primary">Thank You!</h2>
            <p className="mt-3 text-muted-foreground">Your donation to "{campaign.name}" has been recorded. Your contribution makes a real difference!</p>
            <button onClick={() => setSuccess(false)} className="mt-8 rounded-full bg-teal px-8 py-3 text-sm font-bold text-white transition hover:bg-teal-dark">Make another donation</button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="rounded-3xl border border-border bg-card shadow-xl">
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <h2 className="flex items-center gap-2 font-heading text-xl font-extrabold text-primary"><Heart className="size-5 text-accent" /> Support this Campaign</h2>
              <p className="mt-1 text-xs text-muted-foreground">Please fill in your details to process the donation (80G applicable).</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">Amount (₹) *</label>
                  <input type="number" required min="100" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className={inputClass} placeholder="e.g. 5000" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} placeholder="e.g. Rahul Sharma" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">Email Address *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClass} placeholder="rahul@example.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">Phone Number *</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass} placeholder="10-digit number" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">PAN Number (For 80G)</label>
                  <input value={form.pan} onChange={e => setForm({...form, pan: e.target.value})} className={inputClass} placeholder="ABCDE1234F" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-primary">Complete Address *</label>
                  <textarea rows={2} required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className={`${inputClass} resize-y`} placeholder="Full address for receipt" />
                </div>
              </div>
              
              <button type="submit" disabled={submitting} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#EF9A0A] px-5 py-4 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(239,154,10,0.22)] transition hover:bg-[#d98900] disabled:opacity-60 active:scale-[0.99]">
                <Wallet className="size-5" /> {submitting ? "Processing..." : `Donate ₹${form.amount || "..."}`}
              </button>
            </form>
          </motion.div>
        )}
      </section>
    </main>
  )
}
