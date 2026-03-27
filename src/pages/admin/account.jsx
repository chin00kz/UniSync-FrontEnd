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
  ClockIcon,
  CameraIcon,
  BadgeCheckIcon,
  ExternalLinkIcon
} from "lucide-react"

export default function AccountPage({ isSubPage = false }) {
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
        <Loader2Icon className="size-8 animate-spin text-brand-blue" />
      </div>
    )
  }

  const content = (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 max-w-6xl mx-auto w-full h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Compact Profile Header Hero */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-brand-gradient shadow-xl shadow-brand-blue/10 p-1 group shrink-0">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[1.4rem] p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative group/avatar shrink-0">
              <div className="size-24 rounded-full bg-white p-1 shadow-lg transition-transform duration-500 group-hover/avatar:scale-105">
                <div className="size-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-black text-brand-blue overflow-hidden relative">
                   <span className="relative z-10">{user?.name?.charAt(0)}</span>
                   <div className="absolute inset-0 bg-brand-gradient opacity-10"></div>
                </div>
              </div>
              <button className="absolute bottom-0 right-0 size-8 rounded-full bg-white text-slate-900 border-2 border-slate-50 flex items-center justify-center shadow-md hover:bg-brand-blue hover:text-white transition-all scale-90 group-hover/avatar:scale-100">
                <CameraIcon className="size-3.5" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="space-y-0.5">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{user?.name}</h1>
                  <BadgeCheckIcon className="size-5 text-blue-300 fill-white/20" />
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-white/80 font-bold uppercase tracking-widest text-[9px]">
                  <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    {user?.role}
                  </span>
                  <span className="flex items-center gap-1">
                    <MailIcon className="size-3" />
                    {user?.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/60 font-black uppercase tracking-tighter">Member Since</span>
                  <span className="text-white text-xs font-bold">{new Date(user?.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="size-1 w-1 bg-white/20 rounded-full hidden md:block"></div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/60 font-black uppercase tracking-tighter">SLIIT ID</span>
                  <span className="text-white text-xs font-black tracking-widest">{user?.sliitId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12 text-left flex-1 min-h-0 overflow-hidden">
        
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-8 overflow-y-auto pr-2 custom-scrollbar">
          <div className="premium-card p-6 md:p-8 space-y-6 h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Personal Information</h3>
                <p className="text-slate-500 font-medium text-xs mt-0.5">Manage your display profile and contact info.</p>
              </div>
              <div className="size-10 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue">
                <UserIcon className="size-5" />
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4 ${
                  message.type === "success" 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                    : "bg-rose-50 text-rose-600 border border-rose-200"
                }`}>
                  <CheckCircle2Icon className="size-4" />
                  <span className="font-bold text-xs">{message.text}</span>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Name</Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-11 pl-10 rounded-xl border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm font-bold text-slate-700" 
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</Label>
                  <div className="relative group">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-11 pl-10 rounded-xl border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm font-bold text-slate-700" 
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Email</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                  <Input 
                    disabled 
                    value={user?.email} 
                    className="h-11 pl-10 rounded-xl bg-slate-50/50 border-slate-200 border-dashed text-slate-400 font-bold text-sm" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                    <ShieldIcon className="size-2.5 text-slate-400" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Verified</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                 <Button 
                    type="submit" 
                    className="h-11 px-8 rounded-xl bg-brand-gradient border-0 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all" 
                    disabled={isSaving}
                  >
                  {isSaving ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <>
                      <SaveIcon className="mr-2 size-4" />
                      Save Settings
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-slate-400 font-medium">Auto-syncs across all platforms.</p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Mini Stats/Audit */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-1">
          
          {/* Status Tracker */}
          <div className="premium-card p-6 bg-slate-50 border-slate-100 border-2 space-y-4 shrink-0">
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <ShieldIcon className="size-4 text-brand-blue" />
              Security Sync
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-white border border-slate-100">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                  Active <CheckCircle2Icon className="size-3" />
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-white border border-slate-100">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Last Login</span>
                <span className="text-[11px] font-black text-slate-700">{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Today"}</span>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
           {(user?.role === "admin" || user?.role === "superadmin") && (
            <div className="premium-card p-6 space-y-4 flex-1">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                <HistoryIcon className="size-3.5 text-brand-pink" />
                Audit Trail
              </h4>
              <div className="space-y-4">
                {logs.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic text-center py-4">No History</p>
                 ) : (
                  logs.slice(0, 4).map((log) => (
                    <div key={log._id} className="relative pl-4 border-l border-slate-100 hover:border-brand-blue transition-colors pb-1">
                      <div className="absolute left-[-2.5px] top-0 size-1 rounded-full bg-slate-200 group-hover:bg-brand-blue"></div>
                      <p className="text-[9px] font-black text-brand-blue uppercase tracking-widest leading-none mb-0.5">{log.action}</p>
                      <p className="text-[10px] text-slate-600 font-medium line-clamp-1">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full h-9 border-slate-200 text-slate-600 font-bold text-[10px] rounded-lg hover:bg-slate-50" asChild>
                <a href="/dashboard/audit-logs" className="flex items-center justify-center gap-1.5">
                  Full Audit
                  <ExternalLinkIcon className="size-2.5" />
                </a>
              </Button>
            </div>
          )}

           {/* Feedback/Help Card for Students */}
           {user?.role === "student" && (
             <div className="premium-card p-6 bg-brand-blue/5 border-brand-blue/10 border p-6 flex flex-col gap-3 justify-center text-center">
                <div className="size-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mx-auto">
                   <ShieldIcon className="size-5" />
                </div>
                <h4 className="text-xs font-black text-brand-blue uppercase tracking-widest">Support Portal</h4>
                <p className="text-[10px] text-brand-blue/70 font-bold leading-relaxed">
                   Need to change your institutional ID or email? Contact SLIIT support.
                </p>
                <Button className="h-8 bg-brand-blue text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                   Contact Support
                </Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );

  if (isSubPage) return content;

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
                  <BreadcrumbLink href="/dashboard" className="font-bold">UniSync</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-black text-brand-blue uppercase tracking-widest text-[11px]">User Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="bg-slate-50/50 min-h-screen">
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
