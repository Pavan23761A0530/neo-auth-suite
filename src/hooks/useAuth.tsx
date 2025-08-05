import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Get user role from metadata or default to patient
          const role = session.user.user_metadata?.role || 'patient';
          const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
          
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: role as 'patient' | 'doctor',
            name: name
          });
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const role = session.user.user_metadata?.role || 'patient';
        const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
        
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: role as 'patient' | 'doctor',
          name: name
        });
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // User state will be updated via the auth state change listener
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

    // Email confirmation handled by Supabase settings
    if (data.user) {
      // Registration successful - user can now login
    }

      // User state will be updated via the auth state change listener
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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