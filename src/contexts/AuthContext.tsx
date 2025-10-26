import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { MockAuth, shouldUseMockAuth } from '@/lib/mockAuth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: Record<string, unknown>) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shouldUseMockAuth()) {
      // Use mock auth for development
      const mockSession = MockAuth.getCurrentSession();
      if (mockSession) {
        setSession(mockSession as any);
        setUser(mockSession.user as User);
      }
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: Record<string, unknown>) => {
    console.log('Attempting signup for:', email);
    
    if (shouldUseMockAuth()) {
      const result = await MockAuth.signUp(email, password, userData);
      if (!result.error) {
        setUser(result.data.user);
        setSession(result.data.session);
      }
      return { error: result.error };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    console.log('Signup result:', { user: data?.user?.email, session: !!data?.session, error });
    
    // If signup was successful but user is not automatically signed in,
    // sign them in immediately
    if (!error && data.user && !data.session) {
      console.log('No session after signup, attempting automatic sign in...');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.log('Auto sign-in result:', { error: signInError });
      return { error: signInError };
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    if (shouldUseMockAuth()) {
      const result = await MockAuth.signIn(email, password);
      if (!result.error) {
        setUser(result.data.user);
        setSession(result.data.session);
      }
      return { error: result.error };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    if (shouldUseMockAuth()) {
      await MockAuth.signOut();
      setUser(null);
      setSession(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};