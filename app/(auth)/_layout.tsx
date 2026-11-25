// ============================================================================
// WashUp - Auth Route Group Layout (Modul 4: Rute Otentikasi)
// ============================================================================

import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
