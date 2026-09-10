import { useState, useEffect, useRef } from "react"
import { Settings, Globe, ShieldCheck, Link2, Smartphone, MapPin, Image as ImageIcon, Save, CheckCircle2 } from "lucide-react"

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [settings, setSettings] = useState({
    siteTitle: "",
    siteSubtitle: "",
    metaTitle: "",
    metaAuthor: "",
    websiteUrl: "",
    metaKeywords: "",
    metaDescription: "",
    organizationNameHindi: "",
    officialRegistrationInfo: "",
    panCardNumber: "",
    authorizedSignatoryName: "",
    authorizedSignatoryTitle: "",
    googleAnalyticsCode: "",
    facebookPixelCode: "",
    googleSearchConsoleVerification: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    linkedinUrl: "",
    pwaEnable: false,
    pwaAppName: "",
    pwaShortName: "",
    contactEmail: "",
    contactPhonePrimary: "",
    contactPhoneSecondary: "",
    contactWorkingHours: "",
    contactFullAddress: "",
    googleMapEmbedUrl: "",
    headerLogoUrl: "",
    footerLogoUrl: "",
    faviconUrl: "",
    pwaIconUrl: ""
  })

  const [files, setFiles] = useState({
    headerLogo: null,
    footerLogo: null,
    favicon: null,
    pwaIcon: null
  })

  const [previews, setPreviews] = useState({
    headerLogo: "",
    footerLogo: "",
    favicon: "",
    pwaIcon: ""
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/settings")
      const data = await res.json()
      if (data.success && data.settings) {
        setSettings({ ...settings, ...data.settings })
        setPreviews({
          headerLogo: data.settings.headerLogoUrl || "",
          footerLogo: data.settings.footerLogoUrl || "",
          favicon: data.settings.faviconUrl || "",
          pwaIcon: data.settings.pwaIconUrl || ""
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleFileChange = (e, field) => {
    const file = e.target.files[0]
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviews((prev) => ({ ...prev, [field]: reader.result }))
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    
    try {
      const formData = new FormData()
      formData.append("settingsData", JSON.stringify(settings))
      
      if (files.headerLogo) formData.append("headerLogo", files.headerLogo)
      if (files.footerLogo) formData.append("footerLogo", files.footerLogo)
      if (files.favicon) formData.append("favicon", files.favicon)
      if (files.pwaIcon) formData.append("pwaIcon", files.pwaIcon)

      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        body: formData,
      })
      
      const data = await res.json()
      if (data.success) {
        setSettings({ ...settings, ...data.settings })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: "general", label: "General & SEO", icon: Globe },
    { id: "official", label: "Official Docs", icon: ShieldCheck },
    { id: "tracking", label: "Tracking", icon: Settings },
    { id: "social", label: "Social Links", icon: Link2 },
    { id: "pwa", label: "PWA Settings", icon: Smartphone },
    { id: "contact", label: "Contact Info", icon: MapPin },
    { id: "branding", label: "Branding", icon: ImageIcon },
  ]

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-border border-t-teal"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Site Configuration</h1>
          <p className="mt-2 text-text-light">Manage your NGO's basic information, SEO settings, and branding globally.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 font-bold text-white transition hover:bg-[#065f69] disabled:opacity-70"
        >
          {saving ? (
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : success ? (
            <><CheckCircle2 className="size-5" /> Saved!</>
          ) : (
            <><Save className="size-5" /> Save All Changes</>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full shrink-0 lg:w-64">
          <div className="sticky top-6 flex flex-col gap-1 rounded-2xl border border-border bg-card p-2 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-teal/10 text-teal"
                    : "text-text-light hover:bg-background hover:text-primary"
                }`}
              >
                <tab.icon className={`size-4 ${activeTab === tab.id ? "text-teal" : "text-text-light"}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <form className="flex flex-col gap-6">
            
            {/* GENERAL & SEO */}
            {activeTab === "general" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h2 className="mb-6 border-b border-border pb-3 text-xl font-bold text-primary">General Information & SEO</h2>
                <div className="grid gap-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Site Title *</label>
                      <input type="text" name="siteTitle" value={settings.siteTitle} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Site Subtitle</label>
                      <input type="text" name="siteSubtitle" value={settings.siteSubtitle} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Meta Title (SEO) *</label>
                    <input type="text" name="metaTitle" value={settings.metaTitle} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Meta Author</label>
                      <input type="text" name="metaAuthor" value={settings.metaAuthor} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Website URL</label>
                      <input type="url" name="websiteUrl" value={settings.websiteUrl} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Meta Keywords</label>
                    <input type="text" name="metaKeywords" value={settings.metaKeywords} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" placeholder="e.g. NGO, Education, Health" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Meta Description</label>
                    <textarea name="metaDescription" value={settings.metaDescription} onChange={handleInputChange} rows="4" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-teal focus:outline-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* OFFICIAL DOCS */}
            {activeTab === "official" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h2 className="mb-6 border-b border-border pb-3 text-xl font-bold text-primary">Official Documents & Signatories</h2>
                <div className="grid gap-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Organization Name (Hindi)</label>
                      <input type="text" name="organizationNameHindi" value={settings.organizationNameHindi} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" placeholder="e.g. ग्लोबल इम्पैक्ट फाउंडेशन" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">PAN Card Number</label>
                      <input type="text" name="panCardNumber" value={settings.panCardNumber} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Official Registration Info (for Receipts & Certs)</label>
                    <input type="text" name="officialRegistrationInfo" value={settings.officialRegistrationInfo} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" placeholder="Reg: UP/2026/012345 | 12A: AABTJ1234AE20261" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Authorized Signatory Name</label>
                      <input type="text" name="authorizedSignatoryName" value={settings.authorizedSignatoryName} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Authorized Signatory Title</label>
                      <input type="text" name="authorizedSignatoryTitle" value={settings.authorizedSignatoryTitle} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" placeholder="e.g. Chairman / President" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TRACKING */}
            {activeTab === "tracking" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h2 className="mb-6 border-b border-border pb-3 text-xl font-bold text-primary">SEO & Tracking Integrations</h2>
                <div className="grid gap-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Google Analytics Tracking Code (Global Site Tag)</label>
                    <textarea name="googleAnalyticsCode" value={settings.googleAnalyticsCode} onChange={handleInputChange} rows="5" className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-xs text-text focus:border-teal focus:outline-none" placeholder="<script>...</script>"></textarea>
                    <p className="mt-1.5 text-[10px] text-muted-foreground">Include the complete script tag. Injected into page headers automatically.</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Facebook Pixel Tracking Code</label>
                    <textarea name="facebookPixelCode" value={settings.facebookPixelCode} onChange={handleInputChange} rows="5" className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-xs text-text focus:border-teal focus:outline-none" placeholder="<script>...</script>"></textarea>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Google Search Console Verification Meta Tag</label>
                    <input type="text" name="googleSearchConsoleVerification" value={settings.googleSearchConsoleVerification} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-xs text-text focus:border-teal focus:outline-none" placeholder='<meta name="google-site-verification" content="..." />' />
                  </div>
                </div>
              </div>
            )}

            {/* SOCIAL */}
            {activeTab === "social" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h2 className="mb-6 border-b border-border pb-3 text-xl font-bold text-primary">Social Media Links</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Facebook URL</label>
                    <input type="url" name="facebookUrl" value={settings.facebookUrl} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Instagram URL</label>
                    <input type="url" name="instagramUrl" value={settings.instagramUrl} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">YouTube URL</label>
                    <input type="url" name="youtubeUrl" value={settings.youtubeUrl} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">LinkedIn URL</label>
                    <input type="url" name="linkedinUrl" value={settings.linkedinUrl} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT */}
            {activeTab === "contact" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h2 className="mb-6 border-b border-border pb-3 text-xl font-bold text-primary">Contact Information</h2>
                <div className="grid gap-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Primary Email</label>
                      <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Working Hours</label>
                      <input type="text" name="contactWorkingHours" value={settings.contactWorkingHours} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Primary Phone</label>
                      <input type="text" name="contactPhonePrimary" value={settings.contactPhonePrimary} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">Secondary Phone (Optional)</label>
                      <input type="text" name="contactPhoneSecondary" value={settings.contactPhoneSecondary} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Full Address</label>
                    <textarea name="contactFullAddress" value={settings.contactFullAddress} onChange={handleInputChange} rows="2" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-teal focus:outline-none"></textarea>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">Google Map Embed URL (iframe src)</label>
                    <textarea name="googleMapEmbedUrl" value={settings.googleMapEmbedUrl} onChange={handleInputChange} rows="4" className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-xs text-text focus:border-teal focus:outline-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* PWA */}
            {activeTab === "pwa" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h2 className="mb-6 border-b border-border pb-3 text-xl font-bold text-primary">Progressive Web App (PWA) Settings</h2>
                <div className="grid gap-5">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="pwaEnable" name="pwaEnable" checked={settings.pwaEnable} onChange={handleInputChange} className="size-5 cursor-pointer rounded text-teal focus:ring-teal" />
                    <label htmlFor="pwaEnable" className="cursor-pointer text-sm font-bold text-primary">Enable PWA Installability</label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">PWA App Name</label>
                      <input type="text" name="pwaAppName" value={settings.pwaAppName} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-primary">PWA Short Name</label>
                      <input type="text" name="pwaShortName" value={settings.pwaShortName} onChange={handleInputChange} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-primary">PWA App Launcher Icon (512x512 recommended)</label>
                    <div className="flex items-end gap-4">
                      {previews.pwaIcon && <img src={previews.pwaIcon} alt="PWA Icon" className="size-16 rounded-2xl border border-border object-contain p-1 shadow-sm" />}
                      <input type="file" accept="image/png,image/jpeg" onChange={(e) => handleFileChange(e, "pwaIcon")} className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BRANDING */}
            {activeTab === "branding" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h2 className="mb-6 border-b border-border pb-3 text-xl font-bold text-primary">Branding Assets</h2>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-xs font-bold text-primary">Header Logo</label>
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex h-24 w-48 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-gray-50">
                        {previews.headerLogo ? <img src={previews.headerLogo} alt="Header Logo" className="h-full w-full object-contain p-2" /> : <span className="text-xs text-text-light">No Logo</span>}
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "headerLogo")} className="w-full text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold text-primary">Footer Logo</label>
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex h-24 w-48 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-teal-dark">
                        {previews.footerLogo ? <img src={previews.footerLogo} alt="Footer Logo" className="h-full w-full object-contain p-2" /> : <span className="text-xs text-white/50">No Logo</span>}
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "footerLogo")} className="w-full text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-bold text-primary">Favicon (16x16 / 32x32)</label>
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-gray-50">
                        {previews.favicon ? <img src={previews.favicon} alt="Favicon" className="size-full object-contain p-1" /> : <span className="text-xs text-text-light">None</span>}
                      </div>
                      <input type="file" accept=".ico,.png,.svg" onChange={(e) => handleFileChange(e, "favicon")} className="w-full text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  )
}
