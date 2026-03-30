import { useState, useEffect } from "react"
import { LayoutDashboard, PlusCircle, UserIcon, BookOpen, Users as UsersIcon, ClipboardList } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import StudentDashboard from "@/pages/student/dashboard"
import StudentPost from "@/pages/student/post"
import AccountPage from "@/pages/admin/account"
import OrganizedContentPage from "@/pages/student/organized-content"
import PeerTutoringPage from "@/pages/student/peer-tutoring"
import QuestionHistoryPage from "@/pages/student/question-history"

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
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      title: "Study Materials",
      url: "/student/materials",
      icon: <BookOpen className="size-4" />,
    },
    {
      title: "Find Tutors",
      url: "/student/tutors",
      icon: <UsersIcon className="size-4" />,
    },
    {
      title: "Ask a Question",
      url: "/student/post",
      icon: <PlusCircle className="size-4" />,
    },
    {
      title: "My History",
      url: "/student/history",
      icon: <ClipboardList className="size-4" />,
    },
    {
      title: "Account Settings",
      url: "/student/account",
      icon: <UserIcon className="size-4" />,
    },
  ]

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard": return "Dashboard Overview";
      case "materials": return "Study Materials";
      case "tutors": return "Peer Tutoring";
      case "post": return "Ask a Question";
      case "history": return "Question History";
      case "account": return "Account Settings";
      default: return "Student Portal";
    }
  }

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
            <span className="font-extrabold text-brand-blue uppercase tracking-widest text-[11px]">
              {getPageTitle()}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-10 bg-background">
          <div className="mx-auto max-w-7xl">
            {currentPage === "dashboard" && <StudentDashboard user={user} />}
            {currentPage === "materials" && <OrganizedContentPage />}
            {currentPage === "tutors" && <PeerTutoringPage />}
            {currentPage === "post" && <StudentPost onPostSuccess={() => { setCurrentPage("dashboard") }} />}
            {currentPage === "history" && <QuestionHistoryPage />}
            {currentPage === "account" && <AccountPage isSubPage={true} />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
