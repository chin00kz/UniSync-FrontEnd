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
import SessionLobby from "@/pages/student/SessionLobby"
import LiveLobby from "@/pages/student/LiveLobby"
import NotesPage from "@/pages/student/NotesPage"

export default function StudentWorkspace({ 
  initialPage = "dashboard", 
  user,
  notes,
  subjects,
  onAddNote,
  onDeleteNote,
  onRateNote,
  onReportNote
}) {
  const [currentPage, setCurrentPage] = useState(initialPage)

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
      url: "/student/notes",
      icon: <BookOpen className="size-4" />,
    },
    {
      title: "Find Tutors",
      url: "/student/tutors",
      icon: <UsersIcon className="size-4" />,
    },
    {
      title: "Session Lobby",
      url: "/student/session-lobby",
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
      case "notes": return "Study Materials";
      case "tutors": return "Peer Tutoring";
      case "session-lobby": return "Session Lobby";
      case "live-lobby": return "Live Lobby";
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
            {currentPage === "notes" && (
              <NotesPage 
                user={user} 
                notes={notes} 
                subjects={subjects} 
                onAddNote={onAddNote}
                onDeleteNote={onDeleteNote}
                onRateNote={onRateNote}
                onReportNote={onReportNote}
              />
            )}
            {currentPage === "tutors" && <PeerTutoringPage user={user} />}
            {currentPage === "session-lobby" && <SessionLobby user={user} isSubPage={true} />}
            {currentPage === "live-lobby" && <LiveLobby user={user} />}
            {currentPage === "post" && <StudentPost onPostSuccess={() => { setCurrentPage("dashboard") }} user={user} />}
            {currentPage === "history" && <QuestionHistoryPage user={user} />}
            {currentPage === "account" && <AccountPage isSubPage={true} user={user} />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
