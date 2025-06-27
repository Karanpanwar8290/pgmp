import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center gap-2">
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">My Profile</h2>
                    <p className="text-muted-foreground">View and manage your profile details.</p>
                </div>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                     <Avatar className="h-24 w-24">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="@olivia" data-ai-hint="woman portrait"/>
                        <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <h3 className="text-2xl font-bold">Olivia Martin</h3>
                        <p className="text-lg text-muted-foreground">olivia.martin@email.com</p>
                    </div>
                </div>
                <Button>Edit Profile</Button>
            </CardContent>
        </Card>
    </div>
  );
}
