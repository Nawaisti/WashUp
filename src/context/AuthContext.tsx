// ============================================================================
// WashUp - Global Authentication Context (Modul 4: AuthContext & Session Sync)
// Mengelola:
// 1. Rehidrasi sesi otomatis dari expo-secure-store saat aplikasi dibuka
// 2. Langganan real-time supabase.auth.onAuthStateChange()
// 3. Fungsi signOut() terpusat yang menghapus sesi cloud & brankas lokal
// ============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  supabase,
  isSupabaseConfigured,
  saveAuthToken,
  deleteAuthToken,
} from '../lib/supabase';
import { CURRENT_USER } from '../constants/dummyData';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  userDisplayName: string;
  userCallsign: string;
  userEmail: string;
  userMembership: string;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  isLoading: true,
  isConfigured: isSupabaseConfigured,
  userDisplayName: CURRENT_USER.name,
  userCallsign: CURRENT_USER.name,
  userEmail: CURRENT_USER.email,
  userMembership: CURRENT_USER.membership,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Rehidrasi Otomatis saat Startup: periksa sesi JWT di expo-secure-store
    async function restoreInitialSession() {
      if (!isSupabaseConfigured) {
        if (isMounted) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.log('Session restore notice:', error.message);
        }
        if (isMounted) {
          const activeSession = data?.session ?? null;
          setSession(activeSession);
          setUser(activeSession?.user ?? null);
          if (activeSession?.access_token) {
            await saveAuthToken(activeSession.access_token);
          }
        }
      } catch (err) {
        console.log('Unexpected session restore error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreInitialSession();

    // 2. Penyiar Peristiwa Langsung (Real-time Session Subscription)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth Event Fired:', event);
      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      if (currentSession?.access_token) {
        await saveAuthToken(currentSession.access_token);
      } else if (event === 'SIGNED_OUT') {
        await deleteAuthToken();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 3. Pengakhiran Sesi (Keluar) - menghapus sesi cloud & token di expo-secure-store
  const handleSignOut = async () => {
    await deleteAuthToken();
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const rawCallsign =
    (typeof metadata.callsign === 'string' && metadata.callsign.trim()) ||
    (typeof metadata.full_name === 'string' && metadata.full_name.trim()) ||
    '';

  const emailFallback = user?.email ? user.email.split('@')[0] : CURRENT_USER.name;
  const userDisplayName = rawCallsign || emailFallback;
  const userCallsign = rawCallsign || emailFallback;
  const userEmail = user?.email || CURRENT_USER.email;
  const userMembership =
    (typeof metadata.membership === 'string' && metadata.membership) ||
    CURRENT_USER.membership;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        userDisplayName,
        userCallsign,
        userEmail,
        userMembership,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
