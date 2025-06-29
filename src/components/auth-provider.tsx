'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';

// A mock user to be used throughout the app, since we are removing authentication.
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

// Create a context with a default value.
const AuthContext = createContext<AuthContextType>({
  user: mockUser,
  loading: false,
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
});

// The new, simplified AuthProvider. It just renders children and provides the mock user.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    user: mockUser,
    loading: false,
    signOut: async () => { console.log("Sign out called in mock mode."); },
    signIn: async () => { console.log("Sign in called in mock mode."); },
    signUp: async () => { console.log("Sign up called in mock mode."); },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// The hook remains the same, so no other components need to change how they use it.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
