'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FileText, Mic, PlayCircle, Newspaper, Info, Shell } from "lucide-react";
import { generateResourceRecommendations, GenerateResourceRecommendationsOutput } from "@/ai/flows/generate-resource-recommendations";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';

type Resource = GenerateResourceRecommendationsOutput['recommendedResources'][0];

function getIconForType(type: string) {
    switch (type) {
        case 'video':
            return <PlayCircle className="h-6 w-6 text-primary" />;
        case 'article':
            return <FileText className="h-6 w-6 text-primary" />;
        case 'session':
            return <Mic className="h-6 w-6 text-primary" />;
        case 'news':
            return <Newspaper className="h-6 w-6 text-primary" />;
        default:
            return <Info className="h-6 w-6 text-primary" />;
    }
}


function ResourceCard({ rec }: { rec: Resource }) {
    return (
        <Link href={rec.link} target="_blank" rel="noopener noreferrer" className="group">
            <Card className="h-full flex flex-col hover:border-primary transition-colors overflow-hidden">
                <div className="relative aspect-video">
                    <Image
                        src={rec.imageUrl}
                        alt={rec.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                        data-ai-hint="health abstract"
                    />
                </div>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            {getIconForType(rec.type)}
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-base font-semibold leading-tight group-hover:underline">{rec.title}</CardTitle>
                            <p className="text-sm capitalize text-muted-foreground mt-1">{rec.type}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <CardDescription className="line-clamp-3">
                        {rec.description}
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    )
}

function LoadingSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="flex flex-col">
                    <Skeleton className="aspect-video w-full" />
                    <CardHeader>
                        <div className='flex items-center gap-4'>
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}


export default function ResourcesPage() {
    const [recommendations, setRecommendations] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const data = await generateResourceRecommendations({
                    userProfile: "User is a 30-year-old software developer experiencing high stress and symptoms of burnout. They have reported poor sleep quality and a lack of regular physical activity.",
                    userPreferences: "Prefers a mix of content types including short actionable videos, guided audio sessions, and in-depth articles for weekend reading. Also interested in reputable health news.",
                    userGoals: "To reduce stress, improve sleep, incorporate mindfulness into their daily routine, and learn about nutrition for cognitive performance."
                });
                setRecommendations(data.recommendedResources);
            } catch (error) {
                console.error("Failed to fetch resources:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const filteredRecommendations = useMemo(() => {
        if (activeTab === 'all') {
            return recommendations;
        }
        return recommendations.filter(rec => rec.type === activeTab);
    }, [activeTab, recommendations]);

    const tabs = ['all', 'video', 'article', 'session', 'news'];

    return (
        <div className="flex-1 flex flex-col p-4 md:p-8 pt-6 overflow-hidden">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center gap-2">
                    <div className="md:hidden">
                        <SidebarTrigger />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight font-headline">Resources</h2>
                        <p className="text-muted-foreground">A library of personalized resources to support your journey.</p>
                    </div>
                </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="flex-wrap h-auto">
                    {tabs.map(tab => (
                        <TabsTrigger key={tab} value={tab} className="capitalize">{tab}</TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <div className="flex-1 overflow-y-auto mt-4 pr-2">
                {loading ? (
                    <LoadingSkeleton />
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredRecommendations.map((rec, index) => (
                            <ResourceCard key={index} rec={rec} />
                        ))}
                    </div>
                )}
                 {filteredRecommendations.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
                        <Shell className="w-16 h-16 mb-4" />
                        <h3 className="text-xl font-semibold">No Resources Found</h3>
                        <p>No resources found for the "{activeTab}" category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}