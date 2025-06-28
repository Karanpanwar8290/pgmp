import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Award, Target, Zap, Trophy } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-y-auto">
        <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center gap-2">
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">My Profile</h2>
                    <p className="text-muted-foreground">Your personal progress and achievements.</p>
                </div>
            </div>
             <Button asChild>
                <Link href="/settings">Edit Profile</Link>
            </Button>
        </div>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://placehold.co/100x100.png" alt="@olivia" data-ai-hint="woman portrait"/>
                            <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <h3 className="text-2xl font-bold">Olivia Martin</h3>
                            <p className="text-lg text-muted-foreground">olivia.martin@email.com</p>
                            <p className="text-sm text-muted-foreground">Member since: Jan 2024</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Wellbeing Goals</CardTitle>
                    <CardDescription>Your current focus for improving your wellbeing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Mindfulness Practice</span>
                            <span>4 / 5 sessions</span>
                        </div>
                        <Progress value={80} />
                    </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Weekly Active Minutes</span>
                            <span>120 / 150 mins</span>
                        </div>
                        <Progress value={80} />
                    </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Consistent Sleep Schedule</span>
                            <span>5 / 7 nights</span>
                        </div>
                        <Progress value={71} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" /> Achievements</CardTitle>
                    <CardDescription>Milestones you've unlocked on your journey.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center text-center p-4 bg-secondary rounded-lg">
                        <Award className="w-10 h-10 text-primary mb-2"/>
                        <p className="font-semibold text-sm">First Week</p>
                        <p className="text-xs text-muted-foreground">Completed 7 days</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-secondary rounded-lg">
                        <Zap className="w-10 h-10 text-primary mb-2"/>
                        <p className="font-semibold text-sm">Active Pro</p>
                        <p className="text-xs text-muted-foreground">1000 active mins</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-secondary rounded-lg">
                        <Award className="w-10 h-10 text-primary mb-2"/>
                        <p className="font-semibold text-sm">Mindful Master</p>
                        <p className="text-xs text-muted-foreground">20 meditations</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-secondary/50 rounded-lg opacity-60">
                        <Trophy className="w-10 h-10 text-muted-foreground mb-2"/>
                        <p className="font-semibold text-sm">1-Month Streak</p>
                        <p className="text-xs text-muted-foreground">Locked</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
