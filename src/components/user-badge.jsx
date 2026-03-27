import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserBadge({ name, email, role, size = "md", className = "" }) {
  const avatarSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const initials = name ? name.substring(0, 2).toUpperCase() : "??";
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className={`${avatarSize} border border-border/50 shadow-sm shrink-0`}>
        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${email}`} alt={name} />
        <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground truncate">{name}</span>
          {role === 'superadmin' && (
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-sm shrink-0">
              Super
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-medium truncate">{email}</span>
      </div>
    </div>
  )
}
