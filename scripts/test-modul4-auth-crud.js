// ============================================================================
// WashUp - Automated Verification Suite for Modul 4 (Database & Autentikasi)
// Menjalankan: node scripts/test-modul4-auth-crud.js
// Memverifikasi seluruh kriteria penilaian Tugas Minggu Demo Modul 4:
// 1. Secure Token Storage (5%) - expo-secure-store adapter & helpers
// 2. Supabase Auth Flow (10%) - signUp (+metadata callsign), signInWithPassword, signOut, .trim(), loading states
// 3. Global AuthContext & Real-time Session Subscription (5%) - getSession() & onAuthStateChange()
// 4. Route Protection Guards (5%) - AuthProvider, useSegments(), loading shield, redirect rules
// 5. Cloud PostgreSQL CRUD, Optimistic UI, Pull-to-Refresh, & RLS Schema
// 6. Kontinuitas Modul 1-3 (WeatherService, unfinished users* files preserved)
// ============================================================================

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`PASS  ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${name}\n      ${e.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const supabaseLib = read('src/lib/supabase.ts');
const authContext = read('src/context/AuthContext.tsx');
const ordersContext = read('src/context/OrdersContext.tsx');
const loginScreen = read('app/(auth)/login.tsx');
const rootLayout = read('app/_layout.tsx');
const profileScreen = read('app/(tabs)/profile.tsx');
const statusScreen = read('app/(tabs)/status.tsx');
const ordersScreen = read('app/(tabs)/orders.tsx');
const historyScreen = read('app/(tabs)/history.tsx');
const homeScreen = read('app/(tabs)/index.tsx');
const sqlSchema = read('docs/supabase_schema.sql');

test('Kriteria 1 (5%): Secure Token Storage menggunakan expo-secure-store (bukan AsyncStorage)', () => {
  assert(supabaseLib.includes("from 'expo-secure-store'"), 'expo-secure-store belum diimpor');
  assert(!supabaseLib.includes('AsyncStorage'), 'Tidak boleh memakai AsyncStorage untuk token');
  assert(supabaseLib.includes('SecureStore.setItemAsync'), 'setItemAsync belum ada');
  assert(supabaseLib.includes('SecureStore.getItemAsync'), 'getItemAsync belum ada');
  assert(supabaseLib.includes('SecureStore.deleteItemAsync'), 'deleteItemAsync belum ada');
  assert(supabaseLib.includes('ExpoSecureStoreAdapter'), 'ExpoSecureStoreAdapter belum ada');
  assert(
    supabaseLib.includes('process.env.EXPO_PUBLIC_SUPABASE_URL') &&
      supabaseLib.includes('process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY'),
    'Variabel environment EXPO_PUBLIC_SUPABASE_* belum digunakan'
  );
});

test('Kriteria 2 (10%): Supabase Auth Flow (Sign Up + metadata callsign, Sign In, Sign Out, .trim(), Loading State)', () => {
  assert(loginScreen.includes('supabase.auth.signUp'), 'supabase.auth.signUp belum ada');
  assert(loginScreen.includes('callsign: cleanCallsign'), 'metadata callsign belum dikirim saat signUp');
  assert(
    loginScreen.includes('supabase.auth.signInWithPassword'),
    'supabase.auth.signInWithPassword belum ada'
  );
  assert(
    loginScreen.includes('email.trim()') && loginScreen.includes('callsign.trim()'),
    '.trim() pada input email/callsign belum diterapkan'
  );
  assert(
    loginScreen.includes('keyboardType="email-address"') &&
      loginScreen.includes('autoCapitalize="none"'),
    'Konfigurasi keyboard email belum lengkap'
  );
  assert(
    loginScreen.includes('<ActivityIndicator') && loginScreen.includes('disabled={loading}'),
    'Loading state ActivityIndicator & pencegahan multiple submission belum lengkap'
  );
  assert(
    authContext.includes('supabase.auth.signOut') && profileScreen.includes('signOut'),
    'Alur Sign Out belum terhubung ke AuthContext dan Profile'
  );
});

test('Kriteria 3 (5%): Global AuthContext & Real-time Session Subscription', () => {
  assert(
    authContext.includes('supabase.auth.getSession()'),
    'Rehidrasi sesi awal getSession() belum ada'
  );
  assert(
    authContext.includes('supabase.auth.onAuthStateChange'),
    'Langganan real-time onAuthStateChange belum ada'
  );
  assert(
    authContext.includes('subscription.unsubscribe()'),
    'Cleanup subscription.unsubscribe() belum ada'
  );
});

test('Kriteria 4 (5%): Route Protection Guards di app/_layout.tsx', () => {
  assert(rootLayout.includes('<AuthProvider>'), 'AuthProvider belum membungkus aplikasi');
  assert(rootLayout.includes('useSegments()'), 'useSegments() belum digunakan');
  assert(rootLayout.includes('if (isLoading) return;'), 'Guard belum menahan redirect saat isLoading');
  assert(
    rootLayout.includes("router.replace('/(auth)/login'") &&
      rootLayout.includes("router.replace('/(tabs)'"),
    'Aturan redirect /(auth)/login dan /(tabs) belum lengkap'
  );
});

test('Operasi Cloud PostgreSQL CRUD (SELECT, INSERT, UPDATE, DELETE), Optimistic UI, Pull-to-Refresh, & RLS SQL', () => {
  assert(
    ordersContext.includes(".from('laundry_orders')") &&
      ordersContext.includes(".select('*')") &&
      ordersContext.includes('.insert(') &&
      ordersContext.includes('.update(') &&
      ordersContext.includes('.delete()'),
    'Query CRUD Supabase pada tabel laundry_orders belum lengkap'
  );
  assert(
    ordersContext.includes('previousCloudOrders') &&
      statusScreen.includes('advanceOrderStatus') &&
      statusScreen.includes('cancelOrDeleteOrder'),
    'Optimistic UI + rollback untuk UPDATE/DELETE belum terhubung'
  );
  assert(
    homeScreen.includes('<RefreshControl') &&
      statusScreen.includes('<RefreshControl') &&
      historyScreen.includes('<RefreshControl') &&
      ordersScreen.includes('createOrder('),
    'Pull-to-Refresh atau pembuatan pesanan Cloud belum terhubung'
  );
  assert(
    sqlSchema.includes('ENABLE ROW LEVEL SECURITY') &&
      sqlSchema.includes('auth.uid() = user_id'),
    'Skrip SQL RLS belum mengisolasi data dengan auth.uid() = user_id'
  );
});

test('Kontinuitas Modul 1-3 tetap terjaga & file draft live-coding sudah bersih', () => {
  assert(homeScreen.includes('<WeatherCard') && homeScreen.includes('fetchWeather()'), 'Fitur cuaca Modul 3 hilang dari Home');
  assert(fs.existsSync(path.join(root, 'src/services/weatherService.ts')), 'weatherService.ts hilang');
  assert(!fs.existsSync(path.join(root, 'src/components/UsersCard.tsx')), 'UsersCard.tsx masih ada');
  assert(!fs.existsSync(path.join(root, 'src/services/users.ts')), 'users.ts masih ada');
  assert(!fs.existsSync(path.join(root, 'src/types/users.ts')), 'types/users.ts masih ada');
});

console.log(`\n${passed} lulus, ${failed} gagal`);
process.exit(failed ? 1 : 0);
