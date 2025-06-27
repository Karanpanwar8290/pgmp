import { generateResourceRecommendations } from '@/ai/flows/generate-resource-recommendations';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlayCircle, FileText, Mic, Info } from "lucide-react"

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

export async function Recommendations() {
  const recommendations = await generateResourceRecommendations({
    userProfile: "User is a 30-year-old software developer experiencing high stress and symptoms of burnout. They have reported poor sleep quality and a lack of regular physical activity.",
    userPreferences: "Prefers short, actionable content like 5-10 minute videos or guided audio sessions. Less interested in long articles.",
    userGoals: "To reduce stress, improve sleep, and incorporate mindfulness into their daily routine."
  });

  return (
    <div className="space-y-6">
      {recommendations.recommendedResources.slice(0, 4).map((rec, index) => (
        <a key={index} href={rec.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
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
        </a>
      ))}
    </div>
  )
}
