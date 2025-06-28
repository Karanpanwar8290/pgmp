'use client'

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState, useEffect } from "react"
import { BrainCircuit, Footprints, HeartPulse, Zap, Activity, BedDouble } from "lucide-react"

const chartConfig = {
  stress: { label: "Stress", color: "hsl(var(--chart-1))" },
  mood: { label: "Mood", color: "hsl(var(--chart-2))" },
  sleep: { label: "Sleep (hrs)", color: "hsl(var(--chart-3))" },
  running: { label: "Running", color: "hsl(var(--chart-1))" },
  yoga: { label: "Yoga", color: "hsl(var(--chart-2))" },
  weights: { label: "Weights", color: "hsl(var(--chart-3))" },
  walking: { label: "Walking", color: "hsl(var(--chart-4))" },
}

const StressOverTimeChart = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const newData = Array.from({ length: 30 }, (_, i) => ({
            date: `Day ${i + 1}`,
            stress: Math.floor(Math.random() * (6 - 2 + 1) + 2), // Random stress level 2-6
            mood: Math.floor(Math.random() * (8 - 4 + 1) + 4) // Random mood level 4-8
        }));
        setData(newData);
    }, []);

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 6)} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="stress" stroke="var(--color-stress)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="mood" stroke="var(--color-mood)" strokeWidth={2} dot={false} />
            </LineChart>
        </ChartContainer>
    );
}

const ActivityBreakdownChart = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        setData([
            { name: 'Running', value: 400, fill: 'var(--color-running)' },
            { name: 'Yoga', value: 300, fill: 'var(--color-yoga)' },
            { name: 'Weights', value: 300, fill: 'var(--color-weights)' },
            { name: 'Walking', value: 200, fill: 'var(--color-walking)' }
        ]);
    }, []);
    return (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    )
}

const SleepChart = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const newData = days.map(day => ({
            name: day,
            sleep: (Math.random() * (8.5 - 6) + 6).toFixed(1)
        }));
        setData(newData);
    }, []);
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="h" />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="sleep" fill="var(--color-sleep)" radius={8} />
            </BarChart>
        </ChartContainer>
    )
}


export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-y-auto">
        <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center gap-2">
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Analytics</h2>
                    <p className="text-muted-foreground">Your wellbeing data at a glance.</p>
                </div>
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Wellbeing Score</CardTitle>
                    <HeartPulse className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">78/100</div>
                    <p className="text-xs text-muted-foreground">Up by 5% this month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Mood</CardTitle>
                    <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">7.2/10</div>
                    <p className="text-xs text-muted-foreground">Slightly better than last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Sleep</CardTitle>
                    <BedDouble className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">7h 23m</div>
                    <p className="text-xs text-muted-foreground">Avg. last 7 days</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
                    <Footprints className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">245,801</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
                <CardHeader>
                    <CardTitle>Stress vs. Mood Over Time</CardTitle>
                    <CardDescription>Monthly trend of your reported stress and mood levels.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <StressOverTimeChart />
                </CardContent>
            </Card>
             <Card className="col-span-full lg:col-span-3">
                <CardHeader>
                    <CardTitle>Weekly Sleep Report</CardTitle>
                    <CardDescription>Your average hours of sleep per night for the last week.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                   <SleepChart />
                </CardContent>
            </Card>
        </div>
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>A summary of your logged activities this month.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <ActivityBreakdownChart />
            </CardContent>
        </Card>
    </div>
  );
}
