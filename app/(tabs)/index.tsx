// ============================================================================
// WashUp - Halaman Home / Beranda (Screen 1)
// (Modul 1: JSX, View, Text, Image/Icon, Pressable, ScrollView, .map(), Component)
// ============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, RADIUS } from '../../src/constants/theme';
import { SERVICES_DATA, ORDERS_DATA, PROMO_BANNER, CURRENT_USER } from '../../src/constants/dummyData';
import { WashUpLogo } from '../../src/components/WashUpLogo';
import { ServiceCard } from '../../src/components/ServiceCard';
import { StatusBadge } from '../../src/components/StatusBadge';
import { IconSymbol } from '../../src/components/IconSymbol';
import { Service } from '../../src/types/laundry';

export default function HomeScreen() {
  const router = useRouter();

  // Pesanan aktif yang sedang berlangsung (#WU0067)
  const activeOrder = ORDERS_DATA.find((o) => o.status === 'Sedang Dicuci') || ORDERS_DATA[0];

  // Handler saat kartu layanan diklik
  const handleServicePress = (service: Service) => {
    // Navigasi ke halaman Buat Pesanan
    router.push('/(tabs)/orders' as any);
  };

  // Handler saat tombol Pesan Sekarang di banner diklik
  const handleOrderNow = () => {
    router.push('/(tabs)/orders' as any);
  };

  // Handler saat kartu pesanan aktif diklik
  const handleActiveOrderPress = () => {
    router.push('/(tabs)/status' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================================================================== */}
        {/* HEADER SECTION: Logo WashUp & User Greeting */}
        {/* ================================================================== */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            {/* Logo WashUp */}
            <WashUpLogo size="medium" />

            {/* Quick Profile Avatar Shortcut (Modul 1: Image) */}
            <Pressable
              onPress={() => router.push('/(tabs)/profile' as any)}
              style={({ pressed }) => [
                styles.avatarCircle,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
                }}
                style={styles.avatarImage}
              />
              <View style={styles.onlineDot} />
            </Pressable>
          </View>

          {/* Sapaan Pengguna & Tagline WashUp */}
          <View style={styles.greetingBox}>
            <Text style={styles.greetingTitle}>Halo, Selamat Datang!</Text>
            <Text style={styles.greetingSubtitle}>
              Laundry lebih mudah, kapan saja.
            </Text>
          </View>
        </View>

        {/* ================================================================== */}
        {/* PROMOTIONAL CARD: "Pakaian bersih, hidup lebih nyaman." */}
        {/* ================================================================== */}
        <View style={[styles.promoCard, SHADOWS.card]}>
          {/* Hiasan background abstrak lingkaran */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.promoBadge}>
            <IconSymbol name="sparkles" size={12} color="#FFFFFF" />
            <Text style={styles.promoBadgeText}>Promo Spesial Pekan Ini</Text>
          </View>

          <Text style={styles.promoTitle}>{PROMO_BANNER.title}</Text>
          <Text style={styles.promoDesc}>{PROMO_BANNER.tagline}</Text>

          {/* Tombol Pesan Sekarang */}
          <Pressable
            onPress={handleOrderNow}
            style={({ pressed }) => [
              styles.promoButton,
              // INLINE STYLING: Efek tactile saat tombol promo ditekan
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text style={styles.promoButtonText}>{PROMO_BANNER.buttonText}</Text>
            <IconSymbol name="arrow-forward" size={16} color={COLORS.primaryDark} />
          </Pressable>
        </View>

        {/* ================================================================== */}
        {/* PESANAN AKTIF SECTION: Menampilkan pesanan yang sedang berjalan */}
        {/* ================================================================== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pesanan Aktif</Text>
          <Pressable onPress={handleActiveOrderPress}>
            <Text style={styles.seeAllText}>Lihat Status</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleActiveOrderPress}
          style={({ pressed }) => [
            styles.activeOrderCard,
            SHADOWS.card,
            // INLINE STYLING: Border dan opacity berubah saat card disentuh
            {
              opacity: pressed ? 0.92 : 1,
              borderColor: pressed ? COLORS.primary : COLORS.statusProcessBorder,
            },
          ]}
        >
          <View style={styles.activeOrderHeader}>
            <View style={styles.activeOrderIdRow}>
              <View style={styles.pulseIndicator} />
              <Text style={styles.activeOrderId}>{activeOrder.id}</Text>
            </View>
            <StatusBadge status={activeOrder.status} size="small" />
          </View>

          <View style={styles.activeOrderBody}>
            <View style={styles.activeOrderIconCircle}>
              <IconSymbol name="shirt-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.activeOrderDetails}>
              <Text style={styles.activeOrderService}>{activeOrder.service}</Text>
              <Text style={styles.activeOrderSub}>
                Estimasi selesai hari ini • {activeOrder.amount} {activeOrder.unit}
              </Text>
            </View>
            <View style={styles.chevronBox}>
              <IconSymbol name="chevron-forward" size={18} color={COLORS.primary} />
            </View>
          </View>
        </Pressable>

        {/* ================================================================== */}
        {/* LAYANAN KAMI SECTION: Render Array of Objects dengan .map() */}
        {/* (Modul 1: Array of Objects, .map(), Reusable ServiceCard) */}
        {/* ================================================================== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Layanan Kami</Text>
          <Text style={styles.sectionCaption}>Pilihan paket sesuai kebutuhan</Text>
        </View>

        <View style={styles.servicesGrid}>
          {SERVICES_DATA.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={handleServicePress}
            />
          ))}
        </View>

        {/* ================================================================== */}
        {/* FOOTER INFO: Keunggulan WashUp */}
        {/* ================================================================== */}
        <View style={styles.featuresBanner}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconBox}>
              <IconSymbol name="flash-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.featureTitle}>Proses Cepat</Text>
            <Text style={styles.featureSub}>Mulai 12 Jam Selesai</Text>
          </View>

          <View style={styles.featureDivider} />

          <View style={styles.featureItem}>
            <View style={styles.featureIconBox}>
              <IconSymbol name="shield-checkmark-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.featureTitle}>Higienis & Rapi</Text>
            <Text style={styles.featureSub}>Detergen Premium</Text>
          </View>

          <View style={styles.featureDivider} />

          <View style={styles.featureItem}>
            <View style={styles.featureIconBox}>
              <IconSymbol name="bicycle-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.featureTitle}>Antar-Jemput</Text>
            <Text style={styles.featureSub}>Langsung ke Lokasi</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  onlineDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.statusSuccess,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingBox: {
    marginTop: 4,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  promoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: 22,
    marginBottom: 26,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  decorativeCircle2: {
    position: 'absolute',
    right: 40,
    bottom: -40,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    marginBottom: 12,
    gap: 6,
  },
  promoBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 26,
  },
  promoDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 18,
    lineHeight: 18,
  },
  promoButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: RADIUS.full,
    gap: 8,
  },
  promoButtonText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionCaption: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  activeOrderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: COLORS.statusProcessBorder,
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeOrderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  activeOrderId: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  activeOrderBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeOrderIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeOrderDetails: {
    flex: 1,
  },
  activeOrderService: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  activeOrderSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chevronBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesGrid: {
    marginBottom: 16,
  },
  featuresBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  featureSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  featureDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.borderLight,
  },
});
