import { createContext, useContext, useState, useEffect } from "react"
import { gallery as galleryData } from "../data/content"

const AppContext = createContext(null)

const INITIAL_DONORS = [
  { id: 1, name: "Ramesh Kumar", email: "ramesh@email.com", amount: 2500, campaign: "Medical Support", date: "2024-05-12", status: "success", txnId: "pay_RZP001" },
  { id: 2, name: "Anita Sharma", email: "anita@email.com", amount: 1000, campaign: "School Supplies", date: "2024-05-10", status: "success", txnId: "pay_RZP002" },
  { id: 3, name: "Vikram Singh", email: "vikram@email.com", amount: 500, campaign: "Feed a Family", date: "2024-05-08", status: "success", txnId: "pay_RZP003" },
  { id: 4, name: "Priya Nair", email: "priya@email.com", amount: 5000, campaign: "Medical Support", date: "2024-05-06", status: "success", txnId: "pay_RZP004" },
  { id: 5, name: "Suresh Patel", email: "suresh@email.com", amount: 1000, campaign: "School Supplies", date: "2024-05-04", status: "failed", txnId: "pay_RZP005" },
]

const INITIAL_VOLUNTEERS = [
  { id: 1, name: "Arjun Mehta", email: "arjun@email.com", phone: "9876543210", role: "Education Volunteer", city: "Delhi", status: "approved", appliedDate: "2024-05-01", hours: 24 },
  { id: 2, name: "Sunita Rao", email: "sunita@email.com", phone: "9876543211", role: "Health Camp Volunteer", city: "Mumbai", status: "pending", appliedDate: "2024-05-10", hours: 0 },
  { id: 3, name: "Kiran Das", email: "kiran@email.com", phone: "9876543212", role: "Food Distribution", city: "Bangalore", status: "approved", appliedDate: "2024-04-20", hours: 36 },
  { id: 4, name: "Meena Joshi", email: "meena@email.com", phone: "9876543213", role: "Women Empowerment", city: "Pune", status: "pending", appliedDate: "2024-05-12", hours: 0 },
  { id: 5, name: "Ravi Kumar", email: "ravi@email.com", phone: "9876543214", role: "Education Volunteer", city: "Chennai", status: "rejected", appliedDate: "2024-04-15", hours: 0 },
]

// password is last 4 digits of phone for demo
const getPassword = (phone) => phone.slice(-4)

export function AppProvider({ children }) {
  const [globalSettings, setGlobalSettings] = useState(null)
  const [bankAccounts, setBankAccounts] = useState([])
  const [donors, setDonors] = useState(INITIAL_DONORS)
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS)
  const [galleryImgs, setGalleryImgs] = useState(galleryData)
  const [volunteerUpdates, setVolunteerUpdates] = useState([
    { id: 1, volunteerId: 1, title: "Education Camp Scheduled", message: "You are assigned to the Education Camp in Delhi on June 10. Please confirm attendance.", date: "2024-05-20", type: "assignment" },
    { id: 2, volunteerId: 3, title: "New Activity Added", message: "A food distribution drive has been added for June 5 in Bangalore. You are invited to participate.", date: "2024-05-18", type: "activity" },
  ])
  
  const [volunteerActivities, setVolunteerActivities] = useState([])
  const [volunteerCampaigns, setVolunteerCampaigns] = useState([])
  const [volunteerPrograms, setVolunteerPrograms] = useState([])
  const [volunteerCertificates, setVolunteerCertificates] = useState([])
  const [loggedInVolunteer, setLoggedInVolunteer] = useState(() => {
    const saved = localStorage.getItem('loggedInVolunteer')
    return saved ? JSON.parse(saved) : null
  })
  const [loggedInMember, setLoggedInMember] = useState(() => {
    const saved = localStorage.getItem('loggedInMember')
    return saved ? JSON.parse(saved) : null
  })
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true'
  })

  useEffect(() => {
    const fetchAndApplySettings = async () => {
      try {
        const [settingsRes, bankAccountsRes] = await Promise.all([
          fetch("http://localhost:5000/api/settings"),
          fetch("http://localhost:5000/api/bank-accounts")
        ])
        
        const data = await settingsRes.json()
        const bankData = await bankAccountsRes.json()

        if (bankData.success && bankData.bankAccounts) {
          setBankAccounts(bankData.bankAccounts)
        }

        if (data.success && data.settings) {
          setGlobalSettings(data.settings)
          const s = data.settings

          // Apply SEO Tags
          if (s.metaTitle) document.title = s.metaTitle
          
          let metaDesc = document.querySelector('meta[name="description"]')
          if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc) }
          if (s.metaDescription) metaDesc.content = s.metaDescription

          let metaKeywords = document.querySelector('meta[name="keywords"]')
          if (!metaKeywords) { metaKeywords = document.createElement('meta'); metaKeywords.name = 'keywords'; document.head.appendChild(metaKeywords) }
          if (s.metaKeywords) metaKeywords.content = s.metaKeywords

          let metaAuthor = document.querySelector('meta[name="author"]')
          if (!metaAuthor) { metaAuthor = document.createElement('meta'); metaAuthor.name = 'author'; document.head.appendChild(metaAuthor) }
          if (s.metaAuthor) metaAuthor.content = s.metaAuthor

          // Apply Favicon
          if (s.faviconUrl) {
            let link = document.querySelector("link[rel~='icon']")
            if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link) }
            link.href = s.faviconUrl
          }

          // Inject Scripts (Dangerous HTML)
          if (s.googleAnalyticsCode && !document.getElementById('ga-script-injected')) {
            const div = document.createElement('div')
            div.id = 'ga-script-injected'
            div.innerHTML = s.googleAnalyticsCode
            Array.from(div.querySelectorAll('script')).forEach(oldScript => {
              const newScript = document.createElement('script')
              Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
              newScript.appendChild(document.createTextNode(oldScript.innerHTML))
              document.head.appendChild(newScript)
            })
          }

          if (s.facebookPixelCode && !document.getElementById('fb-script-injected')) {
            const div = document.createElement('div')
            div.id = 'fb-script-injected'
            div.innerHTML = s.facebookPixelCode
            Array.from(div.querySelectorAll('script')).forEach(oldScript => {
              const newScript = document.createElement('script')
              Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
              newScript.appendChild(document.createTextNode(oldScript.innerHTML))
              document.head.appendChild(newScript)
            })
          }

          // Google Site Verification Tag
          if (s.googleSearchConsoleVerification) {
            const div = document.createElement('div')
            div.innerHTML = s.googleSearchConsoleVerification
            const metaTag = div.querySelector('meta')
            if (metaTag) document.head.appendChild(metaTag)
          }

          // Generate simple Web App Manifest dynamically if PWA enabled
          if (s.pwaEnable) {
            let manifestLink = document.querySelector('link[rel="manifest"]')
            if (!manifestLink) { manifestLink = document.createElement('link'); manifestLink.rel = 'manifest'; document.head.appendChild(manifestLink) }
            const manifestData = {
              name: s.pwaAppName || s.siteTitle,
              short_name: s.pwaShortName || s.siteTitle,
              start_url: "/",
              display: "standalone",
              icons: s.pwaIconUrl ? [{ src: s.pwaIconUrl, sizes: "512x512", type: "image/png" }] : []
            }
            const blob = new Blob([JSON.stringify(manifestData)], { type: 'application/json' })
            manifestLink.href = URL.createObjectURL(blob)
          }
        }
      } catch (err) {
        console.error("Failed to fetch global settings:", err)
      }
    }
    fetchAndApplySettings()
  }, [])

    useEffect(() => {
    const fetchVolunteerData = async () => {
      if (!loggedInVolunteer?.id) return;
      try {
        const id = loggedInVolunteer.id;
        const [actRes, campRes, progRes, certRes] = await Promise.all([
          fetch(`http://localhost:5000/api/volunteers/${id}/activities`),
          fetch(`http://localhost:5000/api/volunteers/${id}/campaigns`),
          fetch(`http://localhost:5000/api/volunteers/${id}/programs`),
          fetch(`http://localhost:5000/api/volunteers/${id}/certificates`),
        ]);
        const [act, camp, prog, cert] = await Promise.all([actRes.json(), campRes.json(), progRes.json(), certRes.json()]);
        
        if (act.success) setVolunteerActivities(act.activities);
        if (camp.success) setVolunteerCampaigns(camp.campaigns);
        if (prog.success) setVolunteerPrograms(prog.programs);
        if (cert.success) setVolunteerCertificates(cert.certificates);
      } catch (err) {
        console.error("Failed to fetch volunteer data:", err);
      }
    };
    fetchVolunteerData();
  }, [loggedInVolunteer]);

  const adminLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (data.success && data.user.role === 'admin') {
        setIsAdminLoggedIn(true)
        localStorage.setItem('isAdminLoggedIn', 'true')
        return { success: true }
      }
      return { success: false, error: data.message || "Invalid admin credentials." }
    } catch (error) {
      return { success: false, error: "Network error. Please try again later." }
    }
  }

  const adminLogout = () => {
    setIsAdminLoggedIn(false)
    localStorage.removeItem('isAdminLoggedIn')
  }

  const volunteerLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (data.success && data.user.role === 'volunteer') {
        // Fetch full volunteer info from the static list (as backend doesn't have the full schema yet)
        const vol = volunteers.find((v) => v.email === email)
        if (vol) {
          setLoggedInVolunteer(vol)
          localStorage.setItem('loggedInVolunteer', JSON.stringify(vol))
        } else {
          // If not in static list, use the db data
          const dbVol = { 
            id: data.user.id, 
            name: data.user.name || "Volunteer", 
            email: data.user.email, 
            role: data.user.area_of_interest || data.user.role,
            phone: data.user.phone,
            city: data.user.city,
            status: data.user.status,
            appliedDate: data.user.appliedDate ? new Date(data.user.appliedDate).toISOString().slice(0,10) : "N/A",
            photo: data.user.photo
          }
          setLoggedInVolunteer(dbVol)
          localStorage.setItem('loggedInVolunteer', JSON.stringify(dbVol))
        }
        return { success: true }
      }
      return { success: false, error: data.message || "Invalid volunteer credentials." }
    } catch (error) {
      return { success: false, error: "Network error. Please try again later." }
    }
  }

  const volunteerLogout = () => {
    setLoggedInVolunteer(null)
    localStorage.removeItem('loggedInVolunteer')
  }

  const memberLogin = (member) => {
    setLoggedInMember(member)
    localStorage.setItem('loggedInMember', JSON.stringify(member))
  }

  const memberLogout = () => {
    setLoggedInMember(null)
    localStorage.removeItem('loggedInMember')
  }

  const addDonor = (donor) =>
    setDonors((prev) => [{ ...donor, id: Date.now(), date: new Date().toISOString().slice(0, 10) }, ...prev])

  const updateVolunteerStatus = (id, status) =>
    setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)))

  const addVolunteer = (vol) =>
    setVolunteers((prev) => [
      { ...vol, id: Date.now(), status: "pending", appliedDate: new Date().toISOString().slice(0, 10), hours: 0 },
      ...prev,
    ])

  const addVolunteerUpdate = (update) =>
    setVolunteerUpdates((prev) => [{ ...update, id: Date.now(), date: new Date().toISOString().slice(0, 10) }, ...prev])

  const deleteVolunteerUpdate = (id) =>
    setVolunteerUpdates((prev) => prev.filter((u) => u.id !== id))

  const addGalleryImg = (url) => setGalleryImgs((prev) => [...prev, url])
  const removeGalleryImg = (url) => setGalleryImgs((prev) => prev.filter((u) => u !== url))

  return (
    <AppContext.Provider value={{
      globalSettings, bankAccounts, donors, volunteers, galleryImgs, volunteerUpdates, loggedInVolunteer, loggedInMember,
      volunteerActivities, volunteerCampaigns, volunteerPrograms, volunteerCertificates,
      addDonor, updateVolunteerStatus, addVolunteer,
      addVolunteerUpdate, deleteVolunteerUpdate,
      volunteerLogin, volunteerLogout,
      memberLogin, memberLogout,
      adminLogin, adminLogout, isAdminLoggedIn,
      addGalleryImg, removeGalleryImg,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
