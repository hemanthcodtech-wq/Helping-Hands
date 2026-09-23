import { useState, useRef } from "react"
import { Award, FileText, Download, Edit3, Image as ImageIcon } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { useApp } from "../../context/AppContext"

const CERTIFICATE_TYPES = [
  { 
    id: "membership", 
    label: "Membership Certificate", 
    title: "Certificate of Membership",
    defaultRole: "Registered Member",
    defaultDesc: "For officially joining the Helping Hands Foundation and committing to our mission of empowering communities and changing lives."
  },
  { 
    id: "appreciation", 
    label: "Appreciation Certificate", 
    title: "Certificate of Appreciation",
    defaultRole: "Outstanding Contributor",
    defaultDesc: "In recognition of your exceptional generosity, outstanding contribution, and selfless service to the community."
  },
  { 
    id: "participation", 
    label: "Participation Certificate", 
    title: "Certificate of Participation",
    defaultRole: "Event Participant",
    defaultDesc: "For active and enthusiastic participation in our community outreach programs and demonstrating a true spirit of volunteerism."
  },
  { 
    id: "visitor", 
    label: "Visitor Certificate", 
    title: "Certificate of Visit",
    defaultRole: "Honored Guest",
    defaultDesc: "In acknowledgment of your valuable visit to the Helping Hands Foundation headquarters and your keen interest in our social initiatives."
  },
  { 
    id: "appointment", 
    label: "Appointment Letter", 
    title: "Letter of Appointment",
    defaultRole: "Executive Coordinator",
    defaultDesc: "Executive Coordinator" // Used as the Position Title in the letter
  },
]

export default function AdminCertificates() {
  const [type, setType] = useState(CERTIFICATE_TYPES[0].id)
  const [form, setForm] = useState({
    recipientName: "John Doe",
    description: CERTIFICATE_TYPES[0].defaultDesc,
    date: new Date().toISOString().split("T")[0],
    roleOrEvent: CERTIFICATE_TYPES[0].defaultRole,
  })
  const [generating, setGenerating] = useState(false)
  const certificateRef = useRef(null)
  const { globalSettings } = useApp()
  
  const s = globalSettings || {}
  const activeLogo = s.headerLogoUrl || "https://res.cloudinary.com/dwmjz9csc/image/upload/v1786889497/9ec8064b-61d9-4e70-897d-4790e9ea2cdf-removebg-preview_ogtw6d.png?notaint=1"
  const siteTitle = s.siteTitle || "Helping Hands Foundation"

  const selectedType = CERTIFICATE_TYPES.find((t) => t.id === type)

  const handleTypeChange = (newType) => {
    setType(newType)
    const newTypeData = CERTIFICATE_TYPES.find(t => t.id === newType)
    setForm(prev => ({
      ...prev,
      description: newTypeData.defaultDesc,
      roleOrEvent: newTypeData.defaultRole
    }))
  }

  const handleGeneratePDF = async () => {
    if (!certificateRef.current) return
    setGenerating(true)

    // Save scroll position and scroll to top to prevent html2canvas cutoff bug
    const originalScrollY = window.scrollY;
    window.scrollTo(0, 0);

    try {
      const isPortrait = type === "appointment"
      const targetWidth = isPortrait ? 794 : 1123
      const targetHeight = isPortrait ? 1123 : 794

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: targetWidth,
        height: targetHeight,
        windowWidth: targetWidth,
        windowHeight: targetHeight,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById("certificate-download-target")
          if (el) {
            let parent = el.parentElement
            while (parent && parent !== clonedDoc.body) {
              parent.style.overflow = "visible"
              parent.style.transform = "none"
              parent = parent.parentElement
            }
          }
        }
      })
      
      // Restore original scroll position immediately
      window.scrollTo(0, originalScrollY);
      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      
      // A4 Landscape is ~ 297mm x 210mm
      const pdf = new jsPDF({
        orientation: isPortrait ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${selectedType.label.replace(/\s+/g, "_")}_${form.recipientName.replace(/\s+/g, "_")}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Check console for details.")
    } finally {
      setGenerating(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">Generate Certificates & Letters</h2>
        <p className="mt-1 text-[9px] text-muted-foreground sm:text-sm">
          Manually fill details to generate high-quality PDF certificates and appointment letters.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <FadeIn className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm h-fit">
          <div className="mb-5 border-b border-border pb-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              <Edit3 className="size-4 text-teal" /> Document Details
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Document Type</label>
              <div className="grid grid-cols-1 gap-2">
                {CERTIFICATE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTypeChange(t.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold text-left transition ${
                      type === t.id
                        ? "border-teal bg-primary-soft text-teal"
                        : "border-border bg-background text-primary hover:border-teal/50"
                    }`}
                  >
                    {t.id === "appointment" ? <FileText className="size-4 shrink-0" /> : <Award className="size-4 shrink-0" />}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                value={form.recipientName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none"
              />
            </div>

            {type !== "appointment" && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-primary">Event / Role</label>
                <input
                  type="text"
                  name="roleOrEvent"
                  value={form.roleOrEvent}
                  onChange={handleInputChange}
                  placeholder="e.g. Annual Blood Donation Camp"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">
                {type === "appointment" ? "Position Title" : "Description / Reason"}
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-teal focus:outline-none"
              />
            </div>

            <button
              onClick={handleGeneratePDF}
              disabled={generating || !form.recipientName}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-4 py-3 text-sm font-bold text-white transition hover:bg-[#065f69] disabled:opacity-50"
            >
              {generating ? (
                "Generating PDF..."
              ) : (
                <>
                  <Download className="size-4" /> Download PDF
                </>
              )}
            </button>
          </div>
        </FadeIn>

        <FadeIn className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm overflow-x-auto flex flex-col items-center bg-gray-50/50">
          <div className="mb-4 flex w-full justify-between items-center max-w-[800px]">
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Preview</span>
          </div>

          {/* Certificate / Letter Preview Area */}
          <div className="shadow-2xl bg-white relative">
            {type !== "appointment" ? (
              // Certificate Template (Landscape)
              <div
                id="certificate-download-target"
                ref={certificateRef}
                className="relative flex flex-col items-center justify-center overflow-hidden"
                style={{ width: "1123px", height: "794px", padding: "40px", backgroundColor: "#ffffff", fontFamily: "'Poppins', sans-serif" }} // A4 Landscape at 96 DPI
              >
                {/* Decorative Borders */}
                <div className="absolute inset-[20px] border-[12px] border-[#087884]"></div>
                <div className="absolute inset-[36px] border-[2px] border-[#EF9A0A]"></div>
                
                {/* Background Pattern/Logo Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <div className="w-[400px] h-[400px] rounded-full border-[40px] border-[#087884]"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[800px] h-full py-6">
                  {/* Reference Number */}
                  <div style={{ position: "absolute", top: "20px", right: "20px", textAlign: "right" }}>
                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#6b7280", letterSpacing: "1px" }}>CERTIFICATE NO.</p>
                    <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937" }}>HHF-{form.date ? form.date.substring(0,4) : new Date().getFullYear()}-0001</p>
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-center mb-6">
                    <img src={activeLogo} crossOrigin="anonymous" alt="Logo" className="h-24 object-contain" />
                  </div>

                  <h2 className="text-5xl italic mb-6" style={{ color: "#1f2937", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{selectedType.title}</h2>
                  
                  <p className="text-lg mb-4 font-medium uppercase tracking-widest" style={{ color: "#4b5563" }}>This is proudly presented to</p>
                  
                  <div className="mb-6" style={{ textAlign: "center" }}>
                    <h3 className="text-5xl font-bold text-[#087884] pb-2 px-10 inline-block">
                      {form.recipientName || "[Recipient Name]"}
                    </h3>
                    <div style={{ display: "inline-block", width: "100%", maxWidth: "500px", height: "2px", backgroundColor: "#d1d5db" }}></div>
                  </div>

                  <p className="text-xl leading-relaxed mb-4 max-w-[700px]" style={{ color: "#374151" }}>
                    {form.description}
                  </p>

                  <p className="text-[14px] italic mb-6 max-w-[600px]" style={{ color: "#4b5563", fontFamily: "'Playfair Display', serif" }}>
                    In witness whereof, we have hereunto set our hands and the official seal of the {siteTitle} on this day.
                  </p>

                  <p className="text-lg font-bold text-[#EF9A0A] mb-8 uppercase tracking-wider">
                    {form.roleOrEvent}
                  </p>

                  {/* Signatures & Date */}
                  <div className="flex justify-between w-full px-16 mt-auto">
                    <div style={{ width: "192px", margin: "0 auto" }}>
                      <div className="text-lg font-bold pb-1 w-full" style={{ color: "#1f2937", textAlign: "center" }}>
                        {form.date ? new Date(form.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "[Date]"}
                      </div>
                      <div style={{ display: "inline-block", width: "100%", height: "1px", backgroundColor: "#1f2937", marginBottom: "8px" }}></div>
                      <div style={{ textAlign: "center" }}>
                        <span className="text-sm uppercase tracking-wider font-bold" style={{ color: "#6b7280" }}>Date</span>
                      </div>
                    </div>

                    {/* Official Seal */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                      <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "3px solid #EF9A0A", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fffcf2" }}>
                        <Award size={32} color="#EF9A0A" strokeWidth={1.5} />
                      </div>
                      <span style={{ fontSize: "9px", fontWeight: "bold", color: "#EF9A0A", marginTop: "6px", letterSpacing: "1px" }}>OFFICIAL SEAL</span>
                    </div>
                    
                    <div style={{ width: "192px", margin: "0 auto" }}>
                      <div style={{ height: "40px", paddingTop: "8px", paddingBottom: "4px", width: "full", textAlign: "center" }}>
                        <span className="text-4xl" style={{ color: "#1f2937", fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>{s.authorizedSignatoryName ? s.authorizedSignatoryName.charAt(0) + "..." : "H.H.F."}</span>
                      </div>
                      <div style={{ display: "inline-block", width: "100%", height: "1px", backgroundColor: "#1f2937", marginBottom: "8px" }}></div>
                      <div style={{ textAlign: "center" }}>
                        <span className="text-sm uppercase tracking-wider font-bold" style={{ color: "#6b7280" }}>{s.authorizedSignatoryTitle || "Authorized Signatory"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Appointment Letter Template (Portrait)
              <div
                id="certificate-download-target"
                ref={certificateRef}
                className="relative text-left"
                style={{ width: "794px", height: "1123px", padding: "80px", backgroundColor: "#ffffff", color: "#1f2937", fontFamily: "'Poppins', sans-serif" }} // A4 Portrait at 96 DPI
              >
                <div className="flex items-center justify-between border-b-4 border-[#087884] pb-6 mb-10">
                  <div className="flex items-center gap-4">
                    <img src={activeLogo} crossOrigin="anonymous" alt="Logo" className="w-16 h-16 object-contain" />
                    <div>
                      <h1 className="text-2xl font-extrabold text-[#087884] uppercase tracking-widest">{siteTitle}</h1>
                      <p className="text-xs font-bold" style={{ color: "#6b7280" }}>{s.contactFullAddress || "H.No: 4-187/4, Ambabhavani Pet, Gowli Pet, Adoni – 518301, Kurnool District, A.P."}</p>
                      <p className="text-xs font-bold" style={{ color: "#6b7280" }}>{s.contactEmail || "helpinghandsffoundation@gmail.com"} | {s.contactPhonePrimary || "+91 77993 73766"}</p>
                    </div>
                  </div>
                </div>

                {/* Letter Content */}
                <div className="text-[15px] leading-relaxed">
                  <p className="mb-8 font-bold" style={{ color: "#4b5563" }}>
                    Date: {form.date ? new Date(form.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "[Date]"}
                  </p>

                  <p className="mb-4">To,</p>
                  <h3 className="text-xl font-bold mb-8" style={{ color: "#111827" }}>{form.recipientName || "[Recipient Name]"}</h3>

                  <h4 className="text-lg font-bold text-[#087884] mb-6 border-b pb-2" style={{ borderColor: "#e5e7eb" }}>
                    Subject: Letter of Appointment - {form.description || "[Position Title]"}
                  </h4>

                  <p className="mb-6">Dear {form.recipientName || "[Name]"},</p>

                  <p className="mb-6">
                    We are pleased to offer you the position of <strong>{form.description || "[Position Title]"}</strong> at {siteTitle}. Your dedication to our mission and outstanding qualifications have made you an ideal candidate for this role.
                  </p>

                  <p className="mb-6">
                    In this position, you will play a crucial role in advancing our initiatives to support and empower the communities we serve. Your responsibilities will include, but are not limited to, the duties discussed during your selection process.
                  </p>

                  <p className="mb-6">
                    We believe that your skills and passion will be a valuable addition to our team. Please review the attached terms and conditions of your appointment.
                  </p>

                  <p className="mb-12">
                    We look forward to welcoming you to the {siteTitle} family and achieving great things together.
                  </p>

                  <p className="mb-10">Sincerely,</p>

                  <div style={{ width: "192px" }}>
                    <div style={{ height: "64px", paddingTop: "20px", paddingBottom: "4px" }}>
                       <span className="text-4xl ml-4" style={{ color: "#1f2937", fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>{s.authorizedSignatoryName ? s.authorizedSignatoryName.split(' ')[0] : "Director"}</span>
                    </div>
                    <div style={{ width: "100%", height: "1px", backgroundColor: "#9ca3af", marginBottom: "8px" }}></div>
                    <p className="font-bold" style={{ color: "#111827" }}>{s.authorizedSignatoryName || "Executive Director"}</p>
                    <p className="text-sm" style={{ color: "#6b7280" }}>{siteTitle}</p>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#087884]"></div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
