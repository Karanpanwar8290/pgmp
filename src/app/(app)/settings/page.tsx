import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center gap-2">
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Settings</h2>
                    <p className="text-muted-foreground">Manage your account and preferences.</p>
                </div>
            </div>
        </div>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Olivia Martin" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="olivia.martin@email.com" readOnly />
            </div>
            <Button>Update Account</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary/50">
                <div>
                    <Label htmlFor="email-notifications" className="font-medium cursor-pointer">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly summaries and important updates.</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary/50">
                 <div>
                    <Label htmlFor="push-notifications" className="font-medium cursor-pointer">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get real-time alerts for recommendations and reminders.</p>
                </div>
                <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
