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
  Loader2,
  CheckCircle2,
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
        <Loader2 className="size-8 animate-spin text-brand-blue" />
      </div>
    )
  }

  const content = (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 max-w-6xl mx-auto w-full h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Resized Profile Header for Balance */}
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient shadow-xl shadow-brand-blue/10 p-1 shrink-0">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[1.9rem] p-6 md:p-8 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Optimized Avatar */}
            <div className="relative shrink-0">
              <div className="size-24 md:size-28 rounded-3xl bg-white p-1 shadow-xl overflow-hidden">
                <div className="size-full rounded-[1.3rem] bg-slate-50 flex items-center justify-center border border-slate-100 relative overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email}`} alt={user?.name} className="size-full object-cover relative z-10" />
                   <div className="absolute inset-0 bg-brand-gradient opacity-5"></div>
                </div>
              </div>
              <button className="absolute -bottom-1 -right-1 size-9 rounded-2xl bg-white text-slate-900 border-2 border-slate-50 flex items-center justify-center shadow-lg hover:bg-brand-blue hover:text-white transition-all scale-90 active:scale-95 z-20">
                <CameraIcon className="size-4" />
              </button>
            </div>

            {/* Identity & Details Row */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between w-full">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">{user?.name}</h1>
                    <div className="size-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25">
                      <BadgeCheckIcon className="size-3.5 text-white/60" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="px-3 py-1 rounded-xl bg-white text-brand-blue font-black uppercase tracking-widest text-[10px] shadow-lg shadow-black/5">
                      {user?.role}
                    </span>
                    <span className="text-white/90 font-bold text-sm truncate max-w-[200px] md:max-w-none">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-10 border-l border-white/10 pl-10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Origin Member</span>
                    <span className="text-base font-black text-white">{new Date(user?.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Global Identity</span>
                    <span className="text-base font-black text-white tracking-widest">{user?.sliitId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] size-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-12 text-left flex-1 min-h-0 overflow-hidden">
        
        {/* Left Column: Essential Settings */}
        <div className="lg:col-span-8 overflow-hidden flex flex-col">
          <div className="premium-card p-6 md:p-8 space-y-6 h-full flex flex-col border-slate-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-50 pb-5 shrink-0">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Identity Settings</h3>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-tighter">Your profile is synchronized across UniSync</p>
              </div>
              <div className="size-10 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue shadow-inner">
                <UserIcon className="size-5" />
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6 flex-1 overflow-y-auto pr-2 no-scrollbar pt-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-11 pl-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm font-bold text-slate-700 bg-slate-50/50" 
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                  <div className="relative group">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-11 pl-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm font-bold text-slate-700 bg-slate-50/50" 
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Institutional Email</Label>
                <div className="relative">
                  <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-200" />
                  <Input 
                    disabled 
                    value={user?.email} 
                    className="h-11 pl-11 rounded-xl bg-slate-100 border-slate-200 border-dashed text-slate-400 font-bold text-sm" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-100 shadow-sm">
                    <ShieldIcon className="size-3 text-emerald-500" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Identity Verified</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-50 shrink-0">
                 <Button 
                    type="submit" 
                    className="h-12 px-10 rounded-xl bg-brand-gradient border-0 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all" 
                    disabled={isSaving}
                  >
                  {isSaving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <SaveIcon className="mr-2 size-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                
                {message.text && (
                  <div className={`flex items-center gap-2 animate-in fade-in slide-in-from-right-4 ${
                    message.type === "success" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    <CheckCircle2 className="size-4" />
                    <span className="font-bold text-xs uppercase tracking-tighter">{message.text}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Status & History */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
          
          {/* Status Tracker */}
          <div className="premium-card p-6 bg-slate-50/50 border-slate-100 space-y-4 shrink-0 shadow-sm">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
              <ShieldIcon className="size-4 text-brand-blue" />
              Session Status
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Auth Level</span>
                <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                   Secured <CheckCircle2 className="size-3" />
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Last Activity</span>
                <span className="text-[11px] font-black text-slate-700">Today</span>
              </div>
            </div>
          </div>

          {/* Activity Feed (Admins Only) */}
           {(user?.role === "admin" || user?.role === "superadmin") && (
            <div className="premium-card p-6 space-y-4 flex-1 min-h-0 flex flex-col shadow-sm border-slate-100">
              <h4 className="font-black text-xs text-slate-800 flex items-center gap-2 uppercase tracking-widest shrink-0">
                <HistoryIcon className="size-4 text-brand-pink" />
                Global Audit
              </h4>
              <div className="space-y-4 flex-1 overflow-y-auto pr-1 no-scrollbar">
                {logs.length === 0 ? (
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic text-center py-6">No recent audit logs</p>
                 ) : (
                  logs.slice(0, 5).map((log) => (
                    <div key={log._id} className="relative pl-4 border-l-2 border-slate-50 transition-colors pb-1">
                      <div className="absolute left-[-5px] top-0 size-2 rounded-full bg-slate-100"></div>
                      <p className="text-[9px] font-black text-brand-blue uppercase tracking-widest leading-none mb-1">{log.action}</p>
                      <p className="text-[11px] text-slate-600 font-medium line-clamp-1">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full h-10 border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50 shrink-0" asChild>
                <a href="/dashboard/audit-logs">Detailed Log</a>
              </Button>
            </div>
          )}

           {/* Feedback/Help Card for Students */}
           {user?.role === "student" && (
             <div className="premium-card p-6 bg-brand-blue/5 border-brand-blue/10 border flex flex-col gap-4 justify-center text-center shadow-sm flex-1">
                <div className="size-11 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mx-auto shadow-inner">
                   <ShieldIcon className="size-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-brand-blue uppercase tracking-widest">Institutional Support</h4>
                  <p className="text-[10px] text-brand-blue/70 font-bold leading-relaxed px-4">
                     Any issues with your email? Contact the SLIIT Network Center.
                  </p>
                </div>
                <Button className="h-10 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md w-full hover:scale-[1.02] transition-transform">
                   Open Support Ticket
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
        <div className="bg-slate-50/50 h-[calc(100vh-4rem)] overflow-hidden">
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
