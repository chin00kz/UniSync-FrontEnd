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
import { UserBadge } from "@/components/user-badge"
import { NotificationsSheet } from "@/components/notifications-sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2Icon, 
  BanIcon, 
  UnlockIcon,
  SearchIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function BannedUsersPage({ isSubPage = false }) {
  const [bannedUsers, setBannedUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isActionLoading, setIsActionLoading] = useState(false)

  useEffect(() => {
    fetchBannedUsers()
  }, [])

  const fetchBannedUsers = async () => {
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
        const banned = data.data.filter(user => user.isBanned)
        setBannedUsers(banned)
      }
    } catch (error) {
      console.error("Failed to fetch banned users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnbanUser = async (user) => {
    setIsActionLoading(true)
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.id;
      const response = await fetch(`http://localhost:5000/api/users/${user._id}/unban`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-id": token
        },
      })
      const data = await response.json()
      if (data.success) {
        fetchBannedUsers()
      }
    } catch (error) {
      console.error("Failed to unban user:", error)
    } finally {
      setIsActionLoading(false)
    }
  }

  const filteredUsers = bannedUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.sliitId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const content = (
    <div className="flex flex-1 flex-col gap-4 p-6 text-left">
      <div className="flex items-center gap-2 text-destructive">
        <BanIcon className="size-5" />
        <h2 className="text-xl font-black uppercase tracking-tight">Restricted Accounts</h2>
      </div>

      <div className="premium-card overflow-hidden !p-0 border border-border/50 shadow-sm rounded-xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold py-4">User</TableHead>
              <TableHead className="font-bold py-4">SLIIT ID</TableHead>
              <TableHead className="font-bold py-4">Reason for Ban</TableHead>
              <TableHead className="font-bold py-4">Role</TableHead>
              <TableHead className="text-right font-bold py-4 px-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 font-bold">Loading banned users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground font-bold italic">
                  No banned users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <UserBadge 
                      name={user.name} 
                      email={user.email} 
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm font-bold">{user.sliitId}</TableCell>
                  <TableCell className="max-w-[300px] truncate italic text-muted-foreground font-medium">
                    {user.banReason || "No reason provided"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize font-black text-[10px] tracking-widest px-2 py-0.5 border-primary/20 bg-primary/5 text-primary">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 font-black uppercase tracking-widest text-[9px] text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm"
                      onClick={() => handleUnbanUser(user)}
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? <Loader2Icon className="size-4 animate-spin" /> : <UnlockIcon className="mr-2 size-3.5" />}
                      Lift Ban
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (isSubPage) return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
        <div />
        <div className="flex items-center gap-4">
          <NotificationsSheet />
          <div className="relative w-full max-w-sm group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-destructive transition-colors" />
            <Input
              placeholder="Search banned users..."
              className="pl-10 h-10 border-destructive/10 bg-muted/30 focus-visible:ring-destructive/20 focus-visible:border-destructive/30 transition-all text-sm font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="font-bold">UniSync</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-black text-rose-600 uppercase tracking-widest text-[11px]">Banned Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="relative w-full max-w-sm group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-destructive transition-colors" />
            <Input
              placeholder="Search restricted accounts..."
              className="pl-10 h-10 border-destructive/10 bg-muted/30 focus-visible:ring-destructive/20 focus-visible:border-destructive/30 transition-all text-sm font-bold shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-slate-50/50">
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
