import { useState, useEffect, useMemo } from "react"
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2Icon, 
  SearchIcon, 
  UserCogIcon, 
  BanIcon, 
  UnlockIcon,
  MoreVerticalIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UserManagementPage() {
  const currentUser = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), [])
  const isAdmin = ['admin', 'superadmin', 'moderator'].includes(currentUser?.role)

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Selection/Action State
  const [selectedUser, setSelectedUser] = useState(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  
  // New values for updates
  const [newRole, setNewRole] = useState("")
  const [banReason, setBanReason] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/users")
      const data = await response.json()
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return
    setIsActionLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}/role`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-id": JSON.parse(localStorage.getItem("user"))?.id
        },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await response.json()
      if (data.success) {
        setIsRoleDialogOpen(false)
        fetchUsers()
      }
    } catch (error) {
      console.error("Failed to update role:", error)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleQuickRoleToggle = async (user) => {
    const newTargetRole = user.role === 'admin' ? 'user' : 'admin'
    setIsActionLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}/role`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-id": currentUser?.id
        },
        body: JSON.stringify({ role: newTargetRole }),
      })
      const data = await response.json()
      if (data.success) fetchUsers()
    } catch (error) {
      console.error("Failed to toggle role:", error)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleBanUser = async () => {
    if (!selectedUser) return
    setIsActionLoading(true)
    try {
      const endpoint = selectedUser.isBanned ? "unban" : "ban"
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}/${endpoint}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-id": JSON.parse(localStorage.getItem("user"))?.id
        },
        body: JSON.stringify({ reason: banReason }),
      })
      const data = await response.json()
      if (data.success) {
        setIsBanDialogOpen(false)
        setBanReason("")
        fetchUsers()
      }
    } catch (error) {
      console.error("Failed to toggle ban status:", error)
    } finally {
      setIsActionLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.sliitId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin': return <Badge className="bg-red-500 hover:bg-red-600">Super Admin</Badge>
      case 'admin': return <Badge className="bg-purple-500 hover:bg-purple-600">Admin</Badge>
      case 'moderator': return <Badge className="bg-blue-500 hover:bg-blue-600">Moderator</Badge>
      default: return <Badge variant="outline">User</Badge>
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6">
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
                  <BreadcrumbPage>User Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="relative w-full max-w-sm group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search users by name, email, or ID..."
              className="pl-10 h-10 border-primary/10 bg-muted/30 focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
            <p className="text-muted-foreground font-medium">View and manage all registered accounts on the platform.</p>
          </div>
          <div className="premium-card overflow-hidden !p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>SLIIT ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                        <span className="ml-2">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{user.sliitId}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.isBanned ? (
                          <Badge variant="destructive" className="flex w-fit items-center gap-1">
                            <BanIcon className="size-3" />
                            Banned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-500 text-emerald-500">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {isAdmin ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none">
                              <MoreVerticalIcon className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <p className="px-2 py-1.5 text-xs text-muted-foreground font-medium truncate">{user.name}</p>
                              <DropdownMenuSeparator />
                              {user.role === 'user' && (
                                <DropdownMenuItem onClick={() => handleQuickRoleToggle(user)} className="text-brand-blue font-medium">
                                  <UserCogIcon className="mr-2 size-4" />
                                  Promote to Admin
                                </DropdownMenuItem>
                              )}
                              {user.role === 'admin' && (
                                <DropdownMenuItem onClick={() => handleQuickRoleToggle(user)} className="text-amber-600 font-medium">
                                  <UserCogIcon className="mr-2 size-4" />
                                  Demote to User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user)
                                setNewRole(user.role)
                                setIsRoleDialogOpen(true)
                              }}>
                                <UserCogIcon className="mr-2 size-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className={user.isBanned ? "text-emerald-600" : "text-destructive"}
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsBanDialogOpen(true)
                                }}
                              >
                                {user.isBanned
                                  ? <span className="flex items-center gap-2"><UnlockIcon className="size-4" /> Lift Ban</span>
                                  : <span className="flex items-center gap-2"><BanIcon className="size-4" /> Ban User</span>
                                }
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">View only</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Change Role Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update User Role</DialogTitle>
              <DialogDescription>
                Assign a new role to {selectedUser?.name}. This will change their system permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="role">Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger id="role" className="mt-1.5">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User (Student/Staff)</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="superadmin">Super Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateRole} disabled={isActionLoading}>
                {isActionLoading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                Confirm Role Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Ban/Unban Dialog */}
        <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser?.isBanned ? "Lift User Ban" : "Ban User"}</DialogTitle>
              <DialogDescription>
                {selectedUser?.isBanned 
                  ? `Are you sure you want to restore access for ${selectedUser?.name}?`
                  : `Are you sure you want to restrict access for ${selectedUser?.name}? They will be unable to log in.`}
              </DialogDescription>
            </DialogHeader>
            {!selectedUser?.isBanned && (
              <div className="py-4">
                <Label htmlFor="reason">Reason for Ban</Label>
                <Input 
                  id="reason" 
                  placeholder="e.g., Harassment, Violation of terms" 
                  className="mt-1.5"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>Cancel</Button>
              <Button 
                variant={selectedUser?.isBanned ? "default" : "destructive"} 
                onClick={handleBanUser} 
                disabled={isActionLoading}
              >
                {isActionLoading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                {selectedUser?.isBanned ? "Lift Ban" : "Confirm Ban"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
