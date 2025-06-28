'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Activity, BedDouble, BrainCircuit, HeartPulse, CalendarDays, Loader2 } from "lucide-react"
import { Goals } from "./components/goals"
import { Recommendations } from "./components/recommendations"
import { UserNav } from "@/components/user-nav"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { summarizeWellbeingData, WellbeingSummary } from "@/ai/flows/summarize-wellbeing-data"
import { firestore } from '@/lib/firebase/client';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { Goal } from "../goals/types"
import { useAuth } from '@/components/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 md:hidden" />
            <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48 mt-2" />
            </div>
        </div>
        <div className="hidden items-center space-x-2 md:flex">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
       <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
           <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
        </TabsList>
         <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-1/2" />
                    <Skeleton className="h-3 w-3/4 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
               <Card className="col-span-full lg:col-span-4"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
               <Card className="col-span-full lg:col-span-3"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
            </div>
          </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [initialGoals, setInitialGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // Fetch summary and goals in parallel
          const [summaryData, goalsData] = await Promise.all([
            summarizeWellbeingData({
              assessments: [{ name: 'Stress', score: 25, maxScore: 100, interpretation: 'Low stress levels reported.' }],
              demographics: { age: 30, gender: 'Female' },
              activityLogs: [
                  { type: 'Running', duration: 30, intensity: 'High', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
                  { type: 'Yoga', duration: 60, intensity: 'Low', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
                  { type: 'Strength Training', duration: 45, intensity: 'Medium', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() }
              ],
            }),
            (() => {
                if (!firestore) return Promise.resolve([]);
                const goalsQuery = query(
                    collection(firestore, 'goals'),
                    where('userId', '==', user.uid),
                    where('completed', '==', false),
                    orderBy('createdAt', 'desc')
                );
                return getDocs(goalsQuery);
            })()
          ]);
          
          setSummary(summaryData);

          if (goalsData && 'docs' in goalsData) {
            const fetchedGoals = goalsData.docs.map(doc => {
              const data = doc.data();
              return {
                  id: doc.id,
                  ...data,
                  dueDate: data.dueDate.toDate(),
                  createdAt: data.createdAt.toDate(),
              } as Goal;
            });
            setInitialGoals(fetchedGoals);
          }

        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (loading || !summary) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome back, {user?.displayName || 'friend'}!</h2>
                <p className="text-muted-foreground">Here's a look at your wellbeing status.</p>
            </div>
        </div>
        <div className="hidden items-center space-x-2 md:flex">
          <Button>
            <CalendarDays className="mr-2 h-4 w-4" />
            This Month
          </Button>
          <UserNav user={user} />
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Wellbeing Score
                </CardTitle>
                <HeartPulse className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.wellbeingScore}/100</div>
                <p className="text-xs text-muted-foreground">
                  {summary.wellbeingScoreChange} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sleep Quality
                </CardTitle>
                <BedDouble className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.sleepQuality}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.sleepQualitySubtext}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
                <BrainCircuit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.stressLevel}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.stressLevelChange} from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Minutes
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{summary.activeMinutes}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.activeMinutesChange} from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Goals initialGoals={initialGoals} />
            <Card className="col-span-full lg:col-span-3">
              <CardHeader>
                <CardTitle className="font-headline">AI Recommendations</CardTitle>
                <CardDescription>
                  Personalized resources to support your journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Recommendations />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
