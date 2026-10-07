// ============================================================================
// WashUp - Laundry Management Mobile App
// Root Application Component (Compatible with both Expo Go & Expo Router)
// Modul 1: Sintaks & UI Dasar — Pemrograman Mobile
// ============================================================================

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './app/(tabs)/index';
import CreateOrderScreen from './app/(tabs)/orders';
import StatusScreen from './app/(tabs)/status';
import HistoryScreen from './app/(tabs)/history';
import ProfileScreen from './app/(tabs)/profile';

import { COLORS } from './src/constants/theme';
import { IconSymbol } from './src/components/IconSymbol';

type TabType = 'home' | 'orders' | 'status' | 'history' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Render screen yang aktif berdasarkan tab yang dipilih
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'orders':
        return <CreateOrderScreen />;
      case 'status':
        return <StatusScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Konten Halaman Aktif */}
        <View style={styles.contentContainer}>
          {renderScreen()}
        </View>

        {/* ================================================================ */}
        {/* BOTTOM NAVIGATION BAR: Beranda | Pesanan | Status | Riwayat | Profil */}
        {/* Memenuhi spesifikasi: Bottom navigation dengan visual active state */}
        {/* ================================================================ */}
        <View style={styles.bottomTabBar}>
          {/* 1. Beranda */}
          <Pressable
            onPress={() => setActiveTab('home')}
            style={styles.tabItem}
          >
            <View
              style={[
                styles.iconBox,
                activeTab === 'home' && styles.activeIconBox,
              ]}
            >
              <IconSymbol
                name={activeTab === 'home' ? 'home' : 'home-outline'}
                size={22}
                color={activeTab === 'home' ? COLORS.primary : COLORS.textMuted}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === 'home' ? COLORS.primary : COLORS.textMuted },
              ]}
            >
              Beranda
            </Text>
          </Pressable>

          {/* 2. Pesanan */}
          <Pressable
            onPress={() => setActiveTab('orders')}
            style={styles.tabItem}
          >
            <View
              style={[
                styles.iconBox,
                activeTab === 'orders' && styles.activeIconBox,
              ]}
            >
              <IconSymbol
                name={activeTab === 'orders' ? 'add-circle' : 'add-circle-outline'}
                size={24}
                color={activeTab === 'orders' ? COLORS.primary : COLORS.textMuted}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === 'orders' ? COLORS.primary : COLORS.textMuted },
              ]}
            >
              Pesanan
            </Text>
          </Pressable>

          {/* 3. Status */}
          <Pressable
            onPress={() => setActiveTab('status')}
            style={styles.tabItem}
          >
            <View
              style={[
                styles.iconBox,
                activeTab === 'status' && styles.activeIconBox,
              ]}
            >
              <IconSymbol
                name={activeTab === 'status' ? 'sync-circle' : 'sync-circle-outline'}
                size={24}
                color={activeTab === 'status' ? COLORS.primary : COLORS.textMuted}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === 'status' ? COLORS.primary : COLORS.textMuted },
              ]}
            >
              Status
            </Text>
          </Pressable>

          {/* 4. Riwayat */}
          <Pressable
            onPress={() => setActiveTab('history')}
            style={styles.tabItem}
          >
            <View
              style={[
                styles.iconBox,
                activeTab === 'history' && styles.activeIconBox,
              ]}
            >
              <IconSymbol
                name={activeTab === 'history' ? 'time' : 'time-outline'}
                size={22}
                color={activeTab === 'history' ? COLORS.primary : COLORS.textMuted}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === 'history' ? COLORS.primary : COLORS.textMuted },
              ]}
            >
              Riwayat
            </Text>
          </Pressable>

          {/* 5. Profil */}
          <Pressable
            onPress={() => setActiveTab('profile')}
            style={styles.tabItem}
          >
            <View
              style={[
                styles.iconBox,
                activeTab === 'profile' && styles.activeIconBox,
              ]}
            >
              <IconSymbol
                name={activeTab === 'profile' ? 'person' : 'person-outline'}
                size={22}
                color={activeTab === 'profile' ? COLORS.primary : COLORS.textMuted}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === 'profile' ? COLORS.primary : COLORS.textMuted },
              ]}
            >
              Profil
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBox: {
    transform: [{ scale: 1.08 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});
