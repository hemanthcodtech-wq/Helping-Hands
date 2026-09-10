import { useState, useEffect, useRef } from "react"
import { Pencil, Trash2, Plus, X, Upload, Building } from "lucide-react"

export default function AdminBankAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form, setForm] = useState({
    id: null,
    bank_name: "",
    account_name: "",
    account_number: "",
    ifsc_code: "",
    branch: "",
    is_active: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bank-accounts")
      const data = await res.json()
      if (data.success) {
        setAccounts(data.bankAccounts)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) return
    try {
      await fetch(`http://localhost:5000/api/bank-accounts/${id}`, { method: "DELETE" })
      fetchAccounts()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData()
    formData.append("bank_name", form.bank_name)
    formData.append("account_name", form.account_name)
    formData.append("account_number", form.account_number)
    formData.append("ifsc_code", form.ifsc_code)
    formData.append("branch", form.branch)
    formData.append("is_active", form.is_active)
    
    if (imageFile) {
      formData.append("qr_code_image", imageFile)
    }

    try {
      const method = form.id ? "PUT" : "POST"
      const url = form.id 
        ? `http://localhost:5000/api/bank-accounts/${form.id}`
        : "http://localhost:5000/api/bank-accounts"

      await fetch(url, {
        method,
        body: formData,
      })

      setIsModalOpen(false)
      fetchAccounts()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const openAddModal = () => {
    setForm({ id: null, bank_name: "", account_name: "", account_number: "", ifsc_code: "", branch: "", is_active: true })
    setImageFile(null)
    setImagePreview("")
    setIsModalOpen(true)
  }

  const openEditModal = (account) => {
    setForm({
      id: account.id,
      bank_name: account.bank_name,
      account_name: account.account_name,
      account_number: account.account_number,
      ifsc_code: account.ifsc_code,
      branch: account.branch || "",
      is_active: account.is_active,
    })
    setImageFile(null)
    setImagePreview(account.qr_code_url || "")
    setIsModalOpen(true)
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Bank Accounts</h1>
          <p className="text-sm text-muted-foreground">Manage your organization's bank accounts and QR codes.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white transition hover:bg-[#065f69]"
        >
          <Plus className="size-4" /> Add Account
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary-soft/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-bold">Bank / Account Name</th>
                <th className="px-6 py-4 font-bold">Account Info</th>
                <th className="px-6 py-4 font-bold">QR Code</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {accounts.map((acc) => (
                <tr key={acc.id} className="transition hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-primary">{acc.bank_name}</p>
                    <p className="text-xs text-muted-foreground">{acc.account_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-primary">{acc.account_number}</p>
                    <p className="text-xs text-muted-foreground">IFSC: {acc.ifsc_code}</p>
                  </td>
                  <td className="px-6 py-4">
                    {acc.qr_code_url ? (
                      <img src={acc.qr_code_url} alt="QR Code" className="size-10 rounded border object-cover" />
                    ) : (
                      <span className="text-xs text-muted-foreground">No QR</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold ${acc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {acc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(acc)}
                        className="grid size-8 place-items-center rounded-lg text-teal hover:bg-teal/10"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(acc.id)}
                        className="grid size-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No bank accounts found. Click "Add Account" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !submitting && setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold text-primary">{form.id ? "Edit Bank Account" : "Add Bank Account"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 hover:bg-muted" disabled={submitting}>
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">Bank Name *</label>
                  <input
                    type="text"
                    required
                    value={form.bank_name}
                    onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                    placeholder="e.g. State Bank of India"
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:border-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">Account Name *</label>
                  <input
                    type="text"
                    required
                    value={form.account_name}
                    onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                    placeholder="e.g. Helping Hands Foundation"
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:border-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">Account Number *</label>
                  <input
                    type="text"
                    required
                    value={form.account_number}
                    onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:border-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-primary">IFSC Code *</label>
                  <input
                    type="text"
                    required
                    value={form.ifsc_code}
                    onChange={(e) => setForm({ ...form, ifsc_code: e.target.value })}
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:border-teal focus:outline-none uppercase"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-primary">Branch Name (Optional)</label>
                  <input
                    type="text"
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:border-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-primary">UPI QR Code Image (Optional)</label>
                <div 
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background py-8 transition hover:border-teal/50 hover:bg-primary-soft/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg object-contain shadow-sm" />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-primary-soft text-teal">
                        <Upload className="size-5" />
                      </div>
                      <p className="text-sm font-semibold text-primary">Click to upload QR Code</p>
                      <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="size-4 rounded border-gray-300 text-teal focus:ring-teal"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-primary">Active (Show on website)</label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-teal px-6 py-2 text-sm font-bold text-white hover:bg-[#065f69] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
