// ============================================================================
// WashUp - Halaman Status Laundry (Screen 3)
// (Modul 1: JSX, View, Text, Pressable, ScrollView, Condition, Inline Styling)
// Progress Pelacakan: Pesanan → Dicuci → Disetrika → Selesai
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '../../src/constants/theme';
import { ORDERS_DATA } from '../../src/constants/dummyData';
import { StatusBadge } from '../../src/components/StatusBadge';
import { IconSymbol } from '../../src/components/IconSymbol';
import { formatRupiah, evaluateStepState } from '../../src/utils/helpers';
import { CustomButton } from '../../src/components/CustomButton';
import { Order } from '../../src/types/laundry';

// 4 Tahap Pelacakan Pesanan Laundry (Modul 1: Array of Objects)
const TRACKING_STEPS = [
  { step: 1, title: 'Pesanan Diterima', desc: 'Cucian telah diinput ke sistem', icon: 'receipt-outline' },
  { step: 2, title: 'Sedang Dicuci', desc: 'Proses perendaman dan pencucian mesin', icon: 'water-outline' },
  { step: 3, title: 'Disetrika', desc: 'Pengeringan & setrika uap rapi', icon: 'sparkles-outline' },
  { step: 4, title: 'Selesai', desc: 'Pakaian wangi siap diambil / diantar', icon: 'checkmark-done-outline' },
];

export default function StatusScreen() {
  const router = useRouter();

  // State pesanan aktif yang sedang dipantau (default: #WU0067)
  const [selectedOrder, setSelectedOrder] = useState<Order>(ORDERS_DATA[0]);

  // Current progress step dari pesanan (1 s/d 4)
  const currentStep = selectedOrder.progressStep ?? 2;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Halaman */}
        <View style={styles.screenHeader}>
          <Text style={styles.headerTitle}>Status Laundry</Text>
          <Text style={styles.headerSubtitle}>
            Lacak progres pencucian pakaian Anda secara langsung
          </Text>
        </View>

        {/* ================================================================ */}
        {/* SELECTOR PESANAN (Memudahkan pengujian saat demo praktikum)       */}
        {/* ================================================================ */}
        <View style={styles.selectorSection}>
          <Text style={styles.selectorLabel}>Pilih Pesanan untuk Dipantau:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalOrderList}>
            {ORDERS_DATA.map((order) => {
              const isSelected = order.id === selectedOrder.id;
              return (
                <Pressable
                  key={order.id}
                  onPress={() => setSelectedOrder(order)}
                  style={[
                    styles.orderChip,
                    // INLINE STYLING: Highlight chip pesanan aktif
                    {
                      backgroundColor: isSelected ? COLORS.primary : COLORS.surface,
                      borderColor: isSelected ? COLORS.primaryDark : COLORS.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.orderChipText,
                      { color: isSelected ? '#FFFFFF' : COLORS.textPrimary },
                    ]}
                  >
                    {order.id}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ================================================================ */}
        {/* KARTU RINGKASAN PESANAN (#WU0067)                                */}
        {/* ================================================================ */}
        <View style={[styles.mainCard, SHADOWS.card]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.orderIdText}>{selectedOrder.id}</Text>
              <Text style={styles.customerNameText}>Pelanggan: {selectedOrder.customerName}</Text>
            </View>
            <StatusBadge status={selectedOrder.status} size="large" />
          </View>

          <View style={styles.divider} />

          <View style={styles.orderSpecsGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Layanan</Text>
              <Text style={styles.specValue}>{selectedOrder.service}</Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Kuantitas</Text>
              <Text style={styles.specValue}>
                {selectedOrder.amount} {selectedOrder.unit}
              </Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Total Bayar</Text>
              <Text style={styles.specValueHighlight}>
                {formatRupiah(selectedOrder.price)}
              </Text>
            </View>
          </View>

          {selectedOrder.notes && (
            <View style={styles.notesContainer}>
              <IconSymbol name="information-circle-outline" size={16} color={COLORS.primary} />
              <Text style={styles.notesText}>{selectedOrder.notes}</Text>
            </View>
          )}
        </View>

        {/* ================================================================ */}
        {/* PROGRESS STEPPER: Pesanan → Dicuci → Disetrika → Selesai         */}
        {/* (Modul 1: Condition, Loop .map, Reusable Step, Inline Styling)   */}
        {/* ================================================================ */}
        <View style={[styles.trackingSection, SHADOWS.card]}>
          <Text style={styles.sectionTitle}>Pelacakan Proses</Text>
          <Text style={styles.sectionSubtitle}>Tahapan pengerjaan cucian</Text>

          <View style={styles.stepperContainer}>
            {TRACKING_STEPS.map((stepItem, index) => {
              // Evaluasi status langkah: done, active, atau upcoming (Modul 1: Condition)
              const stepState = evaluateStepState(currentStep, stepItem.step);
              const isLast = index === TRACKING_STEPS.length - 1;

              // Penentuan warna berdasarkan condition
              const isDone = stepState === 'done';
              const isActive = stepState === 'active';

              let iconBgColor = COLORS.surfaceSubtle;
              let iconColor = COLORS.textMuted;
              let titleColor = COLORS.textSecondary;

              if (isDone) {
                iconBgColor = COLORS.statusSuccessBg;
                iconColor = COLORS.statusSuccess;
                titleColor = COLORS.textPrimary;
              } else if (isActive) {
                iconBgColor = COLORS.primaryLight;
                iconColor = COLORS.primary;
                titleColor = COLORS.primaryDark;
              }

              return (
                <View key={stepItem.step} style={styles.stepRow}>
                  {/* Kolom Indikator & Garis Penghubung */}
                  <View style={styles.indicatorColumn}>
                    {/* Lingkaran Step dengan INLINE STYLING */}
                    <View
                      style={[
                        styles.stepCircle,
                        {
                          backgroundColor: iconBgColor,
                          borderColor: isActive ? COLORS.primary : isDone ? COLORS.statusSuccess : COLORS.border,
                          borderWidth: isActive ? 2 : 1,
                        },
                      ]}
                    >
                      <IconSymbol
                        name={isDone ? 'checkmark' : stepItem.icon}
                        size={16}
                        color={iconColor}
                      />
                    </View>

                    {/* Garis penghubung antar step */}
                    {!isLast && (
                      <View
                        style={[
                          styles.stepConnector,
                          // INLINE STYLING: Warna garis berubah jika step sudah selesai
                          {
                            backgroundColor: isDone ? COLORS.statusSuccess : COLORS.border,
                          },
                        ]}
                      />
                    )}
                  </View>

                  {/* Kolom Informasi Step */}
                  <View style={styles.stepContentColumn}>
                    <View style={styles.stepTitleRow}>
                      <Text
                        style={[
                          styles.stepTitle,
                          // INLINE STYLING: Bold & warna teks aktif
                          {
                            color: titleColor,
                            fontWeight: isActive || isDone ? '700' : '500',
                          },
                        ]}
                      >
                        {stepItem.title}
                      </Text>

                      {isActive && (
                        <View style={styles.activeStepTag}>
                          <Text style={styles.activeStepTagText}>Sedang Berjalan</Text>
                        </View>
                      )}
                      {isDone && (
                        <Text style={styles.doneStepTime}>Selesai</Text>
                      )}
                    </View>

                    <Text style={styles.stepDesc}>{stepItem.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ================================================================ */}
        {/* INFO OUTLET & ESTIMASI SELESAI                                   */}
        {/* ================================================================ */}
        <View style={styles.outletCard}>
          <View style={styles.outletIconBox}>
            <IconSymbol name="storefront-outline" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.outletInfo}>
            <Text style={styles.outletName}>WashUp Outlet Sukolilo Central</Text>
            <Text style={styles.outletAddress}>Jl. Gebang Wetan No. 45, Sukolilo</Text>
            <Text style={styles.outletEstimate}>
              Estimasi Pengambilan: <Text style={styles.boldText}>Hari ini, 18:00 WIB</Text>
            </Text>
          </View>
        </View>

        {/* ================================================================ */}
        {/* TOMBOL AKSI                                                      */}
        {/* ================================================================ */}
        <View style={styles.actionButtonGroup}>
          <CustomButton
            title="Lihat Riwayat Pesanan"
            onPress={() => router.push('/(tabs)/history' as any)}
            variant="secondary"
            icon="time"
          />
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
    marginTop: 10,
    marginBottom: 16,
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
  selectorSection: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  horizontalOrderList: {
    flexDirection: 'row',
  },
  orderChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginRight: 8,
  },
  orderChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  mainCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  customerNameText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 14,
  },
  orderSpecsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 3,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  specValueHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.sm,
    padding: 10,
    marginTop: 14,
    gap: 8,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    flex: 1,
  },
  trackingSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 18,
  },
  stepperContainer: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 64,
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 32,
    marginRight: 14,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepConnector: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  stepContentColumn: {
    flex: 1,
    paddingBottom: 16,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  stepTitle: {
    fontSize: 14,
  },
  activeStepTag: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  activeStepTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  doneStepTime: {
    fontSize: 11,
    color: COLORS.statusSuccess,
    fontWeight: '600',
  },
  stepDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  outletCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    marginBottom: 20,
  },
  outletIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  outletInfo: {
    flex: 1,
  },
  outletName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  outletAddress: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  outletEstimate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  actionButtonGroup: {
    marginBottom: 20,
  },
});
