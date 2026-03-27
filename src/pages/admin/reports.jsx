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
  FlagIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExternalLinkIcon,
  ActivityIcon
} from "lucide-react"

export default function ReportsPage({ isSubPage = false }) {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.id;
      const response = await fetch("http://localhost:5000/api/reports", {
        headers: {
          "x-admin-id": token
        }
      })
      const data = await response.json()
      if (data.success) {
        setReports(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    setIsActionLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-id": JSON.parse(localStorage.getItem("user"))?.id
        },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (data.success) {
        fetchReports()
      }
    } catch (error) {
      console.error("Failed to update report status:", error)
    } finally {
      setIsActionLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="border-orange-500 text-orange-500">Pending</Badge>
      case 'resolved': return <Badge variant="outline" className="border-emerald-500 text-emerald-500">Resolved</Badge>
      case 'dismissed': return <Badge variant="secondary">Dismissed</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const content = (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight uppercase">Moderation Queue</h1>
        <p className="text-muted-foreground font-medium text-left">Review and resolve flagged content from the community.</p>
      </div>
      <div className="premium-card overflow-hidden !p-0 text-left border border-border/50 shadow-sm rounded-xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] py-4">Reporter</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] py-4">Target Content</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] py-4">Reason</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] py-4">Status</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] py-4">Date</TableHead>
              <TableHead className="text-right font-bold text-slate-500 uppercase tracking-widest text-[10px] py-4 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 font-bold">Loading reports...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <CheckCircleIcon className="size-10 text-emerald-500/20" />
                    <p className="font-bold text-lg">Inbox zero!</p>
                    <p className="text-sm">No pending reports to review.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report._id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <UserBadge 
                      name={report.reporter?.name || "Unknown"} 
                      email={report.reporter?.email} 
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize font-black text-[10px] tracking-widest px-2 py-0.5 border-primary/20 bg-primary/5 text-primary">
                        {report.contentType}
                      </Badge>
                      <Button variant="ghost" size="icon" className="size-7 hover:bg-primary/10 hover:text-primary transition-colors">
                        <ExternalLinkIcon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate font-medium text-slate-600 italic">"{report.reason}"</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    {report.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 font-black uppercase tracking-widest text-[9px] text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                          onClick={() => handleUpdateStatus(report._id, 'resolved')}
                        >
                          <CheckCircleIcon className="mr-1 size-3" />
                          Resolve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 font-black uppercase tracking-widest text-[9px] text-muted-foreground hover:bg-slate-100"
                          onClick={() => handleUpdateStatus(report._id, 'dismissed')}
                        >
                          <XCircleIcon className="mr-1 size-3" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                    {report.status !== 'pending' && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 flex items-center justify-end gap-1">
                        <ActivityIcon className="size-3" />
                        Handled
                      </span>
                    )}
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
                  <BreadcrumbPage className="font-black text-brand-blue uppercase tracking-widest text-[11px]">Moderation Queue</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-primary/5 shadow-inner">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Monitoring
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-slate-50/50">
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
