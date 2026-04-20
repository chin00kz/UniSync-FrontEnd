import { useState, useEffect } from "react"
import { BookOpenIcon, VideoIcon, UserIcon, ActivityIcon, ArrowRightIcon, Loader2 } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationsSheet } from "@/components/notifications-sheet"

export default function ModeratorDashboard({ isSubPage = false, user }) {
  const [stats, setStats] = useState({
    totalNotes: 0,
    activeSessions: 0,
    recentActivity: []
  })
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for the activity chart (Content focused)
  const activityData = [
    { date: "Mon", updates: 5 },
    { date: "Tue", updates: 8 },
    { date: "Wed", updates: 12 },
    { date: "Thu", updates: 7 },
    { date: "Fri", updates: 15 },
    { date: "Sat", updates: 10 },
    { date: "Sun", updates: 9 },
  ]

  useEffect(() => {
    fetchModeratorStats()
  }, [])

  const fetchModeratorStats = async () => {
    try {
      // In a real app, we might have a specific moderator stats endpoint
      // For now, we'll fetch general stats or mock specific ones
      const adminId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { "x-admin-id": adminId }
      })
      const result = await response.json()
      
      if (result.success) {
        setStats({
          totalNotes: result.data.counts.notes || 0,
          activeSessions: result.data.counts.sessions || 0,
          recentActivity: result.data.recentActivity || []
        })
      }
    } catch (error) {
      console.error("Failed to fetch moderator stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, description }) => (
    <div className="premium-card group relative overflow-hidden">
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full opacity-5 brand-gradient" />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="text-3xl font-bold tracking-tight">
            {isLoading ? <Loader2 className="size-6 animate-spin text-muted-foreground/20" /> : value}
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
          <Icon className="size-6" />
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
        <ActivityIcon className="size-3 text-brand-blue" />
        {description}
      </p>
    </div>
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card shrink-0">
        <div />
        <div className="flex items-center gap-4">
          <NotificationsSheet />
        </div>
      </div>
      <main className="flex-1 overflow-auto p-6 lg:p-10 bg-background">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-pink">
              Moderator Dashboard
            </h1>
            <p className="text-lg text-muted-foreground font-medium italic">
              Focused content oversight for {user?.name || "Moderator"}.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Managed Notes"
              value={stats.totalNotes}
              icon={BookOpenIcon}
              description="Total study materials in system"
            />
            <StatCard
              title="Live Sessions"
              value={stats.activeSessions}
              icon={VideoIcon}
              description="Ongoing peer-to-peer sessions"
            />
            <StatCard
              title="My Account"
              value="Active"
              icon={UserIcon}
              description="Status: Moderator Level"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-none shadow-lg">
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Note uploads and session starts over 7 days.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] text-muted-foreground rounded-lg m-6 mt-0 p-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                    <Area type="monotone" dataKey="updates" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorUpdates)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="lg:col-span-3 premium-card space-y-6">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Direct Access</h3>
                <p className="text-sm text-muted-foreground">Quick links to your assigned areas.</p>
              </div>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-between group h-12 border-primary/10 hover:border-primary/30" asChild>
                  <a href="/dashboard/notes" className="flex items-center justify-between w-full">
                    Manage Notes Repository
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between group h-12 border-primary/10 hover:border-primary/30" asChild>
                  <a href="/dashboard/sessions" className="flex items-center justify-between w-full">
                    Monitor Live Sessions
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between group h-12 border-primary/10 hover:border-primary/30" asChild>
                  <a href="/dashboard/account" className="flex items-center justify-between w-full">
                    Account Preferences
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <div className="mt-6 p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
                  <h4 className="text-sm font-bold text-brand-blue uppercase tracking-tight mb-2">Notice</h4>
                  <p className="text-xs text-muted-foreground italic">
                    You have restricted moderator access. User management and system settings are reserved for administrators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
