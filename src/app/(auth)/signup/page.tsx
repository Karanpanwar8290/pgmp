'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import { Logo } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { isFirebaseEnabled } from '@/lib/firebase/client';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const firebaseDisabled = !isFirebaseEnabled();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (firebaseDisabled) return;

    setLoading(true);
    setError(null);
    try {
      await signUp(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Logo className="w-6 h-6" />
          <span className="text-lg font-semibold font-headline">Wellbeing Navigator</span>
        </Link>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account.</CardDescription>
        </CardHeader>
        <CardContent>
           {firebaseDisabled && (
            <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Authentication Disabled</AlertTitle>
              <AlertDescription>
                Firebase is not configured. Please set up your environment variables to enable login and sign-up functionality.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignUp} className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || firebaseDisabled}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || firebaseDisabled}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || firebaseDisabled}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || firebaseDisabled}>
              {loading ? 'Creating Account...' : 'Create an account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
