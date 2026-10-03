import { useState } from "react"
import { MessageSquare, Send } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"
import { useApp } from "../../context/AppContext"

export default function CoordinatorSupport() {
  const [message, setMessage] = useState("")
  const { globalSettings, currentUser } = useApp()

  const handleSend = (e) => {
    e.preventDefault()
    
    // You can use a phone number from globalSettings or default to the admin's number
    const adminPhone = globalSettings?.contactPhone?.replace(/[^0-9]/g, "") || "917093426966"
    
    // Include the sender's info to give context to the admin
    const senderName = currentUser?.name || "Coordinator"
    const text = `*Support Request from ${senderName}*\n\n${message}`
    
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`
    
    window.open(whatsappUrl, "_blank")
    setMessage("")
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="grid size-12 place-items-center rounded-2xl bg-teal/10 text-teal">
          <MessageSquare className="size-6" />
        </div>
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Support</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Reach out to the admin team for help</p>
        </div>
      </div>

      <FadeIn className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">How can we help you?</label>
            <textarea 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or question here..."
              className="mt-2 w-full rounded-2xl border border-border bg-background p-4 text-sm focus:border-teal focus:outline-none min-h-[150px]"
            />
          </div>
          <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-bold text-white transition hover:bg-teal/90">
            <Send className="size-4" /> Send Message
          </button>
        </form>
      </FadeIn>
    </div>
  )
}
