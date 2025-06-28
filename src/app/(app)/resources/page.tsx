import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FileText, Mic, PlayCircle, Info } from "lucide-react";
import { generateResourceRecommendations } from "@/ai/flows/generate-resource-recommendations";
import Link from "next/link";
import Image from "next/image";

function getIconForType(type: string) {
    switch (type) {
        case 'video':
            return <PlayCircle className="h-6 w-6 text-primary" />;
        case 'article':
            return <FileText className="h-6 w-6 text-primary" />;
        case 'session':
            return <Mic className="h-6 w-6 text-primary" />;
        default:
            return <Info className="h-6 w-6 text-primary" />;
    }
}

export default async function ResourcesPage() {

  const data = await generateResourceRecommendations({
    userProfile: "User is a 30-year-old software developer experiencing high stress and symptoms of burnout. They have reported poor sleep quality and a lack of regular physical activity.",
    userPreferences: "Prefers a mix of content types including short actionable videos, guided audio sessions, and in-depth articles for weekend reading.",
    userGoals: "To reduce stress, improve sleep, incorporate mindfulness into their daily routine, and learn about nutrition for cognitive performance."
  });

  const recommendations = data.recommendedResources;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-y-auto">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recommendations.map((rec, index) => (
            <Link key={index} href={rec.link} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="h-full flex flex-col hover:border-primary transition-colors">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                {getIconForType(rec.type)}
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base font-semibold group-hover:underline">{rec.title}</CardTitle>
                                <p className="text-sm capitalize text-muted-foreground">{rec.type}</p>
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
          ))}
        </div>
    </div>
  );
}
