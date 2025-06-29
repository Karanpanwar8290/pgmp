'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth as firebaseAuth, isFirebaseEnabled } from '@/lib/firebase/client';
import { Loader2 } from 'lucide-react';

const mockUser: User = {
  uid: 'mock-user-123',
  email: 'test@example.com',
  displayName: 'Wellness Seeker',
  photoURL: 'https://placehold.co/100x100.png',
  emailVerified: true,
  isAnonymous: false,
  metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
  providerData: [],
  providerId: 'password',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({ token: 'mock-token', expirationTime: '', authTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null, claims: {} }),
  reload: async () => {},
  toJSON: () => ({}),
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
});

const FullScreenLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // If Firebase is disabled, use a mock provider
  if (!isFirebaseEnabled()) {
    const mockValue = {
      user: mockUser,
      loading: false,
      signOut: async () => { console.log("Sign out in mock mode."); router.push('/'); },
      signIn: async () => { console.log("Sign in in mock mode."); },
      signUp: async () => { console.log("Sign up in mock mode."); },
    };

    return (
      <AuthContext.Provider value={mockValue}>
        {children}
      </AuthContext.Provider>
    );
  }

  // --- Real Firebase Auth Provider Logic ---

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isLandingPage = pathname === '/';

    // If user is not logged in and not on an allowed public page, redirect to login.
    if (!user && !isAuthPage && !isLandingPage) {
      router.push('/login');
    }
    // If user is logged in and on an auth page, redirect to dashboard.
    else if (user && isAuthPage) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);


  const value = {
    user,
    loading,
    signIn: (email: string, pass: string) => signInWithEmailAndPassword(firebaseAuth!, email, pass),
    signUp: async (email: string, pass: string, name: string) => {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth!, email, pass);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      return userCredential;
    },
    signOut: () => {
      return signOut(firebaseAuth!).then(() => {
        router.push('/');
      });
    },
  };

  if (loading) {
    return <FullScreenLoader />;
  }
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isLandingPage = pathname === '/';
  // While loading, or if trying to access protected page while logged out, show loader
  if (!user && !isAuthPage && !isLandingPage) {
    return <FullScreenLoader />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
