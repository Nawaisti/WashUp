// ============================================================================
// WashUp - Dummy Data (Array of Objects - Modul 1)
// Data terstruktur untuk Services, Orders, Profile Menus, dan User
// ============================================================================

import { Service, Order, ProfileMenuItemType, UserProfile } from '../types/laundry';

/**
 * Array of Objects: Daftar Layanan Laundry WashUp
 * Digunakan pada halaman Home & Buat Pesanan melalui .map()
 */
export const SERVICES_DATA: Service[] = [
  {
    id: 'srv-1',
    name: 'Cuci Kering',
    price: 7000,
    unit: 'kg',
    description: 'Pencucian bersih higienis dengan proses pengeringan optimal.',
    icon: 'water-outline',
    popular: false,
    estimatedHours: 24,
  },
  {
    id: 'srv-2',
    name: 'Cuci + Setrika',
    price: 10000,
    unit: 'kg',
    description: 'Paket favorit lengkap: pakaian bersih, wangi segar, dan rapi siap pakai.',
    icon: 'shirt-outline',
    popular: true,
    estimatedHours: 36,
  },
  {
    id: 'srv-3',
    name: 'Setrika Saja',
    price: 5000,
    unit: 'kg',
    description: 'Pakaian disetrika licin rapi dengan pelicin dan pewangi pakaian premium.',
    icon: 'sparkles-outline',
    popular: false,
    estimatedHours: 12,
  },
  {
    id: 'srv-4',
    name: 'Laundry Sepatu',
    price: 20000,
    unit: 'pasang',
    description: 'Perawatan deep-clean khusus sneakers, kanvas, leather, & formal.',
    icon: 'footsteps-outline',
    popular: false,
    estimatedHours: 48,
  },
];

/**
 * Array of Objects: Riwayat Pesanan Laundry
 * Memenuhi spesifikasi Order 1 s/d Order 5 secara persis
 */
export const ORDERS_DATA: Order[] = [
  {
    id: '#WU0067',
    customerName: 'Andi Pratama',
    service: 'Cuci + Setrika',
    date: '6 Okt 2026',
    amount: 3,
    unit: 'kg',
    price: 30000,
    status: 'Sedang Dicuci',
    notes: 'Kemeja kerja putih & kaos katun, pisahkan pakaian berwarna',
    progressStep: 2, // 1: Diterima -> 2: Dicuci -> 3: Disetrika -> 4: Selesai
    address: 'Jl. Melati No. 12, Sukolilo, Surabaya',
    paymentMethod: 'WashPay',
  },
  {
    id: '#WU0066',
    customerName: 'Andi Pratama',
    service: 'Laundry Sepatu',
    date: '3 Okt 2026',
    amount: 1,
    unit: 'pasang',
    price: 20000,
    status: 'Selesai',
    notes: 'Sneakers putih canvas, hilangkan noda lumpur di midsole',
    progressStep: 4,
    address: 'Jl. Melati No. 12, Sukolilo, Surabaya',
    paymentMethod: 'Transfer Bank (BCA)',
  },
  {
    id: '#WU0065',
    customerName: 'Andi Pratama',
    service: 'Setrika Saja',
    date: '1 Okt 2026',
    amount: 2,
    unit: 'kg',
    price: 10000,
    status: 'Selesai',
    notes: 'Kemeja batik dinas, gunakan gantungan baju pribadi',
    progressStep: 4,
    address: 'Jl. Melati No. 12, Sukolilo, Surabaya',
    paymentMethod: 'Tunai saat Antar',
  },
  {
    id: '#WU0064',
    customerName: 'Andi Pratama',
    service: 'Cuci Kering',
    date: '28 Sep 2026',
    amount: 5,
    unit: 'kg',
    price: 35000,
    status: 'Dibatalkan',
    notes: 'Dibatalkan atas permintaan pelanggan sebelum kurir pick-up',
    progressStep: 1,
    address: 'Jl. Melati No. 12, Sukolilo, Surabaya',
    paymentMethod: 'WashPay (Refunded)',
  },
  {
    id: '#WU0063',
    customerName: 'Andi Pratama',
    service: 'Cuci + Setrika',
    date: '25 Sep 2026',
    amount: 4,
    unit: 'kg',
    price: 40000,
    status: 'Selesai',
    notes: 'Pakaian harian keluarga, wangi Lavender Floral',
    progressStep: 4,
    address: 'Jl. Melati No. 12, Sukolilo, Surabaya',
    paymentMethod: 'WashPay',
  },
];

/**
 * Array of Objects: Menu Pengaturan Halaman Profile
 * Memenuhi 7 menu yang diwajibkan spesifikasi
 */
export const PROFILE_MENU_DATA: ProfileMenuItemType[] = [
  {
    id: 'menu-1',
    title: 'Data Diri',
    subtitle: 'Nama, nomor telepon, dan email terdaftar',
    icon: 'person-outline',
  },
  {
    id: 'menu-2',
    title: 'Alamat',
    subtitle: 'Atur alamat penjemputan dan pengantaran',
    icon: 'location-outline',
    badge: 'Utama',
  },
  {
    id: 'menu-3',
    title: 'Notifikasi',
    subtitle: 'Pemberitahuan status cucian dan promo',
    icon: 'notifications-outline',
    badge: '3 Baru',
    badgeColor: '#EF4444',
  },
  {
    id: 'menu-4',
    title: 'Riwayat Pesanan',
    subtitle: 'Daftar semua transaksi cucian sebelumnya',
    icon: 'time-outline',
  },
  {
    id: 'menu-5',
    title: 'Metode Pembayaran',
    subtitle: 'WashPay, Transfer Bank, & Tunai',
    icon: 'card-outline',
  },
  {
    id: 'menu-6',
    title: 'Bantuan',
    subtitle: 'Pusat bantuan pelanggan & FAQ',
    icon: 'help-circle-outline',
  },
  {
    id: 'menu-7',
    title: 'Tentang Aplikasi',
    subtitle: 'Versi 1.0.0 (Modul 1 — Pemrograman Mobile)',
    icon: 'information-circle-outline',
  },
];

/**
 * Data profil pengguna default
 */
export const CURRENT_USER: UserProfile = {
  name: 'Andi Pratama',
  email: 'andi.pratama@email.com',
  phone: '+62 812-3456-7890',
  membership: 'Gold Member',
  washPayBalance: 75000,
  rewardPoints: 150,
};

/**
 * Data promosi di halaman Home
 */
export const PROMO_BANNER = {
  title: 'Pakaian bersih, hidup lebih nyaman.',
  tagline: 'Diskon 20% untuk pelanggan setia WashUp setiap akhir pekan!',
  buttonText: 'Pesan Sekarang',
  code: 'WASHUPHEMAT',
};
