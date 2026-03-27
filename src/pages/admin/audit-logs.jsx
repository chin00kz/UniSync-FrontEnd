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
import { Badge } from "@/components/ui/badge"
import { 
  Loader2Icon, 
  HistoryIcon, 
  InfoIcon
} from "lucide-react"

export default function AuditLogsPage({ isSubPage = false }) {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.id;
      const response = await fetch("http://localhost:5000/api/audit-logs", {
        headers: {
          "x-admin-id": token
        }
      })
      const data = await response.json()
      if (data.success) {
        setLogs(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const content = (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight uppercase">System Audit Logs</h1>
        <p className="text-muted-foreground font-medium text-left">Detailed history of all administrative actions performed on the platform.</p>
      </div>
      <div className="premium-card overflow-hidden !p-0 text-left border border-border/50 shadow-sm rounded-xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold py-4">Admin</TableHead>
              <TableHead className="font-bold py-4">Action</TableHead>
              <TableHead className="font-bold py-4">Target</TableHead>
              <TableHead className="font-bold py-4">Details</TableHead>
              <TableHead className="font-bold py-4">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 font-bold">Loading logs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic">
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>
                    <UserBadge 
                      name={log.adminId?.name || "System"} 
                      email={log.adminId?.email || "system@unisync.lk"} 
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-black text-[10px] uppercase tracking-wider px-2 py-0.5 border-primary/20 bg-primary/5 text-primary shadow-sm">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono font-bold text-slate-500">{log.targetId}</TableCell>
                  <TableCell className="max-w-[300px] text-xs font-medium text-slate-600 truncate">
                    {log.details ? JSON.stringify(log.details) : "N/A"}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground italic">
                    {new Date(log.timestamp).toLocaleString()}
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
                  <BreadcrumbPage className="font-black text-brand-blue uppercase tracking-widest text-[11px]">System Audit Logs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Logging Active</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-slate-50/50">
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
