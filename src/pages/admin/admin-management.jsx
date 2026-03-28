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
import { NotificationsSheet } from "@/components/notifications-sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserBadge } from "@/components/user-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon, Loader2, Trash2Icon } from "lucide-react"

export default function AdminManagementPage({ isSubPage = false }) {
  const userData = JSON.parse(localStorage.getItem("user") || "{}")
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState(null)
  const [error, setError] = useState("")

  // New Admin State
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    sliitId: "",
    phone: "",
    role: "admin"
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    setIsLoading(true)
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.id;
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          "x-admin-id": token
        }
      })
      const data = await response.json()
      if (data.success) {
        // Filter administrative roles for the list
        const adminList = data.data.filter(user => ['admin', 'moderator', 'superadmin'].includes(user.role))
        setAdmins(adminList)
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setIsAdding(true)
    setError("")
    
    // Frontend Validation
    if (!newAdmin.email.endsWith("@sliit.lk")) {
      setError("Email must be a valid SLIIT email (@sliit.lk)")
      setIsAdding(false)
      return
    }

    if (newAdmin.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsAdding(false)
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": userData.id || userData._id
        },
        body: JSON.stringify(newAdmin),
      })
      const data = await response.json()
      if (data.success) {
        setOpen(false)
        setNewAdmin({ name: "", email: "", password: "", sliitId: "", phone: "", role: "admin" })
        setError("")
        fetchAdmins()
      } else {
        setError(data.error || "Failed to add admin")
      }
    } catch (error) {
      console.error("Failed to add admin:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${adminToDelete}`, {
        method: "DELETE",
        headers: {
          "x-admin-id": userData.id || userData._id
        }
      })
      const data = await response.json()
      if (data.success) {
        setDeleteDialogOpen(false)
        setAdminToDelete(null)
        fetchAdmins()
      }
    } catch (error) {
      console.error("Failed to delete admin:", error)
    }
  }

  const content = (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight uppercase">Admin Management</h1>
        <p className="text-muted-foreground font-medium text-left text-sm">Manage and monitor system administrators.</p>
      </div>
      <div className="premium-card overflow-hidden !p-0 border border-border/50 shadow-sm rounded-xl text-left">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground w-[300px]">Administrator</TableHead>
              <TableHead className="font-semibold text-muted-foreground">SLIIT ID</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Phone</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Joined Date</TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 font-bold">Loading admins...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center font-bold">
                  No admins found.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin._id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <UserBadge 
                      name={admin.name} 
                      email={admin.email} 
                      role={admin.role}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm font-bold">{admin.sliitId}</TableCell>
                  <TableCell className="font-bold">{admin.phone || "N/A"}</TableCell>
                  <TableCell className="font-bold text-slate-500">{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {(userData?.role === 'superadmin' && admin._id !== (userData.id || userData._id)) && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => {
                          setAdminToDelete(admin._id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this administrator? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="font-bold">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdmin} className="font-bold">
              Remove Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (isSubPage) return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
        <div />
        <div className="flex items-center gap-4">
          <NotificationsSheet />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="brand-gradient border-none hover:opacity-90 transition-opacity font-extrabold px-6 h-9 shadow-lg shadow-brand-blue/20 tracking-tight">
                <PlusIcon className="mr-2 size-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddAdmin}>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new system user with specific administrative permissions.
                  </DialogDescription>
                </DialogHeader>
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 border border-destructive/20 font-bold">
                    {error}
                  </div>
                )}
                <div className="grid gap-4 py-4 text-left">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      required 
                      className="font-bold h-11"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@sliit.lk" 
                      required 
                      className="font-bold h-11"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      className="font-bold h-11"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sliitId">SLIIT ID</Label>
                    <Input 
                      id="sliitId" 
                      placeholder="IT21XXXXXX" 
                      required 
                      className="font-bold h-11"
                      value={newAdmin.sliitId}
                      onChange={(e) => setNewAdmin({...newAdmin, sliitId: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input 
                      id="phone" 
                      placeholder="071XXXXXXX" 
                      className="font-bold h-11"
                      value={newAdmin.phone}
                      onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={newAdmin.role} 
                      onValueChange={(value) => setNewAdmin({...newAdmin, role: value})}
                    >
                      <SelectTrigger id="role" className="font-bold h-11">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        {userData?.role === 'superadmin' && (
                          <>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="superadmin">SuperAdmin</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isAdding} className="font-black uppercase tracking-widest text-[11px] h-12 w-full">
                    {isAdding && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Save Admin
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {content}
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="font-bold">
                    UniSync
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-black text-brand-blue uppercase tracking-widest text-[11px]">Admin Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationsSheet />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="brand-gradient border-none hover:opacity-90 transition-opacity font-extrabold px-6 h-9 shadow-lg shadow-brand-blue/20">
                  <PlusIcon className="mr-2 size-4" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddAdmin}>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black">Add New User</DialogTitle>
                    <DialogDescription className="font-medium text-slate-500">
                      Create a new user account for system administration.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-6 text-left">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                      <Input value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} className="h-11 font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                      <Input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} className="h-11 font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initial Password</Label>
                      <Input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} className="h-11 font-bold" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isAdding} className="w-full h-12 brand-gradient border-0 text-white font-black uppercase tracking-widest text-[11px]">
                      Create System User
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-slate-50/50">
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
