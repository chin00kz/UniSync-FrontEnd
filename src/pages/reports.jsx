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

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/reports")
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
                  <BreadcrumbPage>Moderation Queue</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-primary/5">
            <ActivityIcon className="size-3 text-brand-blue" />
            Live Monitoring
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight">Moderation Queue</h1>
            <p className="text-muted-foreground font-medium">Review and resolve flagged content from the community.</p>
          </div>
          <div className="premium-card overflow-hidden !p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Target Content</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                        <span className="ml-2">Loading reports...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <CheckCircleIcon className="size-8 opacity-20" />
                        <p>Inbox zero! No pending reports to review.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{report.reporter?.name || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground">{report.reporter?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">{report.contentType}</Badge>
                          <Button variant="ghost" size="icon" className="size-6">
                            <ExternalLinkIcon className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{report.reason}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {report.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                              onClick={() => handleUpdateStatus(report._id, 'resolved')}
                            >
                              Resolve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-muted-foreground"
                              onClick={() => handleUpdateStatus(report._id, 'dismissed')}
                            >
                              Dismiss
                            </Button>
                          </div>
                        )}
                        {report.status !== 'pending' && (
                          <span className="text-xs text-muted-foreground italic">
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
      </SidebarInset>
    </SidebarProvider>
  )
}
