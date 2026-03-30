import { useState, useEffect } from "react"
import axios from "axios"
import { LayoutDashboard, ClipboardList, Calendar, User as UserIcon } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import TutorDashboard from "@/pages/tutor/dashboard"
import SessionReview from "@/pages/tutor/reviews"
import TutorBookingsPage from "@/pages/tutor/bookings"
import AccountPage from "@/pages/admin/account"

export default function TutorWorkspace({ initialPage = "dashboard", user }) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [questions, setQuestions] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  
  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sessions")
      setQuestions(res.data)
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  useEffect(() => {
    void fetchSessions()
  }, [])

  useEffect(() => {
    setCurrentPage(initialPage)
  }, [initialPage])

  const handleSelectQuestion = (id) => {
    setSelectedId(id)
    setCurrentPage("review")
  }

  const handleUpdate = async (id, status, reply, replyImage) => {
    try {
      await axios.patch(`http://localhost:5000/api/sessions/${id}`, {
        status,
        replyText: reply,
        replyImage,
      })
      void fetchSessions()
    } catch {
      alert("Update failed")
    }
  }

  const tutorNav = [
    {
      title: "Dashboard",
      url: "/tutor/dashboard",
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      title: "Manage Bookings",
      url: "/tutor/bookings",
      icon: <Calendar className="size-4" />,
    },
    {
      title: "Session Reviews",
      url: "/tutor/sessionreview",
      icon: <ClipboardList className="size-4" />,
    },
    {
      title: "Account Settings",
      url: "/tutor/account",
      icon: <UserIcon className="size-4" />,
    },
  ]

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard": return "Dashboard Overview";
      case "bookings": return "Manage Bookings";
      case "review": return "Session Reviews";
      case "account": return "Account Settings";
      default: return "Tutor Portal";
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar navMain={tutorNav} portalName="Tutor Workspace" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-brand-blue uppercase tracking-widest text-[11px]">
              {getPageTitle()}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-10 bg-background">
          <div className="mx-auto max-w-7xl">
            {currentPage === "dashboard" && <TutorDashboard questions={questions} onAction={handleSelectQuestion} user={user} />}
            {currentPage === "bookings" && <TutorBookingsPage user={user} />}
            {currentPage === "review" && <SessionReview questions={questions} onUpdate={handleUpdate} initialSelectedId={selectedId} user={user} />}
            {currentPage === "account" && <AccountPage isSubPage={true} user={user} />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
