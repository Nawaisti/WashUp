// ============================================================================
// WashUp - Halaman Riwayat Pesanan (Screen 4 - Focus Detail Tinggi)
// (Modul 1: Array of Objects, TypeScript Interface Order, .map(), Reusable OrderCard,
//  Filter Tabs, Function, Condition, Inline Styling, Modal Detail, Pressable, ScrollView)
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, RADIUS } from '../../src/constants/theme';
import { ORDERS_DATA } from '../../src/constants/dummyData';
import { OrderCard } from '../../src/components/OrderCard';
import { StatusBadge } from '../../src/components/StatusBadge';
import { IconSymbol } from '../../src/components/IconSymbol';
import { CustomButton } from '../../src/components/CustomButton';
import { formatRupiah, filterOrdersByTab } from '../../src/utils/helpers';
import { Order, HistoryTabFilter } from '../../src/types/laundry';

// Daftar opsi tab filter (Modul 1: Array of Strings)
const FILTER_TABS: HistoryTabFilter[] = ['Semua', 'Diproses', 'Selesai', 'Dibatalkan'];

export default function HistoryScreen() {
  // State Tab Filter Aktif (Modul 1: State & TypeScript Type)
  const [activeTab, setActiveTab] = useState<HistoryTabFilter>('Semua');

  // State Pencarian Teks
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State Modal Detail Pesanan
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);

  // 1. Eksekusi filter berdasarkan tab aktif (Modul 1: Custom Function + Condition)
  const tabFilteredOrders = filterOrdersByTab(ORDERS_DATA, activeTab);

  // 2. Eksekusi pencarian teks (ID atau Layanan)
  const finalFilteredOrders = tabFilteredOrders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.service.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  });

  // Statistik Ringkasan Pesanan (Modul 1: Function / Array Methods)
  const totalCount = ORDERS_DATA.length;
  const completedCount = ORDERS_DATA.filter((o) => o.status === 'Selesai').length;
  const inProcessCount = ORDERS_DATA.filter((o) => o.status === 'Sedang Dicuci' || o.status === 'Diproses').length;
  const cancelledCount = ORDERS_DATA.filter((o) => o.status === 'Dibatalkan').length;

  // Handler saat kartu pesanan diklik
  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================================================================ */}
        {/* HEADER SECTION: Judul & Subtitle                                 */}
        {/* ================================================================ */}
        <View style={styles.screenHeader}>
          <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
          <Text style={styles.headerSubtitle}>
            Daftar lengkap seluruh transaksi dan pesanan cucian Anda
          </Text>
        </View>

        {/* ================================================================ */}
        {/* STATISTIK RINGKASAN: Card Rekapitulasi                           */}
        {/* ================================================================ */}
        <View style={[styles.statsCard, SHADOWS.card]}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalCount}</Text>
            <Text style={styles.statLabel}>Semua</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: COLORS.primaryDark }]}>{inProcessCount}</Text>
            <Text style={styles.statLabel}>Diproses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: COLORS.statusSuccess }]}>{completedCount}</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: COLORS.statusDanger }]}>{cancelledCount}</Text>
            <Text style={styles.statLabel}>Batal</Text>
          </View>
        </View>

        {/* ================================================================ */}
        {/* SEARCH BAR (TextInput)                                           */}
        {/* ================================================================ */}
        <View style={styles.searchContainer}>
          <IconSymbol name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari ID pesanan atau jenis layanan..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <IconSymbol name="close-circle" size={16} color={COLORS.textMuted} />
            </Pressable>
          )}
        </View>

        {/* ================================================================ */}
        {/* FILTER TABS: Semua | Diproses | Selesai | Dibatalkan             */}
        {/* (Modul 1: Loop .map(), Condition, Active Tab Inline Styling)     */}
        {/* ================================================================ */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={({ pressed }) => [
                    styles.tabButton,
                    // INLINE STYLING WAJIB: Active tab menggunakan warna primary WashUp
                    {
                      backgroundColor: isActive ? COLORS.primary : COLORS.surface,
                      borderColor: isActive ? COLORS.primaryDark : COLORS.border,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      // INLINE STYLING: Warna teks tab aktif
                      {
                        color: isActive ? '#FFFFFF' : COLORS.textSecondary,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ================================================================ */}
        {/* DAFTAR PESANAN MENGGUNAKAN .map() & Reusable OrderCard           */}
        {/* (Modul 1: Array of Objects, TypeScript props, .map())             */}
        {/* ================================================================ */}
        <View style={styles.ordersListContainer}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listSectionTitle}>
              Menampilkan {finalFilteredOrders.length} Pesanan
            </Text>
            {activeTab !== 'Semua' && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterTagText}>Filter: {activeTab}</Text>
              </View>
            )}
          </View>

          {finalFilteredOrders.length > 0 ? (
            finalFilteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={handleOrderPress}
              />
            ))
          ) : (
            // Empty State jika filter tidak menemukan data
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <IconSymbol name="file-tray-outline" size={36} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Tidak Ada Pesanan</Text>
              <Text style={styles.emptyDesc}>
                Tidak ada pesanan laundry dengan status "{activeTab}".
              </Text>
              <Pressable
                onPress={() => {
                  setActiveTab('Semua');
                  setSearchQuery('');
                }}
                style={styles.resetFilterBtn}
              >
                <Text style={styles.resetFilterText}>Tampilkan Semua Pesanan</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ================================================================== */}
      {/* MODAL DETAIL PESANAN (Tampilan Rinci Nota Laundry)                  */}
      {/* ================================================================== */}
      {selectedOrder && (
        <Modal
          visible={isDetailModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDetailModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, SHADOWS.card]}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalIdText}>{selectedOrder.id}</Text>
                  <Text style={styles.modalDateText}>Tanggal: {selectedOrder.date}</Text>
                </View>
                <Pressable
                  onPress={() => setIsDetailModalVisible(false)}
                  style={styles.modalCloseBtn}
                >
                  <IconSymbol name="close" size={20} color={COLORS.textSecondary} />
                </Pressable>
              </View>

              <View style={styles.modalDivider} />

              {/* Status Badge */}
              <View style={styles.modalStatusRow}>
                <Text style={styles.modalSectionLabel}>Status Pesanan:</Text>
                <StatusBadge status={selectedOrder.status} size="medium" />
              </View>

              {/* Rincian Pesanan */}
              <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Pelanggan</Text>
                  <Text style={styles.receiptValue}>{selectedOrder.customerName || 'Andi Pratama'}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Layanan</Text>
                  <Text style={styles.receiptValue}>{selectedOrder.service}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Kuantitas</Text>
                  <Text style={styles.receiptValue}>{selectedOrder.amount} {selectedOrder.unit}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Metode Bayar</Text>
                  <Text style={styles.receiptValue}>{selectedOrder.paymentMethod || 'WashPay'}</Text>
                </View>

                {selectedOrder.notes && (
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Catatan</Text>
                    <Text style={[styles.receiptValue, { flex: 1, textAlign: 'right' }]}>
                      {selectedOrder.notes}
                    </Text>
                  </View>
                )}

                <View style={styles.receiptDivider} />

                <View style={styles.receiptTotalRow}>
                  <Text style={styles.receiptTotalLabel}>Total Pembayaran</Text>
                  <Text style={styles.receiptTotalValue}>
                    {formatRupiah(selectedOrder.price)}
                  </Text>
                </View>
              </View>

              {/* Tombol Tutup */}
              <CustomButton
                title="Tutup Rincian"
                onPress={() => setIsDetailModalVisible(false)}
                variant="primary"
                size="medium"
              />
            </View>
          </View>
        </Modal>
      )}
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
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.borderLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsScrollContent: {
    gap: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
  tabText: {
    fontSize: 13,
  },
  ordersListContainer: {
    marginTop: 4,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  activeFilterTag: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  activeFilterTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  emptyContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetFilterBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 22,
    width: '100%',
    maxWidth: 420,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalIdText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  modalDateText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 14,
  },
  modalStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  receiptBox: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 18,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  receiptValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  receiptTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
});
