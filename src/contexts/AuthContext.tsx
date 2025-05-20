import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy admin credentials
const DUMMY_ADMIN = {
  email: 'admin@admin.com',
  password: 'admin123',
  user: {
    id: 'dummy-admin-id',
    email: 'admin@admin.com',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    user_metadata: { role: 'admin' },
    app_metadata: { role: 'admin' }
  } as User
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for active session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsAdmin(false); // Real users are not admin by default
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
        setIsAdmin(false); // Real users are not admin by default
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check for dummy admin credentials first
      if (email === DUMMY_ADMIN.email && password === DUMMY_ADMIN.password) {
        setUser(DUMMY_ADMIN.user);
        setIsAdmin(true);
        setLoading(false);
        
        // Store admin session in localStorage for persistence
        localStorage.setItem('dummyAdminSession', JSON.stringify({
          user: DUMMY_ADMIN.user,
          isAdmin: true,
          timestamp: Date.now()
        }));
        
        return { data: DUMMY_ADMIN.user, error: null };
      }

      // Otherwise, try regular Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (data?.user) {
        setIsAdmin(false);
      }
      
      return { data: data?.user || null, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data: data?.user || null, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    // Clear dummy admin session
    localStorage.removeItem('dummyAdminSession');
    setIsAdmin(false);
    
    // Sign out from Supabase
    await supabase.auth.signOut();
  };

  // Check for persisted admin session on mount
  useEffect(() => {
    const savedAdminSession = localStorage.getItem('dummyAdminSession');
    if (savedAdminSession) {
      try {
        const session = JSON.parse(savedAdminSession);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        // Check if session is less than 1 hour old
        if (Date.now() - session.timestamp < oneHour) {
          setUser(session.user);
          setIsAdmin(session.isAdmin);
        } else {
          // Session expired, remove it
          localStorage.removeItem('dummyAdminSession');
        }
      } catch (error) {
        // Invalid session data, remove it
        localStorage.removeItem('dummyAdminSession');
      }
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}