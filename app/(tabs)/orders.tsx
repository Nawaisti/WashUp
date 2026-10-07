// ============================================================================
// WashUp - Halaman Buat Pesanan / Layanan (Screen 2)
// (Modul 1: TextInput, Pressable, useState, Function Estimasi, Condition, Inline Styling)
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '../../src/constants/theme';
import { SERVICES_DATA } from '../../src/constants/dummyData';
import { Service } from '../../src/types/laundry';
import { formatRupiah, calculateEstimatedPrice } from '../../src/utils/helpers';
import { IconSymbol } from '../../src/components/IconSymbol';
import { CustomButton } from '../../src/components/CustomButton';

export default function CreateOrderScreen() {
  const router = useRouter();

  // State Form Input (Modul 1: Variables & Local State)
  const [customerName, setCustomerName] = useState<string>('Andi Pratama');
  const [selectedService, setSelectedService] = useState<Service>(SERVICES_DATA[1]); // Default: Cuci + Setrika
  const [weight, setWeight] = useState<string>('3');
  const [notes, setNotes] = useState<string>('');
  const [pickupOption, setPickupOption] = useState<'antar' | 'jemput'>('antar');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState<boolean>(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string>('');

  // Perhitungan Estimasi Harga secara Dinamis (Modul 1: Custom Function)
  const numericWeight = parseFloat(weight.replace(',', '.')) || 0;
  const estimatedPrice = calculateEstimatedPrice(selectedService.price, numericWeight);

  // Handler saat form disubmit (Modul 1: Function + Condition)
  const handleSubmitOrder = () => {
    // Validasi form
    if (!customerName.trim()) {
      Alert.alert('Perhatian', 'Silakan masukkan nama pelanggan.');
      return;
    }
    if (numericWeight <= 0) {
      Alert.alert('Perhatian', 'Silakan masukkan berat atau jumlah laundry yang valid.');
      return;
    }

    // Generate Order ID baru
    const newOrderId = `#WU00${Math.floor(100 + Math.random() * 900)}`;
    setSubmittedOrderId(newOrderId);
    setIsSuccessModalVisible(true);
  };

  const handleResetForm = () => {
    setIsSuccessModalVisible(false);
    setWeight('3');
    setNotes('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Halaman */}
          <View style={styles.screenHeader}>
            <Text style={styles.headerTitle}>Buat Pesanan</Text>
            <Text style={styles.headerSubtitle}>
              Isi formulir untuk memesan layanan laundry WashUp
            </Text>
          </View>

          {/* Modal / Banner Konfirmasi Sukses jika Pesanan Terbuat */}
          {isSuccessModalVisible && (
            <View style={[styles.successBanner, SHADOWS.card]}>
              <View style={styles.successIconWrapper}>
                <IconSymbol name="checkmark-circle" size={28} color={COLORS.statusSuccess} />
              </View>
              <View style={styles.successTextContainer}>
                <Text style={styles.successTitle}>Pesanan Berhasil Dibuat!</Text>
                <Text style={styles.successDesc}>
                  ID Pesanan: <Text style={styles.boldOrderId}>{submittedOrderId}</Text>
                </Text>
                <Text style={styles.successDetailText}>
                  Layanan {selectedService.name} ({numericWeight} {selectedService.unit}) • {formatRupiah(estimatedPrice)}
                </Text>
              </View>

              <View style={styles.successActionRow}>
                <Pressable
                  onPress={() => {
                    setIsSuccessModalVisible(false);
                    router.push('/(tabs)/status' as any);
                  }}
                  style={[styles.successActionBtn, { backgroundColor: COLORS.primary }]}
                >
                  <Text style={styles.successActionBtnText}>Cek Status</Text>
                </Pressable>
                <Pressable
                  onPress={handleResetForm}
                  style={[styles.successActionBtn, { backgroundColor: COLORS.surfaceSubtle }]}
                >
                  <Text style={[styles.successActionBtnText, { color: COLORS.textPrimary }]}>
                    Pesan Lagi
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* ============================================================== */}
          {/* FORM SECTION 1: NAMA PELANGGAN (TextInput)                     */}
          {/* ============================================================== */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <IconSymbol name="person-outline" size={16} color={COLORS.primary} />
              <Text style={styles.inputLabel}>Nama Pelanggan</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={COLORS.textMuted}
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>

          {/* ============================================================== */}
          {/* FORM SECTION 2: JENIS LAYANAN (Array of Objects + .map)        */}
          {/* ============================================================== */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <IconSymbol name="pricetags-outline" size={16} color={COLORS.primary} />
              <Text style={styles.inputLabel}>Jenis Layanan</Text>
            </View>
            <Text style={styles.helperText}>Pilih salah satu paket laundry</Text>

            <View style={styles.servicesChipContainer}>
              {SERVICES_DATA.map((srv) => {
                const isSelected = selectedService.id === srv.id;
                return (
                  <Pressable
                    key={srv.id}
                    onPress={() => setSelectedService(srv)}
                    style={({ pressed }) => [
                      styles.serviceOptionCard,
                      // INLINE STYLING: Border dan Background berubah berdasarkan status terpilih
                      {
                        borderColor: isSelected ? COLORS.primary : COLORS.border,
                        backgroundColor: isSelected ? COLORS.primarySoft : COLORS.surface,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <View style={styles.serviceOptionHeader}>
                      <View
                        style={[
                          styles.serviceOptionIcon,
                          {
                            backgroundColor: isSelected ? COLORS.primary : COLORS.primaryLight,
                          },
                        ]}
                      >
                        <IconSymbol
                          name={srv.icon}
                          size={18}
                          color={isSelected ? '#FFFFFF' : COLORS.primary}
                        />
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          {
                            borderColor: isSelected ? COLORS.primary : COLORS.textMuted,
                          },
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </View>

                    <Text style={styles.serviceOptionName}>{srv.name}</Text>
                    <Text style={styles.serviceOptionPrice}>
                      {formatRupiah(srv.price)} / {srv.unit}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ============================================================== */}
          {/* FORM SECTION 3: BERAT LAUNDRY (TextInput)                      */}
          {/* ============================================================== */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <IconSymbol name="scale-outline" size={16} color={COLORS.primary} />
              <Text style={styles.inputLabel}>Berat Laundry</Text>
            </View>
            <View style={styles.inputWithUnitContainer}>
              <TextInput
                style={styles.unitTextInput}
                placeholder="Masukkan berat dalam kg"
                placeholderTextColor={COLORS.textMuted}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <View style={styles.unitBadge}>
                <Text style={styles.unitBadgeText}>{selectedService.unit}</Text>
              </View>
            </View>
            <Text style={styles.helperText}>
              Perkiraan: 1 kg biasanya setara dengan 4–5 potong pakaian harian
            </Text>
          </View>

          {/* ============================================================== */}
          {/* FORM SECTION 4: METODE PENGANTARAN (Pressable Tabs)           */}
          {/* ============================================================== */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <IconSymbol name="bicycle-outline" size={16} color={COLORS.primary} />
              <Text style={styles.inputLabel}>Opsi Penjemputan</Text>
            </View>

            <View style={styles.optionRow}>
              <Pressable
                onPress={() => setPickupOption('antar')}
                style={[
                  styles.optionButton,
                  // INLINE STYLING: Active state
                  {
                    backgroundColor: pickupOption === 'antar' ? COLORS.primary : COLORS.surface,
                    borderColor: pickupOption === 'antar' ? COLORS.primary : COLORS.border,
                  },
                ]}
              >
                <IconSymbol
                  name="bicycle"
                  size={16}
                  color={pickupOption === 'antar' ? '#FFFFFF' : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.optionButtonText,
                    { color: pickupOption === 'antar' ? '#FFFFFF' : COLORS.textSecondary },
                  ]}
                >
                  Kurir Antar-Jemput
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setPickupOption('jemput')}
                style={[
                  styles.optionButton,
                  // INLINE STYLING: Active state
                  {
                    backgroundColor: pickupOption === 'jemput' ? COLORS.primary : COLORS.surface,
                    borderColor: pickupOption === 'jemput' ? COLORS.primary : COLORS.border,
                  },
                ]}
              >
                <IconSymbol
                  name="walk"
                  size={16}
                  color={pickupOption === 'jemput' ? '#FFFFFF' : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.optionButtonText,
                    { color: pickupOption === 'jemput' ? '#FFFFFF' : COLORS.textSecondary },
                  ]}
                >
                  Antar Mandiri ke Outlet
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ============================================================== */}
          {/* FORM SECTION 5: CATATAN (TextInput)                            */}
          {/* ============================================================== */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <IconSymbol name="document-text-outline" size={16} color={COLORS.primary} />
              <Text style={styles.inputLabel}>Catatan</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Contoh: pakaian bayi, warna khusus, dll."
              placeholderTextColor={COLORS.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* ============================================================== */}
          {/* ESTIMASI HARGA & RINGKASAN                                      */}
          {/* ============================================================== */}
          <View style={[styles.estimateCard, SHADOWS.card]}>
            <View style={styles.estimateHeader}>
              <Text style={styles.estimateHeaderTitle}>Ringkasan Biaya</Text>
              <Text style={styles.estimateHeaderSub}>Estimasi Total</Text>
            </View>

            <View style={styles.estimateDetailRow}>
              <Text style={styles.estimateDetailLabel}>
                {selectedService.name} ({numericWeight} {selectedService.unit})
              </Text>
              <Text style={styles.estimateDetailValue}>
                {formatRupiah(estimatedPrice)}
              </Text>
            </View>

            <View style={styles.estimateDetailRow}>
              <Text style={styles.estimateDetailLabel}>Biaya Antar-Jemput</Text>
              <Text style={[styles.estimateDetailValue, { color: COLORS.statusSuccess }]}>
                {pickupOption === 'antar' ? 'Gratis (Promo)' : 'Rp0'}
              </Text>
            </View>

            <View style={styles.estimateDivider} />

            <View style={styles.totalPriceRow}>
              <View>
                <Text style={styles.totalLabel}>Estimasi Harga</Text>
                <Text style={styles.totalDisclaimer}>*Dihitung otomatis per unit</Text>
              </View>
              {/* Output fungsi formatRupiah */}
              <Text style={styles.totalValue}>{formatRupiah(estimatedPrice)}</Text>
            </View>
          </View>

          {/* ============================================================== */}
          {/* TOMBOL PESAN SEKARANG                                          */}
          {/* ============================================================== */}
          <View style={styles.submitSection}>
            <CustomButton
              title="Pesan Sekarang"
              onPress={handleSubmitOrder}
              variant="primary"
              size="large"
              icon="send"
            />
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
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  screenHeader: {
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  successBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.statusSuccess,
    borderWidth: 1,
    borderColor: COLORS.statusSuccessBorder,
  },
  successIconWrapper: {
    marginBottom: 8,
  },
  successTextContainer: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.statusSuccess,
    marginBottom: 4,
  },
  successDesc: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  boldOrderId: {
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  successDetailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  successActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  successActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  multilineInput: {
    minHeight: 70,
    paddingTop: 12,
  },
  servicesChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  serviceOptionCard: {
    width: '48%',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: 12,
  },
  serviceOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.primary,
  },
  serviceOptionName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  serviceOptionPrice: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  inputWithUnitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  unitTextInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  unitBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 6,
  },
  optionButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  estimateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  estimateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  estimateHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  estimateHeaderSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  estimateDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  estimateDetailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  estimateDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  estimateDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalDisclaimer: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  submitSection: {
    marginBottom: 20,
  },
});
