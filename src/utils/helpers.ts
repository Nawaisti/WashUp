// ============================================================================
// WashUp - Helper Functions (Modul 1: Function & Condition)
// Fungsi logika terstruktur untuk format uang, evaluasi status, dan kalkulasi
// ============================================================================

import { OrderStatus, HistoryTabFilter, Order } from '../types/laundry';
import { COLORS } from '../constants/theme';

/**
 * Format angka ke format mata uang Rupiah Indonesia (RpXX.XXX)
 * Contoh: 30000 -> "Rp30.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount < 0) return 'Rp0';
  const formatted = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp${formatted}`;
}

/**
 * Menghitung estimasi total harga cucian berdasarkan tarif layanan dan kuantitas
 */
export function calculateEstimatedPrice(pricePerUnit: number, amount: number): number {
  if (isNaN(amount) || amount <= 0) return 0;
  return Math.round(pricePerUnit * amount);
}

/**
 * Menentukan konfigurasi styling (warna teks, background, border, icon)
 * berdasarkan status pesanan laundry (Modul 1: Condition & Styling)
 */
export function getStatusStyle(status: OrderStatus): {
  textColor: string;
  bgColor: string;
  borderColor: string;
  label: string;
  iconName: string;
} {
  switch (status) {
    case 'Sedang Dicuci':
    case 'Diproses':
      return {
        textColor: COLORS.primaryDark,
        bgColor: COLORS.statusProcessBg,
        borderColor: COLORS.statusProcessBorder,
        label: status,
        iconName: 'sync-outline',
      };
    case 'Selesai':
      return {
        textColor: COLORS.statusSuccess,
        bgColor: COLORS.statusSuccessBg,
        borderColor: COLORS.statusSuccessBorder,
        label: 'Selesai',
        iconName: 'checkmark-circle-outline',
      };
    case 'Dibatalkan':
      return {
        textColor: COLORS.statusDanger,
        bgColor: COLORS.statusDangerBg,
        borderColor: COLORS.statusDangerBorder,
        label: 'Dibatalkan',
        iconName: 'close-circle-outline',
      };
    case 'Disetrika':
      return {
        textColor: COLORS.statusWarning,
        bgColor: COLORS.statusWarningBg,
        borderColor: COLORS.statusWarningBorder,
        label: 'Disetrika',
        iconName: 'flame-outline',
      };
    default:
      return {
        textColor: COLORS.textSecondary,
        bgColor: COLORS.surfaceSubtle,
        borderColor: COLORS.border,
        label: status,
        iconName: 'time-outline',
      };
  }
}

/**
 * Filter daftar pesanan berdasarkan tab aktif di halaman Riwayat (Modul 1: Function + Condition)
 */
export function filterOrdersByTab(orders: Order[], activeTab: HistoryTabFilter): Order[] {
  if (activeTab === 'Semua') {
    return orders;
  }
  if (activeTab === 'Diproses') {
    return orders.filter(
      (order) => order.status === 'Sedang Dicuci' || order.status === 'Diproses' || order.status === 'Disetrika'
    );
  }
  if (activeTab === 'Selesai') {
    return orders.filter((order) => order.status === 'Selesai');
  }
  if (activeTab === 'Dibatalkan') {
    return orders.filter((order) => order.status === 'Dibatalkan');
  }
  return orders;
}

/**
 * Menentukan status langkah proses (1: Diterima, 2: Dicuci, 3: Disetrika, 4: Selesai)
 */
export function evaluateStepState(
  currentOrderStep: number,
  targetStep: number
): 'done' | 'active' | 'upcoming' {
  if (currentOrderStep > targetStep) return 'done';
  if (currentOrderStep === targetStep) return 'active';
  return 'upcoming';
}
