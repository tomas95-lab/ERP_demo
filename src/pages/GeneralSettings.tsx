import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebaseConfig"

export const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    company: "", industry: "", taxid: "", phone: "", email: "", web: "",
    city: "", state: "", zip: "", country: "", currency: "", time: "",
    defaultProject: "", defaultCategory: "", defaultPaymentTerms: "",
    language: "", notifications: "", autosave: "",
  })

  const [errors, setErrors] = useState({
    email: false,
    zip: false,
    phone: false,
  })

  // Load from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "general")
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setFormData(docSnap.data() as typeof formData)
      }
    }
    fetchSettings()
  }, [])

  const validate = () => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    const zipRegex = /^\d{4,10}$/
    const phoneRegex = /^\+?\d{6,15}$/
    setErrors({
      email: !emailRegex.test(formData.email),
      zip: !zipRegex.test(formData.zip),
      phone: !phoneRegex.test(formData.phone),
    })
    return emailRegex.test(formData.email) &&
      zipRegex.test(formData.zip) &&
      phoneRegex.test(formData.phone)
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      await setDoc(doc(db, "settings", "general"), formData)
      alert("Settings saved to Firestore!")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">General Settings</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Configure core system preferences such as company information, default values, and regional settings.
      </p>

      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>Company Information</CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" value={formData.company} onChange={(e) => handleChange("company", e.target.value)} placeholder="Enter company name" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" value={formData.industry} onChange={(e) => handleChange("industry", e.target.value)} placeholder="e.g. Construction" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="taxid">Business ID / Tax ID</Label>
                <Input id="taxid" value={formData.taxid} onChange={(e) => handleChange("taxid", e.target.value)} placeholder="e.g. 123456789" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="Enter your Phone Number" className={errors.phone ? "border-red-500" : ""} />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="e.g. construction@xyz.com" className={errors.email ? "border-red-500" : ""} />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="web">Company Site</Label>
                <Input id="web" value={formData.web} onChange={(e) => handleChange("web", e.target.value)} placeholder="e.g. www.construction.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="City Name" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" value={formData.state} onChange={(e) => handleChange("state", e.target.value)} placeholder="e.g. California" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input id="zip" value={formData.zip} onChange={(e) => handleChange("zip", e.target.value)} placeholder="e.g. 12345678" className={errors.zip ? "border-red-500" : ""} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={formData.country} onChange={(e) => handleChange("country", e.target.value)} placeholder="Country" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Regional Settings</CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value={formData.currency} onChange={(e) => handleChange("currency", e.target.value)} placeholder="Enter your currency" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="time">Time Zone</Label>
                <Input id="time" value={formData.time} onChange={(e) => handleChange("time", e.target.value)} placeholder="Enter your Time Zone" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Defaults</CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="defaultProject">Default Project</Label>
                <Input id="defaultProject" value={formData.defaultProject} onChange={(e) => handleChange("defaultProject", e.target.value)} placeholder="e.g. Residential Complex A" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="defaultCategory">Default Expense Category</Label>
                <Input id="defaultCategory" value={formData.defaultCategory} onChange={(e) => handleChange("defaultCategory", e.target.value)} placeholder="e.g. Materials" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="defaultPaymentTerms">Default Payment Terms</Label>
                <Input id="defaultPaymentTerms" value={formData.defaultPaymentTerms} onChange={(e) => handleChange("defaultPaymentTerms", e.target.value)} placeholder="e.g. Net 30 days" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>System Preferences</CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="language">Language</Label>
                <Input id="language" value={formData.language} onChange={(e) => handleChange("language", e.target.value)} placeholder="e.g. English" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="notifications">Email Notifications</Label>
                <Input id="notifications" value={formData.notifications} onChange={(e) => handleChange("notifications", e.target.value)} placeholder="e.g. Enabled / Disabled" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="autosave">Auto-Save Interval (min)</Label>
                <Input id="autosave" value={formData.autosave} onChange={(e) => handleChange("autosave", e.target.value)} placeholder="e.g. 5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-4">
          <Button type="submit" className="w-40 bg-blue-700">Save</Button>
        </div>
        {Object.values(errors).some((error) => error) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please correct the highlighted fields: make sure the email, phone number, and ZIP code are valid.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
