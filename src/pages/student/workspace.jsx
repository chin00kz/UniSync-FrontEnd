import { useState, useEffect } from "react"
import { LayoutDashboard, PlusCircle, UserIcon } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import StudentDashboard from "@/pages/student/dashboard"
import StudentPost from "@/pages/student/post"
import AccountPage from "@/pages/admin/account"

export default function StudentWorkspace({ initialPage = "dashboard" }) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    setCurrentPage(initialPage)
  }, [initialPage])

  const studentNav = [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Submit Question",
      url: "/student/post",
      icon: <PlusCircle />,
    },
    {
      title: "My Profile",
      url: "/student/account",
      icon: <UserIcon />,
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar navMain={studentNav} portalName="Student Portal" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">UniSync</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="font-semibold text-brand-blue uppercase tracking-wider">
              {currentPage === "dashboard" ? "Dashboard" : currentPage === "post" ? "Submit Question" : "Account Settings"}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-10 bg-[#f4f7fe]">
          <div className="mx-auto max-w-7xl">
            {currentPage === "dashboard" && <StudentDashboard user={user} />}
            {currentPage === "post" && <StudentPost onPostSuccess={() => { setCurrentPage("dashboard") }} />}
            {currentPage === "account" && <AccountPage isSubPage={true} />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
