import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfile() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Avatar className="h-9 w-9">
        <AvatarImage src="https://placehold.co/100x100.png" alt="@user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="grid gap-0.5 text-sm">
        <div className="font-medium truncate">User</div>
        <div className="text-muted-foreground truncate">user@example.com</div>
      </div>
    </div>
  );
}
