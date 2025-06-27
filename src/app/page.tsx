import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, BarChart, HeartPulse } from 'lucide-react';
import { Logo } from '@/components/icons';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold font-headline">Wellbeing Navigator</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
              <Link href="/dashboard">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
                Your Personal AI-Powered Wellbeing Companion
              </h1>
              <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground mb-8">
                Unlock a healthier, happier you. Our intelligent platform analyzes your wellbeing data to provide personalized insights and actionable recommendations.
              </p>
              <Button size="lg" asChild>
                <Link href="/dashboard">Start Your Journey Free</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Wellbeing dashboard illustration"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint="data abstract"
              />
            </div>
          </div>
        </section>

        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-headline">A New Era of Personal Wellness</h2>
                <p className="text-muted-foreground mt-2">Go beyond tracking. Start understanding.</p>
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
                        <BarChart className="w-6 h-6" />
                    </div>
                    Actionable Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Interactive charts and graphs provide a clear overview of your progress, helping you stay motivated and informed.
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

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Wellbeing Navigator. A Final Year Project.</p>
      </footer>
    </div>
  );
}
