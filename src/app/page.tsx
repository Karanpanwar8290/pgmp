import Link from 'next/link';
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
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
            Navigate Your Path to Wellbeing
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Our AI-powered platform provides personalized insights and resources to help you thrive. Understand your patterns, set meaningful goals, and embark on a journey to a healthier, happier you.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">Start Your Journey</Link>
          </Button>
        </section>

        <section className="bg-muted py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center font-headline mb-12">Why Wellbeing Navigator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <HeartPulse className="w-6 h-6 text-primary" />
                    Personalized Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Our AI creates a dynamic profile of your wellbeing, identifying patterns in your behavior and needs to offer tailored support.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <BarChart className="w-6 h-6 text-primary" />
                    Visualized Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Interactive charts and graphs provide a clear overview of your progress, helping you stay motivated and informed.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Rocket className="w-6 h-6 text-primary" />
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
