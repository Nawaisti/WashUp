// ============================================================================
// WashUp - Centralized Supabase Client & Hardware-Encrypted SecureStore Adapter
// (Modul 4: Penyimpanan Kredensial Aman dengan expo-secure-store & Cloud Bridge)
// ============================================================================

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// Kunci khusus untuk demonstrasi penyimpanan token terenkripsi (Modul 4 Bab 1.2)
export const WASHUP_TOKEN_KEY = 'washup_user_token';

/**
 * 1. Simpan token terenkripsi ke Keychain iOS / Keystore Android
 * (Modul 4 Bab 1.2 & Codelab 1: Penyimpanan Kredensial yang Aman)
 */
export async function saveAuthToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(WASHUP_TOKEN_KEY, token);
    }
    return;
  }
  await SecureStore.setItemAsync(WASHUP_TOKEN_KEY, token);
}

/**
 * 2. Ambil token terenkripsi saat aplikasi dijalankan
 */
export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(WASHUP_TOKEN_KEY);
    }
    return null;
  }
  return await SecureStore.getItemAsync(WASHUP_TOKEN_KEY);
}

/**
 * 3. Hapus token terenkripsi saat pengguna keluar (logout)
 */
export async function deleteAuthToken(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(WASHUP_TOKEN_KEY);
    }
    return;
  }
  await SecureStore.deleteItemAsync(WASHUP_TOKEN_KEY);
}

/**
 * Storage Adapter yang menghubungkan sesi JWT Supabase langsung ke expo-secure-store
 * (Modul 4 Bab 2.2: Membangun Adapter Penyimpanan)
 */
export const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return Promise.resolve(window.localStorage.getItem(key));
      }
      return Promise.resolve(null);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Membaca kredensial dari environment variable (.env) tanpa hardcode secret key
const rawSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const rawSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

/**
 * Flag apakah variabel .env EXPO_PUBLIC_SUPABASE_URL & EXPO_PUBLIC_SUPABASE_ANON_KEY
 * sudah diisi dengan kredensial proyek Supabase yang valid.
 */
export const isSupabaseConfigured: boolean =
  rawSupabaseUrl.startsWith('https://') &&
  !rawSupabaseUrl.includes('xxxxxxxxxxxxxx') &&
  rawSupabaseAnonKey.length > 20 &&
  !rawSupabaseAnonKey.endsWith('...');

const effectiveSupabaseUrl = isSupabaseConfigured
  ? rawSupabaseUrl
  : 'https://placeholder-project.supabase.co';

const effectiveSupabaseAnonKey = isSupabaseConfigured
  ? rawSupabaseAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.signature';

/**
 * Singleton klien Supabase pusat untuk seluruh aplikasi WashUp
 * (Modul 4 Codelab 2: Cloud Bridge)
 */
export const supabase = createClient(effectiveSupabaseUrl, effectiveSupabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
