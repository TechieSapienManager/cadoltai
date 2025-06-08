
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateTheme: (theme: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Apply user's theme preference when they sign in
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('theme_preference')
                .eq('id', session.user.id)
                .single();
              
              if (profile?.theme_preference) {
                // Apply the theme
                const root = document.documentElement;
                if (profile.theme_preference === 'dark') {
                  root.classList.add('dark');
                } else {
                  root.classList.remove('dark');
                }
                localStorage.setItem('theme', profile.theme_preference);
              }
            } catch (error) {
              console.log('Could not load theme preference:', error);
            }
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear theme when signing out
      localStorage.removeItem('theme');
      document.documentElement.classList.remove('dark');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateTheme = async (theme: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          theme_preference: theme,
          email: user.email
        });
      
      // Apply theme immediately
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
