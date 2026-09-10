import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Programs from "./pages/Programs"
import Campaigns from "./pages/Campaigns"
import Donate from "./pages/Donate"
import Volunteer from "./pages/Volunteer"
import SupportUs from "./pages/SupportUs"
import Contact from "./pages/Contact"
import Teams from "./pages/Teams"
import TeamGroup from "./pages/TeamGroup"
import Resources from "./pages/Resources"
import ResourcePage from "./pages/ResourcePage"
import TermsConditions from "./pages/TermsConditions"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import Disclaimer from "./pages/Disclaimer"
import RefundPolicy from "./pages/RefundPolicy"
import AboutSubpage from "./pages/AboutSubpage"
import Events from "./pages/Events"
import NotFound from "./pages/NotFound"
import CampaignDetail from "./pages/CampaignDetail"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminDonors from "./pages/admin/AdminDonors"
import AdminVolunteers from "./pages/admin/AdminVolunteers"
import AdminReports from "./pages/admin/AdminReports"
import AdminDocuments from "./pages/admin/AdminDocuments"
import AdminContent from "./pages/admin/AdminContent"
import AdminResources from "./pages/admin/AdminResources"
import AdminPrograms from "./pages/admin/AdminPrograms"
import AdminEvents from "./pages/admin/AdminEvents"
import AdminCampaigns from "./pages/admin/AdminCampaigns"
import AdminCampaignRevenue from "./pages/admin/AdminCampaignRevenue"
import AdminAllCampaignRevenue from "./pages/admin/AdminAllCampaignRevenue"
import AdminTeams from "./pages/admin/AdminTeams"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminVolunteerRequests from "./pages/admin/AdminVolunteerRequests"
import AdminCertificates from "./pages/admin/AdminCertificates"
import AdminPartners from "./pages/admin/AdminPartners"
import AdminTestimonials from "./pages/admin/AdminTestimonials"
import AdminSettings from "./pages/admin/AdminSettings"
import AdminBankAccounts from "./pages/admin/AdminBankAccounts"
import AdminMembers from "./pages/admin/AdminMembers"
import VolunteerLogin from "./pages/volunteer/VolunteerLogin"
import VolunteerRegister from "./pages/volunteer/VolunteerRegister"
import VolunteerUpdates from "./pages/volunteer/VolunteerUpdates"
import MemberLogin from "./pages/member/MemberLogin"
import MemberLayout from "./pages/member/MemberLayout"
import MemberDashboard from "./pages/member/MemberDashboard"
import MemberDonations from "./pages/member/MemberDonations"
import MemberDocuments from "./pages/member/MemberDocuments"
import MemberProfile from "./pages/member/MemberProfile"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="donors" element={<AdminDonors />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="volunteer-requests" element={<AdminVolunteerRequests />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="campaigns/:id" element={<AdminCampaignRevenue />} />
          <Route path="campaigns-revenue" element={<AdminAllCampaignRevenue />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="bank-accounts" element={<AdminBankAccounts />} />
        </Route>
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<MemberDashboard />} />
          <Route path="donations" element={<MemberDonations />} />
          <Route path="documents" element={<MemberDocuments />} />
          <Route path="profile" element={<MemberProfile />} />
        </Route>
        <Route path="/*" element={<><Header /><Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/leadership" element={<AboutSubpage />} />
          <Route path="/about/terms" element={<TermsConditions />} />
          <Route path="/about/privacy" element={<PrivacyPolicy />} />
          <Route path="/about/disclaimer" element={<Disclaimer />} />
          <Route path="/about/refund" element={<RefundPolicy />} />
          <Route path="/about/reports" element={<ResourcePage />} />
          <Route path="/about/reports/:type" element={<ResourcePage />} />
          <Route path="/about/certificates" element={<ResourcePage />} />
          <Route path="/about/certificates/:type" element={<ResourcePage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:type" element={<ResourcePage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:group" element={<TeamGroup />} />
          <Route path="/support-us" element={<SupportUs />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/volunteer/register" element={<VolunteerRegister />} />
          <Route path="/volunteer/login" element={<VolunteerLogin />} />
          <Route path="/volunteer/updates" element={<VolunteerUpdates />} />
          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes><Footer /></>} />
      </Routes>
    </div>
  )
}
