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
  SettingsIcon
} from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"

import DashboardPage from "./dashboard"
import AdminManagementPage from "./admin-management"
import UserManagementPage from "./user-management"
import ReportsPage from "./reports"
import AuditLogsPage from "./audit-logs"
import BannedUsersPage from "./banned-users"
import AccountPage from "./account"
import SettingsPage from "./settings"

export default function AdminWorkspace({ initialPage = "dashboard" }) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    setCurrentPage(initialPage)
  }, [initialPage])

  const adminNav = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <PieChartIcon className="size-4" />,
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

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard": return "Global Dashboard";
      case "admins": return "Admin Management";
      case "users": return "User Management";
      case "reports": return "Moderation Reports";
      case "audit-logs": return "System Audit Logs";
      case "bans": return "Banned Accounts";
      case "account": return "Account Settings";
      case "settings": return "Administration";
      default: return "Admin Portal";
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar navMain={adminNav} portalName="Admin Portal" />
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
            {currentPage === "dashboard" && <DashboardPage isSubPage={true} />}
            {currentPage === "admins" && <AdminManagementPage isSubPage={true} />}
            {currentPage === "users" && <UserManagementPage isSubPage={true} />}
            {currentPage === "reports" && <ReportsPage isSubPage={true} />}
            {currentPage === "audit-logs" && <AuditLogsPage isSubPage={true} />}
            {currentPage === "bans" && <BannedUsersPage isSubPage={true} />}
            {currentPage === "account" && <AccountPage isSubPage={true} />}
            {currentPage === "settings" && <SettingsPage isSubPage={true} />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
