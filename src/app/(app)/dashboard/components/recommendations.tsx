'use client';

import { useState, useEffect } from 'react';
import { type GenerateResourceRecommendationsOutput, generateResourceRecommendations } from '@/ai/flows/generate-resource-recommendations';
import { Avatar } from "@/components/ui/avatar";
import { PlayCircle, FileText, Mic, Info, Shell } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

type Resource = GenerateResourceRecommendationsOutput['recommendedResources'][0];

function getIconForType(type: string) {
    switch (type) {
        case 'video':
            return <PlayCircle className="h-5 w-5 text-white" />;
        case 'article':
            return <FileText className="h-5 w-5 text-white" />;
        case 'session':
            return <Mic className="h-5 w-5 text-white" />;
        default:
            return <Info className="h-5 w-5 text-white" />;
    }
}

function RecommendationsSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="grid gap-1 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}


export function Recommendations() {
    const [recommendations, setRecommendations] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                const data = await generateResourceRecommendations({
                    userProfile: "User is a 30-year-old software developer experiencing high stress and symptoms of burnout. They have reported poor sleep quality and a lack of regular physical activity.",
                    userPreferences: "Prefers short, actionable content like 5-10 minute videos or guided audio sessions. Less interested in long articles.",
                    userGoals: "To reduce stress, improve sleep, and incorporate mindfulness into their daily routine."
                });
                setRecommendations(data.recommendedResources);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return <RecommendationsSkeleton />;
    }

    if (!recommendations || recommendations.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-8">
                <Shell className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold">No Recommendations Yet</h3>
                <p className="text-sm">We're working on finding the best resources for you.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {recommendations.slice(0, 4).map((rec, index) => (
                <Link key={index} href={rec.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <Avatar className="h-10 w-10 bg-primary flex items-center justify-center">
                        {getIconForType(rec.type)}
                    </Avatar>
                    <div className="grid gap-1 flex-1">
                        <p className="text-sm font-medium leading-none group-hover:underline">
                            {rec.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {rec.description}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
