// ============================================================================
// WashUp - Halaman Profile (Screen 5 - Focus Detail Tinggi)
// (Modul 1: JSX, View, Text, Image/Avatar, Pressable, ScrollView,
//  Array of Objects, .map(), Reusable ProfileMenuItem, Inline Styling)
// (Modul 4: Identitas Sesi Supabase Aktif, Brankas Token expo-secure-store, & Sign Out)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '../../src/constants/theme';
import { PROFILE_MENU_DATA, CURRENT_USER } from '../../src/constants/dummyData';
import { ProfileMenuItem } from '../../src/components/ProfileMenuItem';
import { IconSymbol } from '../../src/components/IconSymbol';
import { CustomButton } from '../../src/components/CustomButton';
import { formatRupiah } from '../../src/utils/helpers';
import { ProfileMenuItemType } from '../../src/types/laundry';
import { useAuth } from '../../src/context/AuthContext';
import {
  getAuthToken,
  saveAuthToken,
  deleteAuthToken,
  WASHUP_TOKEN_KEY,
} from '../../src/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    session,
    userDisplayName,
    userEmail,
    userMembership,
    signOut,
  } = useAuth();

  // State untuk feedback interaksi menu
  const [activeMenuNotice, setActiveMenuNotice] = useState<string | null>(null);

  // Modul 4 (5%): State Brankas Token Terenkripsi (expo-secure-store)
  const [vaultTokenPreview, setVaultTokenPreview] = useState<string | null>(null);
  const [vaultStatusText, setVaultStatusText] = useState<string>(
    'Memeriksa brankas expo-secure-store...'
  );
  const [vaultLastActionTime, setVaultLastActionTime] = useState<string | null>(null);
  const [vaultActionCount, setVaultActionCount] = useState<number>(0);
  const [vaultHasToken, setVaultHasToken] = useState<boolean>(false);
  const [signingOut, setSigningOut] = useState<boolean>(false);

  const formatNowTime = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} WIB`;
  };

  const inspectSecureVault = async (isManualClick: boolean = false) => {
    const stored = await getAuthToken();
    const timestamp = formatNowTime();
    setVaultLastActionTime(timestamp);
    setVaultActionCount((prev) => prev + 1);

    if (stored) {
      const preview =
        stored.length > 32
          ? `${stored.slice(0, 18)}...${stored.slice(-12)}`
          : stored;
      setVaultTokenPreview(preview);
      setVaultHasToken(true);
      setVaultStatusText(
        `Token berhasil dimuat dari expo-secure-store (${WASHUP_TOKEN_KEY})`
      );
      if (isManualClick) {
        setActiveMenuNotice(
          `Token berhasil dimuat dari expo-secure-store (${timestamp})`
        );
      }
    } else {
      setVaultTokenPreview(null);
      setVaultHasToken(false);
      setVaultStatusText('Tidak ada token tersimpan di brankas expo-secure-store.');
      if (isManualClick) {
        setActiveMenuNotice(
          `Tidak ada token tersimpan di brankas (${timestamp})`
        );
      }
    }
  };

  useEffect(() => {
    inspectSecureVault(false);
  }, [session]);

  const handleSaveCurrentSessionToVault = async () => {
    const tokenToStore =
      session?.access_token ?? `WashUpEncryptedToken-${Date.now()}`;
    await saveAuthToken(tokenToStore);
    const timestamp = formatNowTime();
    await inspectSecureVault(false);
    setVaultStatusText(
      `Token berhasil disimpan & dienkripsi ke expo-secure-store (${WASHUP_TOKEN_KEY})`
    );
    setActiveMenuNotice(`Token berhasil disimpan ke expo-secure-store (${timestamp})`);
  };

  const handleLoadVaultToken = async () => {
    await inspectSecureVault(true);
  };

  const handleWipeVaultToken = async () => {
    await deleteAuthToken();
    const timestamp = formatNowTime();
    await inspectSecureVault(false);
    setVaultStatusText('Token telah dihapus. Tidak ada token tersimpan di brankas.');
    setActiveMenuNotice(`Token di brankas expo-secure-store berhasil dihapus (${timestamp})`);
  };

  const handleSignOutPress = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

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
        {/* USER PROFILE CARD: Avatar, Nama/Callsign, Email, Membership      */}
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
                defaultSource={{
                  uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
                }}
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
                <Text style={styles.userName} numberOfLines={1}>
                  {userDisplayName}
                </Text>
                <View style={styles.memberBadge}>
                  <IconSymbol name="ribbon-outline" size={12} color="#D97706" />
                  <Text style={styles.memberBadgeText}>{userMembership}</Text>
                </View>
              </View>
              <Text style={styles.userEmail} numberOfLines={1}>
                {userEmail}
              </Text>
              <Text style={styles.userPhone} numberOfLines={1}>
                {user?.id ? `UID: ${user.id.slice(0, 18)}...` : CURRENT_USER.phone}
              </Text>
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
              <View style={styles.walletTextCol}>
                <Text style={styles.walletLabel}>Saldo WashPay</Text>
                <Text style={styles.walletValue} numberOfLines={1}>
                  {formatRupiah(CURRENT_USER.washPayBalance)}
                </Text>
              </View>
            </View>

            <View style={styles.walletDivider} />

            <View style={styles.walletBox}>
              <View style={[styles.walletIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <IconSymbol name="gift-outline" size={16} color="#D97706" />
              </View>
              <View style={styles.walletTextCol}>
                <Text style={styles.walletLabel}>Poin Reward</Text>
                <Text style={styles.walletValue} numberOfLines={1}>
                  {CURRENT_USER.rewardPoints} Pts
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notifikasi feedback interaktif sementara jika diklik */}
        {activeMenuNotice && (
          <View style={styles.noticeToast}>
            <IconSymbol name="checkmark-circle" size={16} color={COLORS.primary} />
            <Text style={styles.noticeToastText} numberOfLines={2}>
              {activeMenuNotice}
            </Text>
            <Pressable onPress={() => setActiveMenuNotice(null)} hitSlop={8}>
              <IconSymbol name="close" size={14} color={COLORS.textSecondary} />
            </Pressable>
          </View>
        )}

        {/* ================================================================ */}
        {/* MODUL 4: BRANKAS SESI TERENKRIPSI (expo-secure-store) & SIGN OUT */}
        {/* ================================================================ */}
        <View style={[styles.vaultCard, SHADOWS.card]}>
          <View style={styles.vaultHeaderRow}>
            <View style={styles.vaultIconCircle}>
              <IconSymbol name="shield-checkmark-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.vaultTitleBox}>
              <Text style={styles.vaultTitle} numberOfLines={1}>
                Keamanan Sesi & Brankas Token
              </Text>
              <Text style={styles.vaultSubtitle} numberOfLines={1}>
                Enkripsi perangkat keras • expo-secure-store
              </Text>
            </View>
            <View
              style={[
                styles.vaultStateBadge,
                {
                  backgroundColor: vaultHasToken
                    ? COLORS.statusSuccess
                    : COLORS.textMuted,
                },
              ]}
            >
              <Text style={styles.vaultStateBadgeText}>
                {vaultHasToken ? 'TERSIMPAN' : 'KOSONG'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.vaultStatusBox,
              {
                backgroundColor: vaultHasToken
                  ? COLORS.primarySoft
                  : COLORS.surfaceSubtle,
              },
            ]}
          >
            <Text style={styles.vaultStatusLabel}>{vaultStatusText}</Text>
            <Text
              style={styles.vaultTokenCode}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              Token: {vaultTokenPreview ?? '— (tidak ada token) —'}
            </Text>
            {vaultLastActionTime && (
              <Text style={styles.vaultTimestampText}>
                Diperiksa #{vaultActionCount} • {vaultLastActionTime}
              </Text>
            )}
          </View>

          <View style={styles.vaultActionsRow}>
            <Pressable
              onPress={handleSaveCurrentSessionToVault}
              style={({ pressed }) => [
                styles.vaultSmallBtn,
                { backgroundColor: COLORS.primaryLight, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <IconSymbol name="lock-closed-outline" size={14} color={COLORS.primaryDark} />
              <Text style={styles.vaultSmallBtnText} numberOfLines={1}>
                Simpan
              </Text>
            </Pressable>

            <Pressable
              onPress={handleLoadVaultToken}
              style={({ pressed }) => [
                styles.vaultSmallBtn,
                { backgroundColor: COLORS.surfaceSubtle, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <IconSymbol name="key-outline" size={14} color={COLORS.textPrimary} />
              <Text
                style={[styles.vaultSmallBtnText, { color: COLORS.textPrimary }]}
                numberOfLines={1}
              >
                Muat
              </Text>
            </Pressable>

            <Pressable
              onPress={handleWipeVaultToken}
              style={({ pressed }) => [
                styles.vaultSmallBtn,
                { backgroundColor: COLORS.statusDangerBg, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <IconSymbol name="trash-outline" size={14} color={COLORS.statusDanger} />
              <Text
                style={[styles.vaultSmallBtnText, { color: COLORS.statusDanger }]}
                numberOfLines={1}
              >
                Hapus
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleSignOutPress}
            disabled={signingOut}
            style={({ pressed }) => [
              styles.signOutButton,
              { opacity: signingOut ? 0.7 : pressed ? 0.88 : 1 },
            ]}
          >
            {signingOut ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <IconSymbol name="log-out-outline" size={18} color="#FFFFFF" />
                <Text style={styles.signOutButtonText}>
                  Keluar & Kunci Aplikasi (Sign Out)
                </Text>
              </>
            )}
          </Pressable>
        </View>

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
                Pisahkan pakaian putih dan berwarna serta gunakan suhu air yang tepat untuk menjaga
                serat kain tetap awet.
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
            Versi 1.0.0 • Modul 1–4: UI, Navigasi, Async API, Database & Autentikasi
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
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
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
    minWidth: 0,
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
    flexShrink: 1,
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
    marginVertical: 14,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletBox: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletTextCol: {
    flex: 1,
    minWidth: 0,
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
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
    flex: 1,
    marginHorizontal: 8,
    lineHeight: 17,
  },
  vaultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  vaultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  vaultIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaultTitleBox: {
    flex: 1,
    minWidth: 0,
  },
  vaultTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  vaultSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  vaultStateBadge: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADIUS.full,
  },
  vaultStateBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  vaultStatusBox: {
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  vaultStatusLabel: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 17,
  },
  vaultTokenCode: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  vaultTimestampText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginTop: 6,
  },
  vaultActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  vaultSmallBtn: {
    flex: 1,
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    gap: 5,
  },
  vaultSmallBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  signOutButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.statusDanger,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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
    textAlign: 'center',
  },
  footerCopyright: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
