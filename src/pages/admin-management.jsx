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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { PlusIcon, Loader2Icon, Trash2Icon } from "lucide-react"

export default function AdminManagementPage() {
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
        // Filter only admins for now on the frontend
        const adminList = data.data.filter(user => user.role === 'admin')
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    UniSync
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="brand-gradient border-none hover:opacity-90 transition-opacity font-bold px-6">
                  <PlusIcon className="mr-2 size-4" />
                  Add New Admin
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddAdmin}>
                <DialogHeader>
                  <DialogTitle>Add New Admin</DialogTitle>
                  <DialogDescription>
                    Create a new administrator account for the system.
                  </DialogDescription>
                </DialogHeader>
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 border border-destructive/20">
                    {error}
                  </div>
                )}
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      required 
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
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
                      value={newAdmin.sliitId}
                      onChange={(e) => setNewAdmin({...newAdmin, sliitId: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input 
                      id="phone" 
                      placeholder="071XXXXXXX" 
                      value={newAdmin.phone}
                      onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isAdding}>
                    {isAdding && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                    Save Admin
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

        <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Management</h1>
            <p className="text-muted-foreground font-medium">Manage and monitor system administrators.</p>
          </div>
          <div className="premium-card overflow-hidden !p-0 border border-border/50 shadow-sm rounded-xl">
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
                        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                        <span className="ml-2">Loading admins...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No admins found.
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border/50">
                            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${admin.email}`} alt={admin.name} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                              {admin.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{admin.name}</span>
                            <span className="text-xs text-muted-foreground">{admin.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{admin.sliitId}</TableCell>
                      <TableCell>{admin.phone || "N/A"}</TableCell>
                      <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setAdminToDelete(admin._id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAdmin}>
                Remove Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
