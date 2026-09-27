import React, { useState, useEffect, useRef } from "react"
import { Award, Download } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"
import toast from "react-hot-toast"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { useApp } from "../../context/AppContext"

export default function CoordinatorCertificates() {
  const [coordinator, setCoordinator] = useState(null)
  const [generating, setGenerating] = useState(false)
  
  // Ref for the hidden certificate template
  const certificateRef = useRef(null)
  const { globalSettings } = useApp()
  
  const s = globalSettings || {}
  const activeLogo = s.headerLogoUrl || "https://res.cloudinary.com/dwmjz9csc/image/upload/v1786889497/9ec8064b-61d9-4e70-897d-4790e9ea2cdf-removebg-preview_ogtw6d.png?notaint=1"
  const siteTitle = s.siteTitle || "Helping Hands Foundation"

  useEffect(() => {
    try {
      const data = localStorage.getItem("coordinatorData")
      if (data) {
        setCoordinator(JSON.parse(data))
      }
    } catch (err) {
      console.error("Failed to parse coordinator data", err)
    }
  }, [])

  const handleDownload = async () => {
    if (!coordinator) return
    setGenerating(true)
    
    // We need to wait a tick for React to ensure everything is rendered
    setTimeout(async () => {
      if (!certificateRef.current) return
      
      const originalScrollY = window.scrollY;
      window.scrollTo(0, 0);

      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 1123,
          height: 794,
          windowWidth: 1123,
          windowHeight: 794,
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById("certificate-download-target")
            if (el) {
              // Make sure it's visible in the clone
              el.style.display = "flex"
              let parent = el.parentElement
              while (parent && parent !== clonedDoc.body) {
                parent.style.overflow = "visible"
                parent.style.transform = "none"
                parent = parent.parentElement
              }
            }
          }
        })
        
        window.scrollTo(0, originalScrollY);
        const imgData = canvas.toDataURL("image/jpeg", 1.0)
        
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight)
        pdf.save(`Certificate_of_Appreciation_${coordinator.name.replace(/\s+/g, "_")}.pdf`)
        toast.success(`Successfully downloaded your certificate!`)
      } catch (error) {
        console.error("Error generating PDF:", error)
        toast.error("Failed to generate PDF.")
      } finally {
        setGenerating(false)
      }
    }, 100)
  }

  if (!coordinator) return <div className="p-8 text-center text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-4 sm:space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">My Certificates</h2>
          <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">View and download your official certificates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FadeIn className="group relative overflow-hidden rounded-3xl border-2 border-border bg-card p-6 shadow-sm transition hover:shadow-xl hover:border-teal/30">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-teal pointer-events-none">
            <Award className="size-24" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-full bg-teal/10 text-teal ring-4 ring-teal/5">
              <Award className="size-8" />
            </div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Certificate of Appreciation</h3>
            <p className="text-xl font-extrabold text-primary mb-1">{coordinator.name}</p>
            <p className="text-xs text-muted-foreground mb-6">Performance: <span className="font-semibold text-teal">{coordinator.performance || "Excellent"}</span></p>
            
            <button 
              onClick={handleDownload} 
              disabled={generating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal/90 hover:shadow-lg hover:shadow-teal/20 disabled:opacity-50"
            >
              <Download className="size-5" /> {generating ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </FadeIn>
      </div>

      {/* Hidden Certificate Template for PDF Generation */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div
          id="certificate-download-target"
          ref={certificateRef}
          className="relative flex flex-col items-center justify-center overflow-hidden"
          style={{ width: "1123px", height: "794px", padding: "60px", backgroundColor: "#fdfcf0", backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "30px 30px", fontFamily: "'Poppins', sans-serif" }}
        >
          {/* Decorative Borders */}
          <div className="absolute inset-[24px] border-[16px] border-[#0A2540] shadow-inner"></div>
          <div className="absolute inset-[44px] border-[4px] border-[#D4AF37]"></div>
          
          {/* Background Pattern/Logo Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
            <div className="w-[500px] h-[500px] rounded-full border-[60px] border-[#D4AF37]"></div>
          </div>

          {/* Reference Number */}
          <div className="absolute z-20" style={{ top: "60px", right: "60px", textAlign: "right" }}>
            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#6b7280", letterSpacing: "1px" }}>CERTIFICATE NO.</p>
            <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937" }}>HHF-{new Date().getFullYear()}-0001</p>
          </div>

          {/* Centered Content */}
          <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[800px]">

            {/* Header */}
            <div className="flex items-center justify-center mb-6">
              <img src={activeLogo} crossOrigin="anonymous" alt="Logo" className="h-24 object-contain" />
            </div>

            <h2 className="text-5xl italic mb-6" style={{ color: "#1f2937", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Certificate of Appreciation</h2>
            
            <p className="text-lg mb-4 font-medium uppercase tracking-widest" style={{ color: "#4b5563" }}>This is proudly presented to</p>
            
            <div className="mb-6" style={{ textAlign: "center" }}>
              <h3 className="text-6xl font-extrabold pb-2 px-10 inline-block" style={{ color: "#0A2540", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
                {coordinator.name}
              </h3>
              <div style={{ display: "inline-block", width: "100%", maxWidth: "500px", height: "2px", backgroundColor: "#d1d5db" }}></div>
            </div>

            <p className="text-xl leading-relaxed mb-4 max-w-[700px]" style={{ color: "#374151" }}>
              In recognition of your exceptional generosity, outstanding contribution, and selfless service to the community as a dedicated Coordinator.
            </p>

            <p className="text-[14px] italic mb-4 max-w-[600px]" style={{ color: "#4b5563", fontFamily: "'Playfair Display', serif" }}>
              In witness whereof, we have hereunto set our hands and the official seal of the {siteTitle} on this day.
            </p>

            <p className="text-xl font-bold mb-0 uppercase tracking-widest" style={{ color: "#D4AF37" }}>
              Outstanding Coordinator
            </p>
          </div>

          {/* Signatures & Date - Positioned absolutely to canvas */}
          <div className="absolute z-20 left-0 right-0 flex justify-between w-full px-[80px]" style={{ bottom: "56px" }}>
            <div style={{ width: "192px", margin: "0 auto" }}>
              <div className="text-lg font-bold pb-1 w-full" style={{ color: "#1f2937", textAlign: "center" }}>
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div style={{ display: "inline-block", width: "100%", height: "1px", backgroundColor: "#1f2937", marginBottom: "5px" }}></div>
              <div style={{ textAlign: "center" }}>
                <span className="text-sm uppercase tracking-wider font-bold" style={{ color: "#6b7280" }}>Date</span>
              </div>
            </div>

            {/* Official Seal */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: "4px solid #D4AF37", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fffcf2", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <Award size={36} color="#D4AF37" strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: "10px", fontWeight: "bold", color: "#D4AF37", marginTop: "8px", letterSpacing: "2px" }}>OFFICIAL SEAL</span>
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

    </div>
  )
}
