import { useState, useEffect, useRef } from "react"
import { IdCard, Download, Loader2 } from "lucide-react"
import FadeIn from "../../components/Common/FadeIn"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function CoordinatorIDCard() {
  const [coord, setCoord] = useState(null)
  const [settings, setSettings] = useState({})
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const data = localStorage.getItem("coordinatorData")
    if (data) {
      const parsed = JSON.parse(data)
      setCoord(parsed)
      // Silently fetch latest to get new fields like blood_group if missing
      fetch(`http://localhost:5000/api/coordinators/${parsed.id}`)
        .then(res => res.json())
        .then(d => {
          if (d.success) {
            setCoord(d.coordinator)
            localStorage.setItem("coordinatorData", JSON.stringify(d.coordinator))
          }
        })
        .catch(console.error)
    }
    
    const localSettings = localStorage.getItem('siteSettings')
    if(localSettings) setSettings(JSON.parse(localSettings))
  }, [])

  if (!coord) return <p className="text-sm text-muted-foreground">Loading...</p>

  const activeLogo = settings.headerLogoUrl || "https://res.cloudinary.com/dwmjz9csc/image/upload/v1786889497/9ec8064b-61d9-4e70-897d-4790e9ea2cdf-removebg-preview_ogtw6d.png?notaint=1"

  const handleDownload = async () => {
    if (!cardRef.current || !coord) return
    
    try {
      setDownloading(true)
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High quality
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      })
      
      const imgData = canvas.toDataURL("image/png")
      
      // Standard CR80 ID Card dimensions in portrait: 54mm x 85.6mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [54, 85.6]
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      // Center vertically if it doesn't fill the whole height
      const yOffset = pdfHeight < 85.6 ? (85.6 - pdfHeight) / 2 : 0;
      
      pdf.addImage(imgData, "PNG", 0, yOffset, pdfWidth, pdfHeight)
      pdf.save(`ID-Card-${coord.name.replace(/\s+/g, '-')}.pdf`)
      
    } catch (error) {
      console.error("Error generating ID card PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-sm">
      <h2 className="text-[15px] font-extrabold text-primary sm:text-xl">My ID Card</h2>
      <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-sm">Download your official Coordinator ID card</p>
      
      <FadeIn className="flex flex-col gap-6">
        <div 
          ref={cardRef} 
          className="relative overflow-hidden rounded-3xl border-2 shadow-lg flex flex-col items-center w-full max-w-sm"
          style={{ width: "350px", minHeight: "555px", backgroundColor: "#ffffff", borderColor: "#e5e7eb" }} // Roughly CR80 ratio (1:1.58)
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <IdCard className="size-24" style={{ color: "#0d9488" }} />
          </div>
          
          <div className="mt-4 mb-4 flex flex-col items-center">
            <img src={activeLogo} crossOrigin="anonymous" alt="Logo" className="h-12 object-contain mb-2" />
            <h1 className="text-lg font-black text-center leading-tight" style={{ color: "#1f2937" }}>{settings.siteTitle || "HELPING HANDS"}</h1>
            <h2 className="text-[10px] font-bold text-center tracking-widest uppercase" style={{ color: "#0d9488" }}>Foundation</h2>
          </div>
          
          {coord.profile_pic_url ? (
            <img src={coord.profile_pic_url} alt={coord.name} className="size-32 rounded-full object-cover mb-6" style={{ boxShadow: "0 0 0 4px rgba(13, 148, 136, 0.2)" }} crossOrigin="anonymous" />
          ) : (
            <div className="grid size-32 place-items-center rounded-full mb-6" style={{ backgroundColor: "rgba(13, 148, 136, 0.1)", color: "#0d9488", boxShadow: "0 0 0 4px rgba(13, 148, 136, 0.2)" }}>
              <span className="text-4xl font-bold">{coord.name.charAt(0)}</span>
            </div>
          )}
          
          <h3 className="text-2xl font-extrabold uppercase text-center mb-1" style={{ color: "#1f2937" }}>{coord.name}</h3>
          <p className="text-sm font-bold mb-6 uppercase tracking-wider text-center" style={{ color: "#0d9488" }}>{coord.role || "Official Coordinator"}</p>
          
          <div className="w-full text-sm space-y-3 mb-6 text-center border-t pt-6 mt-auto" style={{ color: "#6b7280", borderColor: "#e5e7eb" }}>
            <div className="grid grid-cols-2 gap-2 text-left px-4">
              <p className="text-xs font-semibold">Blood Group</p>
              <p className="text-xs font-bold text-right" style={{ color: "#1f2937" }}>{coord.blood_group || "Unknown"}</p>
              <p className="text-xs font-semibold">Phone</p>
              <p className="text-xs font-bold text-right" style={{ color: "#1f2937" }}>{coord.phone}</p>
              <p className="text-xs font-semibold">ID No.</p>
              <p className="text-xs font-bold text-right" style={{ color: "#1f2937" }}>HH-{coord.id?.toString().slice(0, 4) || "0001"}</p>
            </div>
          </div>
          
          <div className="w-full py-2 mt-auto text-center" style={{ backgroundColor: "#0d9488" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#ffffff" }}>helpinghandsfoundation.org</p>
          </div>
        </div>
        
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="flex w-full max-w-[350px] items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-bold text-white transition hover:bg-teal/90 disabled:opacity-50"
        >
          {downloading ? (
            <><Loader2 className="size-4 animate-spin" /> Generating PDF...</>
          ) : (
            <><Download className="size-4" /> Download My ID Card</>
          )}
        </button>
      </FadeIn>
    </div>
  )
}
