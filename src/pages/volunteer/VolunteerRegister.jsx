import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Mail, ShieldCheck, Upload } from "lucide-react"
import { volunteerRoles } from "../../data/content"
import Logo from "../../components/Common/Logo"

export default function VolunteerRegister() {
  const navigate = useNavigate()
  const [applyForm, setApplyForm] = useState({ 
    name: "", role: "", gender: "", parent_name: "", dob: "", profession: "", 
    blood_group: "", email: "", phone: "", password: "", aadhaar: "",
    state: "", district: "", working_area: "", pincode: "", address: "",
    message: "", otp: "", profile_picture: null, aadhaar_front: null, aadhaar_back: null
  })
  
  const [step, setStep] = useState(1) // 1 = Details, 2 = OTP, 3 = Success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const setApply = (k) => (e) => setApplyForm((p) => ({ ...p, [k]: e.target.value }))
  const setFile = (k) => (e) => setApplyForm((p) => ({ ...p, [k]: e.target.files[0] }))

  const handleSendOTP = async (e) => {
    e.preventDefault()
    
    // Ensure files are selected
    if (!applyForm.profile_picture || !applyForm.aadhaar_front || !applyForm.aadhaar_back) {
      setError("Please upload all required documents (Profile Picture, Aadhaar Front & Back).");
      return;
    }

    setLoading(true)
    setError("")
    try {
      const response = await fetch("https://helpinghandsbe.vercel.app/api/volunteers/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: applyForm.email, name: applyForm.name })
      })
      const data = await response.json()
      if (data.success) {
        setStep(2)
      } else {
        setError(data.message || "Failed to send OTP")
      }
    } catch (err) {
      setError("Network error. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndApply = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData();
    Object.keys(applyForm).forEach(key => {
      if (applyForm[key] !== null && applyForm[key] !== undefined && applyForm[key] !== "") {
        formData.append(key, applyForm[key]);
      }
    });

    try {
      const response = await fetch("https://helpinghandsbe.vercel.app/api/volunteers/apply", {
        method: "POST",
        body: formData
      })
      const data = await response.json()
      
      if (data.success) {
        setStep(3)
      } else {
        setError(data.message || "Failed to submit application")
      }
    } catch (err) {
      setError("Network error. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[10px] text-primary placeholder:text-muted-foreground focus:border-teal focus:outline-none sm:rounded-2xl sm:text-sm"
  const labelCls = "mb-1.5 block text-[10px] font-bold text-primary sm:text-xs"
  const sectionTitleCls = "col-span-full mt-4 mb-2 text-xs font-extrabold uppercase tracking-widest text-teal border-b border-border pb-2"

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="grid size-12 place-items-center rounded-full border border-teal/30 bg-teal/10">
            <Logo className="w-10 h-auto" />
          </span>
          <h1 className="font-heading text-[22px] font-extrabold text-primary sm:text-3xl">Volunteer Registration</h1>
          <p className="text-[10px] text-muted-foreground sm:text-sm">Join Helping Hands Foundation and make a difference.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 3 && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:rounded-3xl sm:p-10">
              <CheckCircle className="size-16 text-teal" />
              <h2 className="font-heading text-[18px] font-extrabold text-primary sm:text-2xl">Application Submitted!</h2>
              <p className="text-[10px] text-muted-foreground sm:text-sm leading-relaxed">
                Thank you <strong>{applyForm.name}</strong>! Your comprehensive profile has been sent to our admins for verification. Once your ID documents are approved, you will be notified via email and can login using your password.
              </p>
              <button onClick={() => navigate("/")}
                className="mt-4 rounded-xl bg-teal px-6 py-3 text-[11px] font-bold text-white transition hover:bg-teal-dark sm:rounded-2xl sm:text-sm">
                Return Home
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.form key="form1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSendOTP} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                
                <h3 className={sectionTitleCls}>Personal Information</h3>
                
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input required value={applyForm.name} onChange={setApply("name")} placeholder="Enter full name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Gender *</label>
                  <select required value={applyForm.gender} onChange={setApply("gender")} className={inputCls}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Date of Birth *</label>
                  <input required type="date" value={applyForm.dob} onChange={setApply("dob")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>S/o D/o W/o (Parent/Spouse)</label>
                  <input value={applyForm.parent_name} onChange={setApply("parent_name")} placeholder="Parent / spouse name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Profession *</label>
                  <input required value={applyForm.profession} onChange={setApply("profession")} placeholder="Enter profession" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Blood Group</label>
                  <select value={applyForm.blood_group} onChange={setApply("blood_group")} className={inputCls}>
                    <option value="">Select group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>

                <h3 className={sectionTitleCls}>Account Details</h3>

                <div>
                  <label className={labelCls}>Area of Interest *</label>
                  <select required value={applyForm.role} onChange={setApply("role")} className={inputCls}>
                    <option value="">Select interest</option>
                    {volunteerRoles.map((r) => <option key={r.id} value={r.title}>{r.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input required type="email" value={applyForm.email} onChange={setApply("email")} placeholder="you@example.com" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mobile Number *</label>
                  <input required pattern="[0-9]{10}" value={applyForm.phone} onChange={setApply("phone")} placeholder="10-digit mobile number" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Password *</label>
                  <input required type="password" minLength={6} value={applyForm.password} onChange={setApply("password")} placeholder="Create a password" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Aadhaar Number *</label>
                  <input required pattern="[0-9]{12}" value={applyForm.aadhaar} onChange={setApply("aadhaar")} placeholder="12-digit Aadhaar number" className={inputCls} />
                </div>

                <h3 className={sectionTitleCls}>Address Details</h3>

                <div>
                  <label className={labelCls}>State *</label>
                  <input required value={applyForm.state} onChange={setApply("state")} placeholder="Enter state" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>District *</label>
                  <input required value={applyForm.district} onChange={setApply("district")} placeholder="Enter district" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Working Area *</label>
                  <input required value={applyForm.working_area} onChange={setApply("working_area")} placeholder="Village / Mandal / City" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Pincode *</label>
                  <input required pattern="[0-9]{6}" value={applyForm.pincode} onChange={setApply("pincode")} placeholder="6-digit pincode" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Full Address *</label>
                  <input required value={applyForm.address} onChange={setApply("address")} placeholder="House number, street, village/city, district" className={inputCls} />
                </div>

                <h3 className={sectionTitleCls}>Document Uploads (JPG, PNG or PDF)</h3>

                <div>
                  <label className={labelCls}>Profile Picture *</label>
                  <input required type="file" accept="image/*" onChange={setFile("profile_picture")} className="w-full text-xs file:mr-3 file:rounded-xl file:border-0 file:bg-teal file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white" />
                </div>
                <div>
                  <label className={labelCls}>Aadhaar Card — Front *</label>
                  <input required type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={setFile("aadhaar_front")} className="w-full text-xs file:mr-3 file:rounded-xl file:border-0 file:bg-teal file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white" />
                </div>
                <div>
                  <label className={labelCls}>Aadhaar Card — Back *</label>
                  <input required type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={setFile("aadhaar_back")} className="w-full text-xs file:mr-3 file:rounded-xl file:border-0 file:bg-teal file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white" />
                </div>
                
              </div>
              
              {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-[11px] font-bold text-red-500 sm:text-xs text-center">{error}</p>}

              <button type="submit" disabled={loading}
                className="mx-auto mt-8 flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-teal py-3 text-[11px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-60 active:scale-[0.98] sm:rounded-2xl sm:text-sm">
                <Mail className="size-4" /> {loading ? "Processing..." : "Verify Email with OTP"}
              </button>
              
              <div className="mt-4 text-center">
                <Link to="/volunteer/login" className="text-[10px] font-bold text-teal hover:underline sm:text-xs">
                  Already registered? Login here
                </Link>
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form key="form2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerifyAndApply} className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-8">
              <div className="mb-6 text-center">
                <ShieldCheck className="mx-auto mb-3 size-12 text-teal" />
                <h3 className="font-heading text-[18px] font-bold text-primary sm:text-xl">Verify Email</h3>
                <p className="mt-2 text-[10px] text-muted-foreground sm:text-xs">Enter the 6-digit OTP sent to <strong>{applyForm.email}</strong></p>
              </div>

              <div className="space-y-4">
                <input required autoFocus maxLength={6} value={applyForm.otp} onChange={setApply("otp")} placeholder="OTP (••••••)" 
                  className={`${inputCls} text-center tracking-widest font-mono text-2xl py-3`} />
              </div>
              
              {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[11px] font-bold text-red-500 sm:text-xs text-center">{error}</p>}

              <div className="mt-6 flex flex-col gap-3">
                <button type="submit" disabled={loading || applyForm.otp.length < 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-3 text-[11px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-60 active:scale-[0.98] sm:rounded-2xl sm:text-sm">
                  {loading ? "Submitting Application..." : "Verify & Complete Registration"}
                </button>
                <button type="button" onClick={() => { setStep(1); setError(""); }} disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-transparent py-3 text-[11px] font-bold text-primary transition hover:bg-muted disabled:opacity-60 active:scale-[0.98] sm:rounded-2xl sm:text-sm">
                  Back to Form
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
