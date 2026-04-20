import { useState, useEffect } from "react"
import {
  SettingsIcon,
  ShieldAlertIcon,
  UsersIcon,
  HistoryIcon,
  FileTextIcon,
  ShieldIcon,
  SearchIcon,
  UserIcon,
  Loader2,
  PieChartIcon,
  DownloadIcon,
  MoonIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"

export default function BannedUsersPage({ isSubPage = false, user }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [isTogglingTheme, setIsTogglingTheme] = useState(false)

  // Fetch current settings on mount
  useEffect(() => {
    if (user?.id || user?._id) {
      fetchSettings()
    }
  }, [user?.id, user?._id])

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/settings")
      const result = await response.json()
      if (result.success && result.data) {
        setIsMaintenanceMode(result.data.maintenance_mode === true)
        setIsDarkTheme(result.data.system_theme === "dark")
      }
    } catch (error) {
      console.error("Failed to fetch system settings:", error)
    }
  }

  const handleToggleMaintenance = async () => {
    if (isTogglingMaintenance) return;
    setIsTogglingMaintenance(true)
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.id;
      const response = await fetch("http://localhost:5000/api/settings/maintenance_mode", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": token
        },
        body: JSON.stringify({ value: !isMaintenanceMode })
      });
      const data = await response.json();
      if (data.success) {
        setIsMaintenanceMode(!isMaintenanceMode);
      } else {
        alert("Failed to toggle maintenance mode.");
      }
    } catch (error) {
      console.error("Error toggling maintenance:", error);
    } finally {
      setIsTogglingMaintenance(false)
    }
  }

  const handleToggleTheme = async () => {
    if (isTogglingTheme) return;
    setIsTogglingTheme(true)
    const newTheme = !isDarkTheme ? "dark" : "light"
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.id;
      const response = await fetch("http://localhost:5000/api/settings/system_theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": token
        },
        body: JSON.stringify({ value: newTheme })
      });
      const data = await response.json();
      if (data.success) {
        setIsDarkTheme(!isDarkTheme);
        // Apply it instantly for the admin without reload
        if (!isDarkTheme) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        alert("Failed to toggle system theme.");
      }
    } catch (error) {
      console.error("Error toggling system theme:", error);
    } finally {
      setIsTogglingTheme(false)
    }
  }

  const handleGenerateReport = async () => {
    if (isGeneratingReport) return;
    setIsGeneratingReport(true)
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.id;
      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: { "x-admin-id": token }
      })
      const data = await response.json()

      if (data.success) {
        const exportData = data.data.map(user => ({
          "Name": user.name,
          "Email": user.email,
          "SLIIT ID": user.sliitId,
          "Role": user.role.toUpperCase(),
          "Status": user.isBanned ? "BANNED" : "ACTIVE",
          "Joined Date": new Date(user.createdAt).toLocaleDateString(),
          "Last Login": user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"
        }))

        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "UniSync Users Report")

        const colWidths = [{ wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 25 }]
        worksheet["!cols"] = colWidths

        const dateStr = new Date().toISOString().split('T')[0]
        XLSX.writeFile(workbook, `UniSync_System_Report_${dateStr}.xlsx`)
      } else {
        alert("Failed to fetch data for report.")
      }
    } catch (error) {
      console.error("Error generating report:", error)
      alert("An error occurred while generating the report.")
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const systemSettings = [
    {
      id: "theme",
      title: "System Dark Theme",
      description: "Force dark mode interface for all users system-wide.",
      icon: MoonIcon,
      action: handleToggleTheme,
      isLoading: isTogglingTheme,
      status: isDarkTheme ? "Dark" : "Light",
      statusColor: isDarkTheme ? "text-brand-blue font-bold" : "text-muted-foreground"
    },
    {
      id: "maintenance",
      title: "Maintenance Mode",
      description: "Toggle system upgrades lock to block non-admins.",
      icon: SettingsIcon,
      action: handleToggleMaintenance,
      isLoading: isTogglingMaintenance,
      status: isMaintenanceMode ? "Off" : "On",
      statusColor: isMaintenanceMode ? "text-red-500 font-bold" : "text-muted-foreground"
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage roles, edit details, and view standard user access.",
      icon: UsersIcon,
      link: "/dashboard/users"
    },
    {
      id: "admins",
      title: "Administrators",
      description: "Configure system administrators, moderators, and their roles.",
      icon: ShieldIcon,
      link: "/dashboard/admins"
    },
    {
      id: "bans",
      title: "Banned Users",
      description: "Review system restrictions and account suspensions.",
      icon: ShieldAlertIcon,
      link: "/dashboard/bans"
    },
    {
      id: "audit",
      title: "Audit Logs",
      description: "Comprehensive history of all administrative actions.",
      icon: HistoryIcon,
      link: "/dashboard/audit-logs"
    },
    {
      id: "reports",
      title: "Action Reports",
      description: "Pending moderation requests flagged by students or staff.",
      icon: FileTextIcon,
      link: "/dashboard/reports"
    },
    {
      id: "export",
      title: "Export Users",
      description: "Download a full Excel report of all system accounts.",
      icon: DownloadIcon,
      action: handleGenerateReport,
      isLoading: isGeneratingReport,
      status: "Download"
    },
    {
      id: "account",
      title: "My Account",
      description: "Manage your personal administrator profile.",
      icon: UserIcon,
      link: "/dashboard/account"
    }
  ];

  const filteredSettings = systemSettings.filter(setting =>
    setting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const SettingRow = ({ item }) => (
    <div className="group flex items-center justify-between p-4 bg-card hover:bg-muted/50 border-b border-border last:border-0 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-muted-foreground group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-colors">
          <item.icon className="size-5" />
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-brand-blue group-hover:text-brand-pink transition-colors">
            {item.link ? (
              <a href={item.link} className="hover:underline">{item.title}</a>
            ) : (
              <button onClick={item.action} className="hover:underline text-left" disabled={item.isLoading}>
                {item.title}
              </button>
            )}
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
        </div>
      </div>

      {item.action && (
        <Button
          variant="outline"
          size="sm"
          onClick={item.action}
          disabled={item.isLoading}
          className="ml-4 w-28 border-border hover:bg-slate-100 hidden sm:flex dark:text-foreground"
        >
          {item.isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : item.id === 'maintenance' ? (
            isMaintenanceMode ? "Turn Off" : "Turn On"
          ) : item.id === 'theme' ? (
            isDarkTheme ? "Switch Light" : "Switch Dark"
          ) : (
            item.status
          )}
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {isSubPage && (
        <div className="flex items-center justify-between px-6 py-4 border-b bg-card shrink-0">
          <div />
        </div>
      )}

      <main className="flex-1 overflow-auto p-6 lg:p-10 bg-background">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-normal tracking-tight text-foreground">
              Administration
            </h1>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="size-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-card border-border shadow-sm focus-visible:ring-brand-blue"
            />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-foreground mb-3 ml-1">System</h3>
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              {filteredSettings.length > 0 ? (
                filteredSettings.map(setting => (
                  <SettingRow key={setting.id} item={setting} />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No settings match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
