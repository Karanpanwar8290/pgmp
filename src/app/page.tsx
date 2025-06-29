import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/icons";
import { HeartPulse, MessageCircle, Rocket } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
                <Logo className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold font-headline">Wellbeing Navigator</span>
            </Link>
            <nav className="hidden md:flex items-center gap-2">
                <Button variant="ghost">Features</Button>
                <Button variant="ghost">Pricing</Button>
                <Button variant="ghost">Contact</Button>
            </nav>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button asChild>
                    <Link href="/dashboard">Go to App</Link>
                </Button>
            </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
                        Navigate Your Journey to Better Health
                    </h1>
                    <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground mb-8">
                        Unlock a healthier, happier you with our AI-powered companion. We analyze your wellbeing data to provide personalized insights and actionable recommendations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button size="lg" asChild>
                            <Link href="/dashboard">Start Your Journey Free</Link>
                        </Button>
                        <Button size="lg" variant="outline">Learn More</Button>
                    </div>
                </div>
                <div className="relative flex items-center justify-center">
                     <div className="absolute -inset-2 bg-primary/10 rounded-full blur-3xl"></div>
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="Wellbeing dashboard illustration"
                        width={600}
                        height={400}
                        className="rounded-xl shadow-2xl relative"
                        data-ai-hint="data abstract"
                    />
                </div>
            </div>
        </section>

        <section id="features" className="bg-secondary/50 py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                    <p className="text-primary font-semibold">FEATURES</p>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mt-2">
                        A New Era of Personal Wellness
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Go beyond simple tracking. Understand your body and mind with our intelligent platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                                    <HeartPulse className="w-6 h-6" />
                                </div>
                                Holistic Profiling
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            Our AI creates a dynamic profile of your wellbeing, identifying patterns in your behavior and needs to offer tailored support.
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                AI-Powered Coaching
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           Chat with your personal AI coach anytime. Get instant advice, motivation, and support on your wellness journey.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                Intelligent Guidance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            Receive suggestions for articles, videos, and sessions that are most relevant to your unique goals and preferences.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Wellbeing Navigator. All Rights Reserved.</p>
            <div className="flex gap-4">
                 <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
                 <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}