// ============================================================================
// WashUp - Halaman Masuk & Pendaftaran Pelanggan (Modul 4: Supabase Auth Flow)
// Mengimplementasikan:
// 1. Dual-mode Auth: Sign In (signInWithPassword) & Sign Up (signUp + metadata callsign)
// 2. Tiga Aturan Emas Form Mobile (Modul 4 Bab 3.2):
//    - .trim() pada email dan nama/callsign
//    - keyboardType="email-address", autoCapitalize="none", autoCorrect={false}
//    - Loading state (<ActivityIndicator />) & pencegahan multiple submission
// 3. Penyimpanan sesi JWT terenkripsi secara otomatis ke expo-secure-store
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SHADOWS } from '../../src/constants/theme';
import { WashUpLogo } from '../../src/components/WashUpLogo';
import { IconSymbol } from '../../src/components/IconSymbol';
import { supabase, isSupabaseConfigured, saveAuthToken } from '../../src/lib/supabase';

export default function LoginScreen() {
  // State utama formulir otentikasi (Modul 4 Codelab 3)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [callsign, setCallsign] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  // State UX: pemuatan & pesan umpan balik
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mesin utama otentikasi Supabase (Sign Up vs Sign In)
  const handleAuth = async () => {
    if (loading) return; // Cegah multiple submission

    setErrorMessage(null);
    setSuccessMessage(null);

    // Aturan Emas 1: Hilangkan spasi tak terlihat dengan .trim()
    const cleanEmail = email.trim();
    const cleanCallsign = callsign.trim();

    if (!cleanEmail || !password) {
      setErrorMessage('Silakan masukkan alamat email dan kata sandi Anda.');
      return;
    }

    if (isRegistering && !cleanCallsign) {
      setErrorMessage('Silakan masukkan Nama / Callsign Pelanggan untuk pendaftaran.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Konfigurasi Supabase belum diisi. Tambahkan EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY pada file .env lalu restart Expo.'
      );
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        // MODE DAFTAR (Sign Up) dengan metadata khusus (callsign & membership)
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              callsign: cleanCallsign,
              full_name: cleanCallsign,
              role: 'customer',
              membership: 'Gold Member',
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data?.session?.access_token) {
          await saveAuthToken(data.session.access_token);
          setSuccessMessage('Pendaftaran berhasil! Mengarahkan ke beranda WashUp...');
        } else {
          setSuccessMessage(
            'Akun berhasil didaftarkan! Silakan masuk menggunakan email dan kata sandi Anda.'
          );
          setIsRegistering(false);
        }
      } else {
        // MODE MASUK (Sign In)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          const friendlyError =
            error.message.toLowerCase().includes('invalid login credentials')
              ? 'Kredensial login tidak valid. Periksa kembali email dan kata sandi Anda.'
              : error.message;
          setErrorMessage(friendlyError);
          return;
        }

        if (data?.session?.access_token) {
          await saveAuthToken(data.session.access_token);
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan jaringan saat menghubungi server otentikasi.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsRegistering((prev) => !prev);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Branding WashUp */}
          <View style={styles.brandSection}>
            <WashUpLogo size="large" showTagline />
            <View style={styles.securityPill}>
              <IconSymbol name="shield-checkmark-outline" size={14} color={COLORS.primary} />
              <Text style={styles.securityPillText}>
                Supabase Cloud Auth • Hardware SecureStore
              </Text>
            </View>
          </View>

          {/* Peringatan jika .env belum dikonfigurasi */}
          {!isSupabaseConfigured && (
            <View style={styles.configWarningCard}>
              <IconSymbol name="warning-outline" size={20} color={COLORS.statusWarning} />
              <View style={styles.configWarningContent}>
                <Text style={styles.configWarningTitle}>File .env Belum Dikonfigurasi</Text>
                <Text style={styles.configWarningText}>
                  Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env
                  pada root proyek WashUp untuk mengaktifkan koneksi Supabase Cloud.
                </Text>
              </View>
            </View>
          )}

          {/* Kartu Formulir Login / Register */}
          <View style={[styles.authCard, SHADOWS.card]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardBadge}>
                {isRegistering ? 'PENDAFTARAN PELANGGAN BARU' : 'OTENTIKASI PELANGGAN'}
              </Text>
              <Text style={styles.cardTitle}>
                {isRegistering ? 'Buat Akun WashUp' : 'Masuk ke WashUp'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {isRegistering
                  ? 'Daftarkan akun Anda untuk memesan dan melacak laundry secara real-time di cloud.'
                  : 'Masukkan kredensial terverifikasi Anda untuk mengakses layanan laundry WashUp.'}
              </Text>
            </View>

            {/* Input Callsign / Nama Lengkap (Hanya saat Register) */}
            {isRegistering && (
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <IconSymbol name="person-outline" size={15} color={COLORS.primary} />
                  <Text style={styles.inputLabel}>Nama Lengkap / Callsign</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Contoh: Andi Pratama"
                  placeholderTextColor={COLORS.textMuted}
                  value={callsign}
                  onChangeText={setCallsign}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            )}

            {/* Input Email (Aturan Emas: keyboardType="email-address" & autoCapitalize="none") */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <IconSymbol name="mail-outline" size={15} color={COLORS.primary} />
                <Text style={styles.inputLabel}>Alamat Email</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="pelanggan@washup.id"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Input Kata Sandi */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <IconSymbol name="lock-closed-outline" size={15} color={COLORS.primary} />
                <Text style={styles.inputLabel}>Kata Sandi</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Minimal 6 karakter..."
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Pesan Error Runtime */}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <IconSymbol name="alert-circle" size={18} color={COLORS.statusDanger} />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            )}

            {/* Pesan Sukses */}
            {successMessage && (
              <View style={styles.successBanner}>
                <IconSymbol name="checkmark-circle" size={18} color={COLORS.statusSuccess} />
                <Text style={styles.successBannerText}>{successMessage}</Text>
              </View>
            )}

            {/* Tombol Submit dengan Loading State (<ActivityIndicator />) */}
            <Pressable
              onPress={handleAuth}
              disabled={loading}
              style={({ pressed }) => [
                styles.submitButton,
                SHADOWS.card,
                {
                  backgroundColor: loading ? COLORS.primaryDark : COLORS.primary,
                  opacity: loading ? 0.85 : pressed ? 0.9 : 1,
                },
              ]}
            >
              {loading ? (
                <View style={styles.buttonContentRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>
                    {isRegistering ? 'Mendaftarkan Akun...' : 'Memverifikasi Sesi...'}
                  </Text>
                </View>
              ) : (
                <View style={styles.buttonContentRow}>
                  <IconSymbol
                    name={isRegistering ? 'person-add-outline' : 'log-in-outline'}
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={styles.submitButtonText}>
                    {isRegistering ? 'Daftar Pelanggan Baru' : 'Masuk & Buka WashUp'}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Tombol Beralih Mode Login <-> Register */}
            <Pressable
              onPress={toggleAuthMode}
              disabled={loading}
              style={({ pressed }) => [
                styles.switchModeButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.switchModeText}>
                {isRegistering
                  ? 'Sudah memiliki akun WashUp? '
                  : 'Belum punya akun pelanggan? '}
                <Text style={styles.switchModeHighlight}>
                  {isRegistering ? 'Masuk di sini' : 'Daftar di sini'}
                </Text>
              </Text>
            </Pressable>
          </View>

          {/* Info Keamanan Sesi JWT & RLS */}
          <View style={styles.footerInfoCard}>
            <IconSymbol name="key-outline" size={18} color={COLORS.primaryDark} />
            <Text style={styles.footerInfoText}>
              Token sesi JWT Anda disimpan secara terenkripsi di perangkat keras menggunakan{' '}
              <Text style={styles.boldText}>expo-secure-store</Text> dan data pesanan dilindungi
              oleh <Text style={styles.boldText}>Row Level Security (RLS)</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  securityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    marginTop: 12,
    gap: 6,
  },
  securityPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  configWarningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.statusWarningBg,
    borderWidth: 1,
    borderColor: COLORS.statusWarningBorder,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  configWarningContent: {
    flex: 1,
  },
  configWarningTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 2,
  },
  configWarningText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  authCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 18,
  },
  cardBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.statusDangerBg,
    borderWidth: 1,
    borderColor: COLORS.statusDangerBorder,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.statusDanger,
    lineHeight: 17,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.statusSuccessBg,
    borderWidth: 1,
    borderColor: COLORS.statusSuccessBorder,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.statusSuccess,
    lineHeight: 17,
  },
  submitButton: {
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  switchModeButton: {
    marginTop: 16,
    paddingVertical: 6,
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  switchModeHighlight: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  footerInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    gap: 10,
  },
  footerInfoText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
