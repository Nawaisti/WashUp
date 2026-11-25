// ============================================================================
// WashUp - Root Layout & Route Protection Guard (Expo Router)
// (Modul 4: Global AuthProvider, OrdersProvider, & Navigation Guards useSegments)
// ============================================================================

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { OrdersProvider } from '../src/context/OrdersContext';
import { COLORS } from '../src/constants/theme';
import { WashUpLogo } from '../src/components/WashUpLogo';

function RootNavigationGuard() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // RULE 1: Jika masih memeriksa sesi di expo-secure-store, jangan redirect dulu
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // RULE 2 & 4: Belum login (atau baru saja logout) dan mencoba akses area aplikasi
      router.replace('/(auth)/login' as any);
    } else if (user && inAuthGroup) {
      // RULE 3: Sudah terautentikasi tetapi masih berada di halaman login
      router.replace('/(tabs)' as any);
    }
  }, [user, isLoading, segments, router]);

  // Perisai pemuatan bebas kedipan (flicker-free startup shield)
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <WashUpLogo size="large" showTagline />
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
        <Text style={styles.loadingText}>Memulihkan sesi terenkripsi...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: 'WashUp',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <RootNavigationGuard />
      </OrdersProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  spinner: {
    marginTop: 24,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
