import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, BarChart, HeartPulse } from 'lucide-react';
import { Logo } from '@/components/icons';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold font-headline">Wellbeing Navigator</span>
        </Link>
        <nav>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
                Navigate Your Path to Wellbeing
              </h1>
              <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground mb-8">
                Our AI-powered platform provides personalized insights and resources to help you thrive. Understand your patterns, set meaningful goals, and embark on a journey to a healthier, happier you.
              </p>
              <Button size="lg" asChild>
                <Link href="/dashboard">Start Your Journey</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Wellbeing illustration"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint="wellbeing relaxing"
              />
            </div>
          </div>
        </section>

        <section className="bg-muted py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-headline">Why Wellbeing Navigator?</h2>
                <p className="text-muted-foreground mt-2">Discover a new approach to personal wellness.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-headline">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    Personalized Profiles
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
                    Visualized Insights
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
                    AI-Powered Recommendations
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
        <p>&copy; {new Date().getFullYear()} Wellbeing Navigator. All rights reserved.</p>
      </footer>
    </div>
  );
}
