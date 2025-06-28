'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Award, Target, Zap, Trophy, ShieldQuestion, Loader2 } from "lucide-react";
import Link from "next/link";
import { firestore } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Goal } from "../goals/types";
import { useAuth } from '@/components/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';


const staticAchievements = [
    { icon: Award, title: "First Week", description: "Completed 7 days" },
    { icon: Zap, title: "Active Pro", description: "1000 active mins" },
    { icon: Award, title: "Mindful Master", description: "20 meditations" },
];

function ProfileSkeleton() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-y-auto">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 md:hidden" />
                    <div>
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-48 mt-2" />
                    </div>
                </div>
                 <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-6">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="grid gap-2">
                                <Skeleton className="h-7 w-48" />
                                <Skeleton className="h-5 w-64" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                         {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


export default function ProfilePage() {
    const { user } = useAuth();
    const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchCompletedGoals = async () => {
                if (!firestore) {
                    setLoading(false);
                    return;
                }
                try {
                    const goalsQuery = query(
                        collection(firestore, 'goals'),
                        where('userId', '==', user.uid),
                        where('completed', '==', true)
                    );
                    const goalsSnapshot = await getDocs(goalsQuery);
                    setCompletedGoals(goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal)));
                } catch (error) {
                    console.error("Failed to fetch completed goals:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCompletedGoals();
        } else if (user === null) {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <ProfileSkeleton />;
    }
  
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
                            <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={user?.displayName || "User"} data-ai-hint="person portrait"/>
                            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <h3 className="text-2xl font-bold">{user?.displayName || "Wellness Seeker"}</h3>
                            <p className="text-lg text-muted-foreground">{user?.email}</p>
                            <p className="text-sm text-muted-foreground">Member since: {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024'}</p>
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
                    {completedGoals.map((goal) => (
                         <div key={goal.id} className="flex flex-col items-center text-center p-4 bg-secondary rounded-lg">
                            <Trophy className="w-10 h-10 text-primary mb-2"/>
                            <p className="font-semibold text-sm">{goal.title}</p>
                            <p className="text-xs text-muted-foreground">Goal Completed!</p>
                        </div>
                    ))}
                    {staticAchievements.map((ach, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-4 bg-secondary rounded-lg">
                            <ach.icon className="w-10 h-10 text-primary mb-2"/>
                            <p className="font-semibold text-sm">{ach.title}</p>
                            <p className="text-xs text-muted-foreground">{ach.description}</p>
                        </div>
                    ))}
                     {completedGoals.length === 0 && (
                         <div className="col-span-full flex flex-col items-center text-center p-4 bg-secondary/50 rounded-lg">
                            <ShieldQuestion className="w-10 h-10 text-muted-foreground mb-2"/>
                            <p className="font-semibold text-sm">No goals completed yet</p>
                            <p className="text-xs text-muted-foreground">Complete a goal to see it here!</p>
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
