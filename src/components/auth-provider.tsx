'use client';

import type { User } from 'firebase/auth';
import React, { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Mock user for development without a real login process.
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
}

// Create a context with a mock user and disabled loading state.
const AuthContext = createContext<AuthContextType>({
  user: mockUser,
  loading: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // The value provided to the context consumers.
  const value = {
    user: mockUser,
    loading: false, // Always false as we are not fetching any auth state.
    signOut: async () => {
      // In a real app, this would sign the user out.
      // Here, we can just log it and redirect to a conceptual "login" page.
      console.log("Sign out clicked. Authentication is currently disabled.");
      router.push('/'); // Redirect to the root, which will then redirect to dashboard.
    },
  };

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
