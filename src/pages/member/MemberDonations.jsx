import { useApp } from "../../context/AppContext"
import { Download, FileText } from "lucide-react"
import { jsPDF } from "jspdf"

export default function MemberDonations() {
  const { loggedInMember, donors, globalSettings } = useApp()
  
  const memberDonations = donors.filter(d => d.email === loggedInMember.email)

  const downloadReceipt = (donation) => {
    const doc = new jsPDF()
    const s = globalSettings || {}
    const ngoName = s.ngoName || "Helping Hands Foundation"
    const ngoAddress = s.contactFullAddress || "Tirupati, Andhra Pradesh"
    
    // Header
    doc.setFontSize(22)
    doc.setTextColor(4, 69, 143)
    doc.text(ngoName, 105, 20, { align: "center" })
    
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(ngoAddress, 105, 28, { align: "center" })
    
    doc.setFontSize(16)
    doc.setTextColor(0)
    doc.text("DONATION RECEIPT (80G)", 105, 45, { align: "center" })

    // Details
    doc.setFontSize(12)
    doc.text(`Receipt No: REC-${donation.id}`, 20, 60)
    doc.text(`Date: ${new Date(donation.date).toLocaleDateString()}`, 140, 60)
    
    doc.text(`Received with thanks from: ${donation.name}`, 20, 80)
    doc.text(`Amount: INR ${donation.amount.toLocaleString("en-IN")}`, 20, 90)
    doc.text(`Towards Campaign: ${donation.campaign}`, 20, 100)
    doc.text(`Transaction ID: ${donation.txnId || 'N/A'}`, 20, 110)
    
    doc.setFontSize(10)
    doc.text(`80G Exemption Number: ${s.cert80g || "DEL-80G-2024-XX"}`, 20, 130)
    doc.text(`PAN: ${s.ngoPan || "XXXXX1234X"}`, 20, 138)
    
    doc.setFontSize(10)
    doc.text("Authorized Signatory", 150, 170)
    doc.text(s.signatoryName || "Director", 150, 175)

    doc.save(`Receipt-${donation.id}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary">My Donations</h1>
        <p className="mt-1 text-sm text-muted-foreground">View your contribution history and download tax exemption receipts.</p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                <th className="whitespace-nowrap px-6 py-4 font-bold">Date</th>
                <th className="whitespace-nowrap px-6 py-4 font-bold">Campaign</th>
                <th className="whitespace-nowrap px-6 py-4 font-bold">Amount</th>
                <th className="whitespace-nowrap px-6 py-4 font-bold">Status</th>
                <th className="whitespace-nowrap px-6 py-4 font-bold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {memberDonations.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">No donations found.</td></tr>
              ) : (
                memberDonations.map((donation) => (
                  <tr key={donation.id} className="transition hover:bg-muted/30">
                    <td className="px-6 py-4 text-primary">{new Date(donation.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-primary font-semibold">{donation.campaign}</td>
                    <td className="px-6 py-4 text-primary font-bold">₹{donation.amount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${donation.status === "success" ? "bg-[#eef7e9] text-[#196823]" : "bg-red-50 text-red-600"}`}>
                        {donation.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {donation.status === "success" && (
                        <button onClick={() => downloadReceipt(donation)} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-muted">
                          <Download className="size-3.5" /> 80G Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
