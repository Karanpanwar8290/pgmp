import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 overflow-y-auto">
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
        <div className="grid gap-8">
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
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Tailor your wellbeing experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>What are your main areas of interest?</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="stress" defaultChecked />
                                <Label htmlFor="stress" className="font-normal">Stress Management</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="sleep" defaultChecked />
                                <Label htmlFor="sleep" className="font-normal">Sleep Improvement</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="fitness" />
                                <Label htmlFor="fitness" className="font-normal">Fitness & Exercise</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="nutrition" defaultChecked />
                                <Label htmlFor="nutrition" className="font-normal">Nutrition</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="mindfulness" />
                                <Label htmlFor="mindfulness" className="font-normal">Mindfulness</Label>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reminder">Daily Reminder Time</Label>
                         <Select defaultValue="evening">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="morning">Morning (9:00 AM)</SelectItem>
                                <SelectItem value="afternoon">Afternoon (1:00 PM)</SelectItem>
                                <SelectItem value="evening">Evening (8:00 PM)</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <Button>Save Preferences</Button>
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
