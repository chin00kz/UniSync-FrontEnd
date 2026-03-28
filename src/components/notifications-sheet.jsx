import { useState } from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { 
  BellIcon, 
  InfoIcon, 
  ShieldAlertIcon, 
  UserPlusIcon, 
  CheckCircle2 
} from "lucide-react"

export function NotificationsSheet({ trigger }) {
  const [isOpen, setIsOpen] = useState(false)

  const notifications = [
    {
      id: 1,
      title: "New User Registered",
      description: "IT23194762 is awaiting role assignment.",
      time: "2 mins ago",
      type: "admin",
      icon: UserPlusIcon,
      color: "text-blue-600 bg-blue-50"
    },
    {
      id: 2,
      title: "System Maintenance",
      description: "Scheduled for Sunday at 02:00 AM.",
      time: "1 hour ago",
      type: "info",
      icon: InfoIcon,
      color: "text-amber-600 bg-amber-50"
    },
    {
      id: 3,
      title: "Report Pending Review",
      description: "A post has been flagged by the automated filter.",
      time: "3 hours ago",
      type: "moderation",
      icon: ShieldAlertIcon,
      color: "text-rose-600 bg-rose-50"
    },
    {
      id: 4,
      title: "Account Active",
      description: "Your administrator privileges have been verified.",
      time: "Yesterday",
      type: "system",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50"
    }
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger 
        render={
          <div className="inline-block">
            {trigger || (
              <button type="button" className="relative h-9 w-9 rounded-xl hover:bg-accent transition-colors flex items-center justify-center">
                <BellIcon className="size-5 text-muted-foreground" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] brand-gradient border-0 text-white font-bold">
                  {notifications.length}
                </Badge>
              </button>
            )}
          </div>
        }
      />
      <SheetContent className="w-[400px] sm:w-[450px] p-0 border-l border-border/50">
        <SheetHeader className="p-6 border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold tracking-tight">System Notifications</SheetTitle>
            <Badge variant="outline" className="brand-gradient text-white border-0 font-bold">
              {notifications.length} New
            </Badge>
          </div>
          <SheetDescription className="text-sm font-medium">
            Stay updated with the latest system activities.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="flex flex-col">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="p-4 border-b border-border/40 hover:bg-accent/50 transition-colors cursor-pointer group"
              >
                <div className="flex gap-4">
                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notification.color}`}>
                    <notification.icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {notification.title}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      {notification.description}
                    </p>
                    <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-primary/60">
                      {notification.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-6 bg-muted/20 mt-auto">
          <Button variant="outline" className="w-full text-xs font-bold border-dashed border-2 hover:border-primary/50 transition-all">
            Mark all as read
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
