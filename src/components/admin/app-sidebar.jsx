import * as React from "react"

import { NavMain } from "@/components/admin/nav-main"
import { NavProjects } from "@/components/admin/nav-projects"
import { NavUser } from "@/components/admin/nav-user"
import { TeamSwitcher } from "@/components/admin/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "Chinookz",
    email: "chinookz@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "UniSync",
      logo: (
        <GalleryVerticalEndIcon />
      ),
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <PieChartIcon />
      ),
      isActive: true,
    },
    {
      title: "User Management",
      url: "#",
      icon: (
        <Settings2Icon />
      ),
      items: [
        {
          title: "All Users",
          url: "/dashboard/users",
        },
        {
          title: "Admin Management",
          url: "/dashboard/admins",
        },
      ],
    },
    {
      title: "Moderation",
      url: "#",
      icon: (
        <TerminalIcon />
      ),
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
      icon: (
        <BotIcon />
      ),
      items: [
        {
          title: "Audit Logs",
          url: "/dashboard/audit-logs",
        },
      ],
    },
  ],
  projects: [],
}

export function AppSidebar({
  ...props
}) {
  const [user, setUser] = React.useState(data.user)

  React.useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"))
    if (savedUser) {
      setUser({
        name: savedUser.name,
        email: savedUser.email,
        avatar: "/avatars/shadcn.jpg", // Default avatar
      })
    }
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient text-white">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-brand-blue">UniSync</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
