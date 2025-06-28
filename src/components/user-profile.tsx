import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "firebase/auth";

export function UserProfile({ user }: { user: User | null }) {
  return (
    <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={user?.displayName || ""} data-ai-hint="person portrait" />
        <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      <div className="grid gap-0.5 text-sm group-data-[collapsible=icon]:hidden">
        <div className="font-medium truncate">{user?.displayName || "Wellness Seeker"}</div>
        <div className="text-muted-foreground truncate">{user?.email}</div>
      </div>
    </div>
  );
}
