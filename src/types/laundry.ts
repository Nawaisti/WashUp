// ============================================================================
// WashUp - Laundry Management Mobile App
// TypeScript Type Definitions & Interfaces (Modul 1: Type / Interface)
// ============================================================================

/**
 * Status siklus pesanan laundry
 */
export type OrderStatus = 'Sedang Dicuci' | 'Selesai' | 'Dibatalkan' | 'Diproses' | 'Disetrika';

/**
 * Kategori filter untuk tab Riwayat Pesanan
 */
export type HistoryTabFilter = 'Semua' | 'Diproses' | 'Selesai' | 'Dibatalkan';

/**
 * Interface untuk data Layanan Laundry
 */
export interface Service {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  icon: string;
  popular?: boolean;
  estimatedHours?: number;
}

/**
 * Interface untuk data Pesanan Laundry (Order)
 * Memenuhi spesifikasi: id, service, date, amount, unit, price, status
 */
export interface Order {
  id: string;
  customerName?: string;
  service: string;
  date: string;
  amount: number;
  unit: string;
  price: number;
  status: OrderStatus;
  notes?: string;
  progressStep?: number; // 1: Diterima, 2: Dicuci, 3: Disetrika, 4: Selesai
  address?: string;
  paymentMethod?: string;
}

/**
 * Interface untuk item menu profil pengguna
 */
export interface ProfileMenuItemType {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  isDestructive?: boolean;
}

/**
 * Interface data profil pengguna
 */
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  membership: string;
  washPayBalance: number;
  rewardPoints: number;
}

// ----------------------------------------------------------------------------
// Component Props Interfaces
// ----------------------------------------------------------------------------

export interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  onPress?: (service: Service) => void;
}

export interface OrderCardProps {
  order: Order;
  onPress?: (order: Order) => void;
  showDetailButton?: boolean;
}

export interface ProfileMenuItemProps {
  item: ProfileMenuItemType;
  onPress?: (item: ProfileMenuItemType) => void;
}

export interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium' | 'large';
}

export interface WashUpLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  variant?: 'light' | 'dark' | 'white';
}

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}
