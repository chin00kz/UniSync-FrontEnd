import { useState, useEffect } from "react"
import {
  PieChartIcon,
  Settings2Icon,
  TerminalIcon,
  BotIcon,
  UserIcon,
  ShieldAlertIcon,
  UsersIcon,
  FileTextIcon,
  ActivityIcon,
  HistoryIcon,
  SettingsIcon,
  BookOpenIcon
} from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"

import DashboardPage from "./dashboard"
import ModeratorDashboard from "./moderator-dashboard"
import AdminManagementPage from "./admin-management"
import UserManagementPage from "./user-management"
import ReportsPage from "./reports"
import AuditLogsPage from "./audit-logs"
import BannedUsersPage from "./banned-users"
import AccountPage from "./account"
import SettingsPage from "./settings"
import AddSubject from "./AddSubject"
import NotesPage from "../student/NotesPage"
import SessionsPage from "../student/SessionLobby"
import LiveLobby from "./LiveLobby"

export default function AdminWorkspace({ 
  initialPage = "dashboard", 
  user,
  notes,
  subjects,
  onAddNote,
  onDeleteNote,
  onRateNote,
  onReportNote,
  onRemoveNote,
  onDismissReport,
  onAddSubject
}) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  useEffect(() => {
    setCurrentPage(initialPage)
  }, [initialPage])

  const isModerator = user?.role === 'moderator'
  
  const getFilteredNav = () => {
    if (isModerator) {
      return [
        {
          title: "Overview",
          url: "/dashboard",
          icon: <PieChartIcon className="size-4" />,
        },
        {
          title: "Content Management",
          url: "#",
          icon: <BookOpenIcon className="size-4" />,
          items: [
            {
              title: "Notes",
              url: "/dashboard/notes",
            },
            {
              title: "Sessions",
              url: "/dashboard/sessions",
            },
          ],
        },
        {
          title: "Account",
          url: "/dashboard/account",
          icon: <UserIcon className="size-4" />,
        },
      ]
    }
    
    // Default Admin Nav
    return [
      {
        title: "Overview",
        url: "/dashboard",
        icon: <PieChartIcon className="size-4" />,
      },
      {
        title: "Content Management",
        url: "#",
        icon: <BookOpenIcon className="size-4" />,
        items: [
          {
            title: "Notes",
            url: "/dashboard/notes",
          },
          {
            title: "Sessions",
            url: "/dashboard/sessions",
          },
        ],
      },
      {
        title: "User Control",
        url: "#",
        icon: <Settings2Icon className="size-4" />,
        items: [
          {
            title: "Student/Staff",
            url: "/dashboard/users",
          },
          {
            title: "Administrators",
            url: "/dashboard/admins",
          },
        ],
      },
      {
        title: "Moderation",
        url: "#",
        icon: <ShieldAlertIcon className="size-4" />,
        items: [
          {
            title: "Reports Queue",
            url: "/dashboard/reports",
          },
          {
            title: "Banned Users",
            url: "/dashboard/bans",
          },
        ],
      },
      {
        title: "System Logs",
        url: "#",
        icon: <HistoryIcon className="size-4" />,
        items: [
          {
            title: "Audit Journal",
            url: "/dashboard/audit-logs",
          },
        ],
      },
      {
        title: "Administration",
        url: "/dashboard/settings",
        icon: <SettingsIcon className="size-4" />,
      },
      {
        title: "Account",
        url: "/dashboard/account",
        icon: <UserIcon className="size-4" />,
      },
    ]
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard": return isModerator ? "Moderator Dashboard" : "Global Dashboard";
      case "admins": return "Admin Management";
      case "notes": return "Notes Management";
      case "add-subject": return "Add Subject";
      case "sessions": return "Sessions Management";
      case "live-lobby": return "Live Session Lobby";
      case "users": return "User Management";
      case "reports": return "Moderation Reports";
      case "audit-logs": return "System Audit Logs";
      case "bans": return "Banned Accounts";
      case "account": return "Account Settings";
      case "settings": return "Administration";
      default: return isModerator ? "Moderator Portal" : "Admin Portal";
    }
  }

  const navToUse = getFilteredNav()

  return (
    <SidebarProvider>
      <AppSidebar navMain={navToUse} portalName={isModerator ? "Moderator Portal" : "Admin Portal"} />
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
        <main className="flex-1 overflow-hidden bg-background">
          <div className="h-full">
            {currentPage === "dashboard" && (
              isModerator ? <ModeratorDashboard isSubPage={true} user={user} /> : <DashboardPage isSubPage={true} user={user} />
            )}
            {currentPage === "admins" && !isModerator && <AdminManagementPage isSubPage={true} user={user} />}
            {currentPage === "add-subject" && <AddSubject isSubPage={true} user={user} subjects={subjects} onAddSubject={onAddSubject} />}
            {currentPage === "notes" && (
              <NotesPage 
                isSubPage={true} 
                user={user} 
                notes={notes} 
                subjects={subjects} 
                onAddNote={onAddNote}
                onDeleteNote={onDeleteNote}
                onRateNote={onRateNote}
                onReportNote={onReportNote}
                onRemoveNote={onRemoveNote}
                onDismissReport={onDismissReport}
                onAddSubject={onAddSubject}
                onNavigateToAddSubject={() => setCurrentPage('add-subject')}
              />
            )}
            {currentPage === "sessions" && <SessionsPage isSubPage={true} user={user} />}
            {currentPage === "live-lobby" && <LiveLobby user={user} />}
            {currentPage === "users" && !isModerator && <UserManagementPage isSubPage={true} user={user} />}
            {currentPage === "reports" && !isModerator && <ReportsPage isSubPage={true} user={user} />}
            {currentPage === "audit-logs" && !isModerator && <AuditLogsPage isSubPage={true} user={user} />}
            {currentPage === "bans" && !isModerator && <BannedUsersPage isSubPage={true} user={user} />}
            {currentPage === "account" && <AccountPage isSubPage={true} user={user} />}
            {currentPage === "settings" && !isModerator && <SettingsPage isSubPage={true} user={user} />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
