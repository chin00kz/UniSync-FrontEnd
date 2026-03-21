import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  UserIcon, 
  PhoneIcon, 
  MailIcon, 
  ShieldIcon, 
  HistoryIcon, 
  SaveIcon,
  Loader2Icon,
  CheckCircle2Icon,
  ClockIcon
} from "lucide-react"

export default function AccountPage() {
  const [user, setUser] = useState(null)
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "" })
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    fetchProfile()
    fetchMyLogs()
  }, [])

  const fetchProfile = async () => {
    try {
      const adminId = JSON.parse(localStorage.getItem("user"))?.id
      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: { "x-admin-id": adminId }
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
        setFormData({ name: data.data.name, phone: data.data.phone || "" })
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMyLogs = async () => {
    try {
      const adminId = JSON.parse(localStorage.getItem("user"))?.id
      const response = await fetch("http://localhost:5000/api/audit-logs/me", {
        headers: { "x-admin-id": adminId }
      })
      const data = await response.json()
      if (data.success) {
        setLogs(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: "", text: "" })
    try {
      const adminId = JSON.parse(localStorage.getItem("user"))?.id
      const response = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-id": adminId 
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
        setMessage({ type: "success", text: "Profile updated successfully!" })
        
        // Update localStorage name if changed
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        userData.name = data.data.name
        localStorage.setItem("user", JSON.stringify(userData))
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">UniSync</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Account Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground font-medium">Manage your professional profile and review recent activity.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Profile Overview Card */}
            <div className="md:col-span-1 space-y-6">
              <div className="premium-card flex flex-col items-center text-center gap-4">
                <div className="size-24 rounded-full brand-gradient flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/20">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.name}</h3>
                  <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                    <ShieldIcon className="size-3 text-brand-blue" />
                    {user?.role?.toUpperCase()}
                  </p>
                </div>
                <div className="w-full pt-4 border-t space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <ClockIcon className="size-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Last Login</span>
                      <span className="font-medium">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "First session"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <UserIcon className="size-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">SLIIT ID</span>
                      <span className="font-medium">{user?.sliitId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-card space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                  <HistoryIcon className="size-4 text-brand-pink" />
                  Recent Activity
                </h4>
                <div className="space-y-4">
                  {logs.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No recent activity detected.</p>
                   ) : (
                    logs.map((log) => (
                      <div key={log._id} className="relative pl-4 border-l-2 border-muted hover:border-brand-blue transition-colors pb-2">
                        <p className="text-xs font-bold text-brand-blue uppercase">{log.action}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{log.details}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{new Date(log.timestamp).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
                {logs.length > 0 && (
                   <Button variant="link" className="p-0 h-auto text-xs font-bold text-brand-blue" asChild>
                     <a href="/dashboard/audit-logs">View Full History</a>
                   </Button>
                )}
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className="md:col-span-2">
              <div className="premium-card">
                <h3 className="text-xl font-bold mb-6">Edit Profile</h3>
                <form onSubmit={handleUpdate} className="space-y-6">
                  {message.text && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${
                      message.type === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}>
                      {message.type === "success" && <CheckCircle2Icon className="size-5" />}
                      <span className="font-medium text-sm">{message.text}</span>
                    </div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-10" 
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider">Phone Number</Label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10" 
                          placeholder="+94 7X XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">Email Address</Label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-3 size-4 text-muted-foreground/40" />
                      <Input 
                        id="email" 
                        value={user?.email} 
                         disabled 
                        className="pl-10 bg-muted/50 border-dashed" 
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">Email address is managed by organization and cannot be changed.</p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="brand-gradient border-0 px-8" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2Icon className="mr-2 size-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="mr-2 size-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Security Banner */}
              <div className="mt-8 p-6 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-start gap-4">
                <div className="size-10 rounded-xl bg-brand-blue/20 flex items-center justify-center shrink-0">
                  <ShieldIcon className="size-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-blue">Security Tip</h4>
                  <p className="text-sm text-brand-blue/80 mt-1">
                    Keep your contact information updated to ensure critical system alerts reach you. Your activity is logged as an administrator for security auditing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
