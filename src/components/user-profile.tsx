import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfile() {
  return (
    <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src="https://placehold.co/100x100.png" alt="@olivia" data-ai-hint="woman portrait" />
        <AvatarFallback>OM</AvatarFallback>
      </Avatar>
      <div className="grid gap-0.5 text-sm group-data-[collapsible=icon]:hidden">
        <div className="font-medium truncate">Olivia Martin</div>
        <div className="text-muted-foreground truncate">olivia.martin@email.com</div>
      </div>
    </div>
  );
}
