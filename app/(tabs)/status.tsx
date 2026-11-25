// ============================================================================
// WashUp - Halaman Status Laundry (Screen 3)
// (Modul 1: JSX, View, Text, Pressable, ScrollView, Condition, Inline Styling)
// (Modul 2: useLocalSearchParams, useEffect auto-dismiss timer & cleanup)
// (Modul 4: Cloud PostgreSQL SELECT, UPDATE, DELETE, Optimistic UI & RLS Isolation)
// Progress Pelacakan: Pesanan → Dicuci → Disetrika → Selesai
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '../../src/constants/theme';
import { ORDERS_DATA } from '../../src/constants/dummyData';
import { StatusBadge } from '../../src/components/StatusBadge';
import { IconSymbol } from '../../src/components/IconSymbol';
import { formatRupiah, evaluateStepState } from '../../src/utils/helpers';
import { CustomButton } from '../../src/components/CustomButton';
import { Order } from '../../src/types/laundry';
import { useOrders } from '../../src/context/OrdersContext';

// 4 Tahap Pelacakan Pesanan Laundry (Modul 1: Array of Objects)
const TRACKING_STEPS = [
  { step: 1, title: 'Pesanan Diterima', desc: 'Cucian telah diinput ke sistem', icon: 'receipt-outline' },
  { step: 2, title: 'Sedang Dicuci', desc: 'Proses perendaman dan pencucian mesin', icon: 'water-outline' },
  { step: 3, title: 'Disetrika', desc: 'Pengeringan & setrika uap rapi', icon: 'sparkles-outline' },
  { step: 4, title: 'Selesai', desc: 'Pakaian wangi siap diambil / diantar', icon: 'checkmark-done-outline' },
];

export default function StatusScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const {
    orders,
    cloudOrders,
    dataSourceMode,
    setDataSourceMode,
    isLoadingCloud,
    isMutating,
    cloudError,
    refreshOrders,
    advanceOrderStatus,
    cancelOrDeleteOrder,
  } = useOrders();

  // State ID pesanan yang sedang dipantau
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.id ?? ORDERS_DATA[0].id
  );

  // Sinkronisasi pesanan dari parameter navigasi router (Modul 2: useLocalSearchParams & useEffect)
  useEffect(() => {
    if (orderId) {
      setSelectedOrderId(orderId);
    }
  }, [orderId]);

  // Temukan objek pesanan aktif dari daftar terbaru
  const selectedOrder: Order | null =
    orders.find((o) => o.id === selectedOrderId) ?? orders[0] ?? null;

  // Modul 2 (10%): State feedback notifikasi status saat pesanan berganti
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Modul 2 (10%): useEffect untuk menangani side-effect perubahan pesanan & timer auto-dismiss dengan cleanup
  useEffect(() => {
    if (!selectedOrder) {
      setStatusNotice('Belum ada pesanan cloud pada akun ini (Terisolasi oleh RLS).');
      return;
    }

    let message = `Memantau pesanan ${selectedOrder.id}: status ${selectedOrder.status}.`;
    if (selectedOrder.status === 'Selesai') {
      message = `Pesanan ${selectedOrder.id} telah selesai dan siap diambil di outlet!`;
    } else if (selectedOrder.status === 'Dibatalkan') {
      message = `Pesanan ${selectedOrder.id} telah dibatalkan.`;
    } else if (selectedOrder.status === 'Sedang Dicuci') {
      message = `Pesanan ${selectedOrder.id} sedang dalam proses pencucian mesin.`;
    } else if (selectedOrder.status === 'Diproses') {
      message = `Pesanan ${selectedOrder.id} telah diterima dan sedang diproses.`;
    }

    setStatusNotice(message);

    // Timer auto-dismiss notice setelah 3.5 detik (Modul 2: side effect timer)
    const timer = setTimeout(() => {
      setStatusNotice(null);
    }, 3500);

    // Cleanup: bersihkan timeout jika pesanan berganti sebelum timer selesai atau saat unmount
    return () => {
      clearTimeout(timer);
    };
  }, [selectedOrder?.id, selectedOrder?.status]);

  // Current progress step dari pesanan (1 s/d 4)
  const currentStep = selectedOrder?.progressStep ?? 2;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingCloud}
            onRefresh={refreshOrders}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header Halaman */}
        <View style={styles.screenHeader}>
          <Text style={styles.headerTitle}>Status Laundry</Text>
          <Text style={styles.headerSubtitle}>
            Lacak progres pencucian pakaian Anda secara langsung (Tarik layar untuk Refresh Cloud)
          </Text>
        </View>

        {/* ================================================================ */}
        {/* FILTER SUMBER DATA (Modul 4: Bukti Isolasi RLS vs Dummy Modul 1) */}
        {/* ================================================================ */}
        <View style={styles.sourceSwitchRow}>
          <Pressable
            onPress={() => setDataSourceMode('all')}
            style={[
              styles.sourceChip,
              {
                backgroundColor: dataSourceMode === 'all' ? COLORS.primary : COLORS.surface,
                borderColor: dataSourceMode === 'all' ? COLORS.primaryDark : COLORS.border,
              },
            ]}
          >
            <IconSymbol
              name="layers-outline"
              size={14}
              color={dataSourceMode === 'all' ? '#FFFFFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.sourceChipText,
                { color: dataSourceMode === 'all' ? '#FFFFFF' : COLORS.textSecondary },
              ]}
            >
              Semua (+5 Dummy)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setDataSourceMode('cloud')}
            style={[
              styles.sourceChip,
              {
                backgroundColor: dataSourceMode === 'cloud' ? COLORS.primary : COLORS.surface,
                borderColor: dataSourceMode === 'cloud' ? COLORS.primaryDark : COLORS.border,
              },
            ]}
          >
            <IconSymbol
              name="cloud-done-outline"
              size={14}
              color={dataSourceMode === 'cloud' ? '#FFFFFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.sourceChipText,
                { color: dataSourceMode === 'cloud' ? '#FFFFFF' : COLORS.textSecondary },
              ]}
            >
              Cloud Saya (RLS: {cloudOrders.length})
            </Text>
          </Pressable>
        </View>

        {/* Pesan Error Cloud jika terjadi kegagalan jaringan/RLS */}
        {cloudError && (
          <View style={styles.cloudErrorBanner}>
            <IconSymbol name="alert-circle-outline" size={16} color={COLORS.statusDanger} />
            <Text style={styles.cloudErrorText}>Cloud Notice: {cloudError}</Text>
          </View>
        )}

        {/* ================================================================ */}
        {/* SELECTOR PESANAN (Memudahkan pengujian saat demo praktikum)       */}
        {/* ================================================================ */}
        {orders.length > 0 ? (
          <View style={styles.selectorSection}>
            <Text style={styles.selectorLabel}>Pilih Pesanan untuk Dipantau:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalOrderList}
            >
              {orders.map((order) => {
                const isSelected = selectedOrder ? order.id === selectedOrder.id : false;
                return (
                  <Pressable
                    key={`${order.isCloud ? 'cloud' : 'local'}-${order.id}`}
                    onPress={() => setSelectedOrderId(order.id)}
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
                      {order.id} {order.isCloud ? '☁️' : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View style={[styles.emptyCloudCard, SHADOWS.card]}>
            <IconSymbol name="shield-checkmark-outline" size={32} color={COLORS.primary} />
            <Text style={styles.emptyCloudTitle}>
              0 Pesanan Cloud untuk Akun Ini (RLS Aktif)
            </Text>
            <Text style={styles.emptyCloudDesc}>
              Row Level Security (RLS) memastikan Anda hanya melihat pesanan laundry milik akun
              Anda sendiri. Buat pesanan baru di tab Pesanan atau alihkan ke mode &quot;Semua (+5
              Dummy)&quot;.
            </Text>
            <CustomButton
              title="Buat Pesanan Cloud Baru"
              onPress={() => router.push('/(tabs)/orders' as any)}
              variant="primary"
              size="small"
              icon="add-circle-outline"
            />
          </View>
        )}

        {/* Modul 2 (10%): Notifikasi Perubahan Status Pesanan via useEffect */}
        {statusNotice && (
          <View style={styles.noticeBanner}>
            <IconSymbol
              name={
                selectedOrder?.status === 'Selesai'
                  ? 'checkmark-circle'
                  : selectedOrder?.status === 'Dibatalkan'
                  ? 'alert-circle'
                  : 'information-circle'
              }
              size={18}
              color={
                selectedOrder?.status === 'Selesai'
                  ? COLORS.statusSuccess
                  : selectedOrder?.status === 'Dibatalkan'
                  ? COLORS.statusDanger
                  : COLORS.primary
              }
            />
            <Text style={styles.noticeBannerText}>{statusNotice}</Text>
            <Pressable onPress={() => setStatusNotice(null)} hitSlop={8}>
              <IconSymbol name="close" size={16} color={COLORS.textMuted} />
            </Pressable>
          </View>
        )}

        {selectedOrder && (
          <>
            {/* ================================================================ */}
            {/* KARTU RINGKASAN PESANAN                                          */}
            {/* ================================================================ */}
            <View style={[styles.mainCard, SHADOWS.card]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.orderTitleRow}>
                    <Text style={styles.orderIdText}>{selectedOrder.id}</Text>
                    {selectedOrder.isCloud && (
                      <View style={styles.cloudPill}>
                        <Text style={styles.cloudPillText}>Supabase Cloud</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.customerNameText} numberOfLines={1}>
                    Pelanggan: {selectedOrder.customerName}
                  </Text>
                </View>
                <View style={styles.statusBadgeWrapper}>
                  <StatusBadge status={selectedOrder.status} size="medium" />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.orderSpecsGrid}>
                <View style={styles.specItemService}>
                  <Text style={styles.specLabel}>Layanan</Text>
                  <Text style={styles.specValue} numberOfLines={1}>
                    {selectedOrder.service}
                  </Text>
                </View>

                <View style={styles.specVerticalDivider} />

                <View style={styles.specItemQty}>
                  <Text style={styles.specLabel}>Kuantitas</Text>
                  <Text style={styles.specValue} numberOfLines={1}>
                    {selectedOrder.amount} {selectedOrder.unit}
                  </Text>
                </View>

                <View style={styles.specVerticalDivider} />

                <View style={styles.specItemPrice}>
                  <Text style={styles.specLabel}>Total Bayar</Text>
                  <Text style={styles.specValueHighlight} numberOfLines={1}>
                    {formatRupiah(selectedOrder.price)}
                  </Text>
                </View>
              </View>

              {selectedOrder.notes && (
                <View style={styles.notesContainer}>
                  <IconSymbol
                    name="information-circle-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.notesText} numberOfLines={2}>
                    {selectedOrder.notes}
                  </Text>
                </View>
              )}

              {/* ============================================================ */}
              {/* MODUL 4: KONTROL OPERASI CLOUD (UPDATE & DELETE OPTIMISTIC)  */}
              {/* ============================================================ */}
              <View style={styles.cloudCrudRow}>
                <Pressable
                  onPress={() => advanceOrderStatus(selectedOrder)}
                  disabled={isMutating}
                  style={({ pressed }) => [
                    styles.crudBtnPrimary,
                    { opacity: isMutating ? 0.6 : pressed ? 0.85 : 1 },
                  ]}
                >
                  <IconSymbol name="sync-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.crudBtnPrimaryText}>Update</Text>
                </Pressable>

                <Pressable
                  onPress={() => cancelOrDeleteOrder(selectedOrder)}
                  disabled={isMutating}
                  style={({ pressed }) => [
                    styles.crudBtnDanger,
                    { opacity: isMutating ? 0.6 : pressed ? 0.85 : 1 },
                  ]}
                >
                  <IconSymbol
                    name="trash-outline"
                    size={16}
                    color={COLORS.statusDanger}
                  />
                  <Text style={styles.crudBtnDangerText}>Hapus</Text>
                </Pressable>
              </View>
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
                  const stepState = evaluateStepState(currentStep, stepItem.step);
                  const isLast = index === TRACKING_STEPS.length - 1;

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
                        <View
                          style={[
                            styles.stepCircle,
                            {
                              backgroundColor: iconBgColor,
                              borderColor: isActive
                                ? COLORS.primary
                                : isDone
                                ? COLORS.statusSuccess
                                : COLORS.border,
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

                        {!isLast && (
                          <View
                            style={[
                              styles.stepConnector,
                              {
                                backgroundColor: isDone
                                  ? COLORS.statusSuccess
                                  : COLORS.border,
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
                          {isDone && <Text style={styles.doneStepTime}>Selesai</Text>}
                        </View>

                        <Text style={styles.stepDesc}>{stepItem.desc}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}

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
    paddingRight: 44,
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
    lineHeight: 18,
  },
  sourceSwitchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  sourceChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: 6,
  },
  sourceChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cloudErrorBanner: {
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
  cloudErrorText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.statusDanger,
    fontWeight: '600',
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
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginRight: 8,
  },
  orderChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCloudCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
  },
  emptyCloudTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyCloudDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  noticeBannerText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 17,
  },
  mainCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardHeaderLeft: {
    flex: 1,
    minWidth: 0,
    flexWrap: 'wrap',
  },
  statusBadgeWrapper: {
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  orderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  orderIdText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  cloudPill: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  cloudPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  customerNameText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 14,
  },
  orderSpecsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  specItemService: {
    flex: 1.35,
    minWidth: 0,
    paddingRight: 4,
  },
  specItemQty: {
    flex: 0.85,
    minWidth: 0,
    paddingHorizontal: 4,
  },
  specItemPrice: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-end',
  },
  specVerticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.borderLight,
  },
  specLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  specValueHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
    flexShrink: 1,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.sm,
    padding: 12,
    marginTop: 14,
    gap: 8,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    flex: 1,
    lineHeight: 17,
  },
  cloudCrudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  crudBtnPrimary: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  crudBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  crudBtnDanger: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.statusDangerBg,
    borderWidth: 1,
    borderColor: COLORS.statusDangerBorder,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  crudBtnDangerText: {
    color: COLORS.statusDanger,
    fontSize: 13,
    fontWeight: '700',
  },
  trackingSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
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
