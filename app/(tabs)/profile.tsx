// ============================================================================
// WashUp - Halaman Profile (Screen 5 - Focus Detail Tinggi)
// (Modul 1: JSX, View, Text, Image/Avatar, Pressable, ScrollView,
//  Array of Objects, .map(), Reusable ProfileMenuItem, Inline Styling)
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '../../src/constants/theme';
import { PROFILE_MENU_DATA, CURRENT_USER } from '../../src/constants/dummyData';
import { ProfileMenuItem } from '../../src/components/ProfileMenuItem';
import { IconSymbol } from '../../src/components/IconSymbol';
import { formatRupiah } from '../../src/utils/helpers';
import { ProfileMenuItemType } from '../../src/types/laundry';

export default function ProfileScreen() {
  const router = useRouter();

  // State untuk feedback interaksi menu
  const [activeMenuNotice, setActiveMenuNotice] = useState<string | null>(null);

  // Handler saat item menu ditekan (Modul 1: Function + Pressable)
  const handleMenuPress = (item: ProfileMenuItemType) => {
    if (item.title === 'Riwayat Pesanan') {
      router.push('/(tabs)/history' as any);
      return;
    }
    setActiveMenuNotice(`Membuka pengaturan: ${item.title}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================================================================ */}
        {/* HEADER SECTION: Judul & Settings Icon                            */}
        {/* ================================================================ */}
        <View style={styles.screenHeader}>
          <Text style={styles.headerTitle}>Profil Saya</Text>
          <Pressable
            onPress={() => setActiveMenuNotice('Membuka Pengaturan Akun')}
            style={({ pressed }) => [
              styles.settingsButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <IconSymbol name="settings-outline" size={22} color={COLORS.textPrimary} />
          </Pressable>
        </View>

        {/* ================================================================ */}
        {/* USER PROFILE CARD: Avatar, Andi Pratama, Email, Membership       */}
        {/* ================================================================ */}
        <View style={[styles.profileCard, SHADOWS.card]}>
          <View style={styles.avatarSection}>
            {/* Avatar menggunakan Komponen Image (Modul 1: Image) */}
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
                }}
                style={styles.avatarImage}
                defaultSource={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80' }}
              />
              <Pressable
                onPress={() => setActiveMenuNotice('Ubah Foto Profil')}
                style={styles.editAvatarBadge}
              >
                <IconSymbol name="camera" size={12} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Nama & Email */}
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{CURRENT_USER.name}</Text>
                <View style={styles.memberBadge}>
                  <IconSymbol name="ribbon-outline" size={12} color="#D97706" />
                  <Text style={styles.memberBadgeText}>{CURRENT_USER.membership}</Text>
                </View>
              </View>
              <Text style={styles.userEmail}>{CURRENT_USER.email}</Text>
              <Text style={styles.userPhone}>{CURRENT_USER.phone}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Dompet Laundry & Poin Reward */}
          <View style={styles.walletRow}>
            <View style={styles.walletBox}>
              <View style={styles.walletIconCircle}>
                <IconSymbol name="wallet-outline" size={16} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.walletLabel}>Saldo WashPay</Text>
                <Text style={styles.walletValue}>{formatRupiah(CURRENT_USER.washPayBalance)}</Text>
              </View>
            </View>

            <View style={styles.walletDivider} />

            <View style={styles.walletBox}>
              <View style={[styles.walletIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <IconSymbol name="gift-outline" size={16} color="#D97706" />
              </View>
              <View>
                <Text style={styles.walletLabel}>Poin Reward</Text>
                <Text style={styles.walletValue}>{CURRENT_USER.rewardPoints} Pts</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notifikasi feedback interaktif sementara jika diklik */}
        {activeMenuNotice && (
          <View style={styles.noticeToast}>
            <IconSymbol name="checkmark-circle" size={16} color={COLORS.primary} />
            <Text style={styles.noticeToastText}>{activeMenuNotice}</Text>
            <Pressable onPress={() => setActiveMenuNotice(null)}>
              <IconSymbol name="close" size={14} color={COLORS.textSecondary} />
            </Pressable>
          </View>
        )}

        {/* ================================================================ */}
        {/* DAFTAR MENU PENGATURAN (Array of Objects + .map + ProfileMenuItem) */}
        {/* 7 Menu: Data Diri, Alamat, Notifikasi, Riwayat, Metode Pembayaran, */}
        {/* Bantuan, Tentang Aplikasi                                        */}
        {/* ================================================================ */}
        <View style={styles.menuSectionHeader}>
          <Text style={styles.menuSectionTitle}>Pengaturan & Bantuan</Text>
        </View>

        <View style={styles.menuList}>
          {PROFILE_MENU_DATA.map((menuItem) => (
            <ProfileMenuItem
              key={menuItem.id}
              item={menuItem}
              onPress={handleMenuPress}
            />
          ))}
        </View>

        {/* ================================================================ */}
        {/* ELEMEN ILUSTRASI LAUNDRY DI BAGIAN BAWAH                         */}
        {/* (Sesuai spesifikasi Section 12)                                  */}
        {/* ================================================================ */}
        <View style={styles.laundryIllustrationCard}>
          <View style={styles.bubbleIllustrationRow}>
            <View style={styles.washerIconIllustration}>
              <IconSymbol name="water" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.illustrationTextContainer}>
              <Text style={styles.illustrationTitle}>Tips Perawatan Pakaian</Text>
              <Text style={styles.illustrationDesc}>
                Pisahkan pakaian putih dan berwarna serta gunakan suhu air yang tepat untuk menjaga serat kain tetap awet.
              </Text>
            </View>
          </View>

          {/* Garis ornamen gelembung sabun */}
          <View style={styles.bubbleOrnaments}>
            <View style={[styles.bubble, { width: 10, height: 10, borderRadius: 5 }]} />
            <View style={[styles.bubble, { width: 16, height: 16, borderRadius: 8 }]} />
            <View style={[styles.bubble, { width: 8, height: 8, borderRadius: 4 }]} />
            <View style={[styles.bubble, { width: 12, height: 12, borderRadius: 6 }]} />
          </View>
        </View>

        {/* ================================================================ */}
        {/* APP FOOTER INFO                                                  */}
        {/* ================================================================ */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerAppName}>WashUp Mobile</Text>
          <Text style={styles.footerVersion}>
            Versi 1.0.0 • Modul 1: Sintaks & UI Dasar
          </Text>
          <Text style={styles.footerCopyright}>
            Praktikum Pemrograman Mobile © 2026
          </Text>
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
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 3,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  memberBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 16,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  walletValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  walletDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 10,
  },
  noticeToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  noticeToastText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryDark,
    flex: 1,
    marginHorizontal: 8,
  },
  menuSectionHeader: {
    marginBottom: 10,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  menuList: {
    marginBottom: 20,
  },
  laundryIllustrationCard: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
  },
  bubbleIllustrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  washerIconIllustration: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  illustrationTextContainer: {
    flex: 1,
  },
  illustrationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  illustrationDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  bubbleOrnaments: {
    flexDirection: 'row',
    position: 'absolute',
    right: 14,
    bottom: 8,
    gap: 8,
    opacity: 0.35,
  },
  bubble: {
    backgroundColor: COLORS.primary,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  footerAppName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  footerVersion: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footerCopyright: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
