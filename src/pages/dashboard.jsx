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

import { useState, useEffect } from "react"
import { UsersIcon, ShieldAlertIcon, FileTextIcon, ActivityIcon, ArrowRightIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    bannedUsers: 0,
    pendingReports: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, description, color }) => (
    <div className="premium-card group relative overflow-hidden">
      <div className={`absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full opacity-5 brand-gradient`} />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="text-3xl font-bold tracking-tight">
            {isLoading ? (
              <Loader2Icon className="size-6 animate-spin text-muted-foreground/20" />
            ) : (
              value
            )}
          </div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="size-6" />
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
        <ActivityIcon className="size-3 text-brand-pink" />
        {description}
      </p>
    </div>
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">UniSync</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent brand-gradient">
                Admin Dashboard
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Welcome back! Here's the pulse of UniSync today.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon={UsersIcon} 
                description="Registered students & staff" 
                color="bg-blue-500"
              />
              <StatCard 
                title="Active Admins" 
                value={stats.totalAdmins} 
                icon={ShieldAlertIcon} 
                description="System administrators" 
                color="bg-purple-500"
              />
              <StatCard 
                title="Pending Reports" 
                value={stats.pendingReports} 
                icon={FileTextIcon} 
                description="Flagged content awaiting review" 
                color="bg-orange-500"
              />
              <StatCard 
                title="Banned Users" 
                value={stats.bannedUsers} 
                icon={ActivityIcon} 
                description="Accounts currently restricted" 
                color="bg-red-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4 border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Moderation Activity</CardTitle>
                  <CardDescription>Activity overview from the last 24 hours.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg m-6 mt-0">
                  <div className="flex flex-col items-center gap-2">
                    <ActivityIcon className="size-8 opacity-20" />
                    <p>Activity visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="lg:col-span-3 premium-card space-y-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Quick Actions</h3>
                  <p className="text-sm text-muted-foreground">Common management tasks.</p>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between group h-12 border-primary/10 hover:border-primary/30" asChild>
                    <a href="/dashboard/reports">
                      Review Pending Reports
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-between group h-12 border-primary/10 hover:border-primary/30" asChild>
                    <a href="/dashboard/users">
                      Manage User Roles
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-between group h-12 border-primary/10 hover:border-primary/30" asChild>
                    <a href="/dashboard/bans">
                      View Banned Accounts
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <div className="pt-4">
                    <Button className="w-full h-11 brand-gradient border-none hover:opacity-90 transition-opacity">
                      Generate System Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
