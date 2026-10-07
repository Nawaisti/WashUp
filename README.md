# WashUp

> **WashUp — A simple laundry management mobile application built with React Native and Expo.**  
> *Tagline: "Laundry lebih mudah, kapan saja."*

WashUp adalah aplikasi mobile modern dan intuitif yang dirancang untuk mempermudah pengguna dalam memesan, melacak, dan mengelola layanan laundry secara real-time. Aplikasi ini dikembangkan untuk tugas mata kuliah **Pemrograman Mobile — Modul 1: Sintaks & UI Dasar**.

---

## 📋 Daftar Isi
1. [Tentang Aplikasi (About)](#-tentang-aplikasi-about)
2. [Fitur Utama (Features)](#-fitur-utama-features)
3. [Penerapan Konsep Modul 1](#-penerapan-konsep-modul-1)
4. [Teknologi (Technologies)](#-teknologi-technologies)
5. [Struktur Project (Project Structure)](#-struktur-project-project-structure)
6. [Panduan Menjalankan Aplikasi (Getting Started)](#-panduan-menjalankan-aplikasi-getting-started)
7. [Struktur Data & Tipe (TypeScript)](#-struktur-data--tipe-typescript)
8. [Tim Pengembang (Team)](#-tim-pengembang-team)
9. [Status Project (Project Status)](#-status-project-project-status)

---

## 💡 Tentang Aplikasi (About)
WashUp menghadirkan pengalaman manajemen laundry yang bersih, minimalis, dan profesional melalui antarmuka mobile-first. Dengan kombinasi warna dominan **Biru (Sky Blue)** dan **Putih bersih**, WashUp mencerminkan kesegaran, kebersihan, dan keandalan layanan laundry modern.

Aplikasi ini mencakup alur lengkap pengguna mulai dari melihat promo dan katalog layanan di Beranda, melakukan pemesanan cucian dengan kalkulasi harga otomatis, melacak tahapan pencucian langkah-demi-langkah, hingga melihat riwayat transaksi serta pengaturan profil.

---

## ✨ Fitur Utama (Features)

### 🏠 1. Home / Beranda (`app/(tabs)/index.tsx`)
- **Branding & Sapaan**: Header dengan logo WashUp modern dan sapaan personal *"Halo, Selamat Datang!"*.
- **Promotional Card**: Banner *"Pakaian bersih, hidup lebih nyaman."* dengan diskon dan tombol CTA cepat *"Pesan Sekarang"*.
- **Pesanan Aktif**: Highlight status cucian yang sedang diproses (`#WU0067` — Cuci + Setrika, Sedang Dicuci) dengan navigasi langsung ke detail pelacakan.
- **Katalog Layanan**: Daftar 4 layanan laundry utama (*Cuci Kering*, *Cuci + Setrika*, *Setrika Saja*, *Laundry Sepatu*) yang di-render secara dinamis menggunakan `.map()` dan komponen reusable `ServiceCard`.
- **Keunggulan Layanan**: Informasi nilai tambah (*Proses Cepat*, *Higienis & Rapi*, *Antar-Jemput*).

### 🧺 2. Buat Pesanan / Layanan (`app/(tabs)/orders.tsx`)
- **Form Interaktif**:
  - `TextInput` Nama Pelanggan (placeholder: *"Masukkan nama lengkap"*).
  - Pilihan Jenis Layanan interaktif menggunakan opsi kartu visual.
  - `TextInput` Berat Laundry (placeholder: *"Masukkan berat dalam kg"*, numeric keyboard).
  - Pilihan metode pengantaran (*Kurir Antar-Jemput* vs *Antar Mandiri*).
  - `TextInput` Catatan Khusus (multiline untuk instruksi khusus pakaian).
- **Kalkulasi Otomatis (Real-time Calculation)**: Estimasi harga total dihitung otomatis per unit kuantitas menggunakan helper function `calculateEstimatedPrice()` dan diformat dengan `formatRupiah()`.
- **Feedback Sukses**: Banner konfirmasi pesanan berhasil dibuat dengan Order ID dinamis (e.g., `#WU0068`).

### 📦 3. Status Pesanan (`app/(tabs)/status.tsx`)
- **Pelacakan Langkah-demi-Langkah (Step Stepper)**:
  1. `Pesanan Diterima`
  2. `Sedang Dicuci` *(Status Aktif)*
  3. `Disetrika`
  4. `Selesai`
- **Conditional Rendering & Styling**: Indikator tahap proses berubah warna dan ikon secara dinamis (*done*: hijau, *active*: biru glowing, *upcoming*: abu-abu).
- **Selector Pesanan**: Fitur demo interaktif untuk berganti antar pesanan (menguji status *Sedang Dicuci*, *Selesai*, atau *Dibatalkan*).
- **Informasi Outlet & Estimasi Pengambilan**: Jadwal selesai dan lokasi outlet.

### 🕘 4. Riwayat Pesanan (`app/(tabs)/history.tsx`) — *Fokus Desain Tertinggi*
- **Filter Tabs**: Filter dinamis dengan tab: `Semua`, `Diproses`, `Selesai`, `Dibatalkan`.
  - Tab aktif diberi sorotan warna primary WashUp menggunakan **inline styling**.
- **Rekapitulasi Statistik**: Card ringkasan total pesanan, jumlah pesanan diproses, selesai, dan dibatalkan.
- **Search Bar**: Pencarian pesanan instan berdasarkan ID pesanan atau nama layanan.
- **Rendering Dinamis**: Menerapkan `Array of Objects` + `TypeScript Interface (Order)` + `.map()` menggunakan komponen reusable `OrderCard`.
- **Data Dummy Lengkap (5 Pesanan Sesuai Spesifikasi)**:
  - **#WU0067** — Cuci + Setrika — 6 Okt 2026 — 3 kg — Rp30.000 — *Sedang Dicuci*
  - **#WU0066** — Laundry Sepatu — 3 Okt 2026 — 1 pasang — Rp20.000 — *Selesai*
  - **#WU0065** — Setrika Saja — 1 Okt 2026 — 2 kg — Rp10.000 — *Selesai*
  - **#WU0064** — Cuci Kering — 28 Sep 2026 — 5 kg — Rp35.000 — *Dibatalkan*
  - **#WU0063** — Cuci + Setrika — 25 Sep 2026 — 4 kg — Rp40.000 — *Selesai*
- **Modal Detail Nota (Receipt Modal)**: Klik pada OrderCard untuk membuka popup faktur rinci pesanan.

### 👤 5. Profile Pelanggan (`app/(tabs)/profile.tsx`) — *Fokus Desain Tertinggi*
- **Header Profil**:
  - Foto avatar pelanggan menggunakan komponen `Image` dengan tombol edit foto.
  - Nama: **Andi Pratama**
  - Email: **andi.pratama@email.com**
  - Badge Status: **Gold Member**
  - Tombol pintasan Pengaturan (Settings icon).
- **Dompet WashPay & Poin**: Saldo Rp75.000 & 150 Poin Reward.
- **7 Menu Pengaturan Reusable** (`ProfileMenuItem`):
  1. Data Diri
  2. Alamat
  3. Notifikasi (badge: *3 Baru*)
  4. Riwayat Pesanan
  5. Metode Pembayaran
  6. Bantuan
  7. Tentang Aplikasi
- **Elemen Hiasan Laundry**: Kartu dekoratif tips perawatan pakaian dan ornamen gelembung sabun.

---

## 🎓 Penerapan Konsep Modul 1

Semua konsep wajib materi **Modul 1: Sintaks & UI Dasar** telah diimplementasikan secara nyata:

| Konsep Modul 1 | Implementasi Nyata di WashUp | Lokasi Kode |
| :--- | :--- | :--- |
| **JSX / TSX** | Seluruh tampilan dibuat menggunakan sintaks TSX yang bersih dan deklaratif | `app/**/*.tsx`, `src/components/*.tsx` |
| **View** | Kontainer tata letak, card, wrapper grid, dan pembungkus flexbox | Digunakan di semua layar & komponen |
| **Text** | Tipografi judul, label, badge, dan harga terformat | Digunakan di semua layar & komponen |
| **Image** | Avatar profil pengguna dan ilustrasi visual | `app/(tabs)/profile.tsx`, `app/(tabs)/index.tsx` |
| **TextInput** | Input nama pelanggan, berat cucian, catatan, dan bilah pencarian | `app/(tabs)/orders.tsx`, `app/(tabs)/history.tsx` |
| **Pressable** | Tombol CTA, kartu layanan, filter tab, kartu pesanan, dan menu profil | Digunakan di seluruh elemen interaktif |
| **ScrollView** | Scroll vertikal dan horizontal dengan safe area insets | `index.tsx`, `orders.tsx`, `status.tsx`, `history.tsx`, `profile.tsx` |
| **TypeScript** | Strict typing tanpa `any`, interface terstruktur untuk data model dan props | `src/types/laundry.ts` |
| **Variable & State** | Manajemen state lokal form input, tab aktif, kalkulasi dinamis, dan modal | `useState` di layar `orders`, `history`, `status` |
| **Condition** | Status badge logic (*Sedang Dicuci*, *Selesai*, *Dibatalkan*), step tracking, active tab | `src/utils/helpers.ts`, `StatusBadge.tsx` |
| **Function** | `formatRupiah()`, `calculateEstimatedPrice()`, `getStatusStyle()`, `filterOrdersByTab()` | `src/utils/helpers.ts` |
| **Loop (.map)** | Render array layanan (`services.map`), riwayat (`orders.map`), menu (`profileMenus.map`) | `index.tsx`, `history.tsx`, `profile.tsx`, `orders.tsx` |
| **Array of Objects** | Data dummy terstruktur `SERVICES_DATA`, `ORDERS_DATA`, `PROFILE_MENU_DATA` | `src/constants/dummyData.ts` |
| **Custom Component** | `ServiceCard`, `OrderCard`, `ProfileMenuItem`, `StatusBadge`, `WashUpLogo`, `CustomButton` | `src/components/` |
| **StyleSheet** | Sentralisasi styling rapi dan efisien dengan `StyleSheet.create()` | Di seluruh komponen & file halaman |
| **Inline Styling** | Digunakan khusus untuk styling dinamis (warna status, tab aktif, seleksi dinamis) | `StatusBadge.tsx`, `history.tsx`, `ServiceCard.tsx` |

---

## 🛠️ Teknologi (Technologies)

- **Framework**: [React Native](https://reactnative.dev/) (v0.74.5)
- **Tooling & Platform**: [Expo SDK 51](https://expo.dev/)
- **Routing & Navigasi**: [Expo Router v3](https://docs.expo.dev/router/introduction/) & Fallback Root Tabs
- **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Ikon**: `@expo/vector-icons` (Ionicons)
- **Komponen Safe Area**: `react-native-safe-area-context`

---

## 📂 Struktur Project (Project Structure)

```text
WashUp/
├── app/                           # File Routing Expo Router
│   ├── (tabs)/                    # Route Group untuk Bottom Navigation Tabs
│   │   ├── _layout.tsx            # Bottom Tabs Layout & Active Visual State
│   │   ├── index.tsx              # 🏠 Halaman Home / Beranda
│   │   ├── orders.tsx             # 🧺 Halaman Buat Pesanan / Layanan
│   │   ├── status.tsx             # 📦 Halaman Status Laundry & Stepper
│   │   ├── history.tsx            # 🕘 Halaman Riwayat Pesanan (Detail Tinggi)
│   │   └── profile.tsx            # 👤 Halaman Profile Pelanggan (Detail Tinggi)
│   ├── _layout.tsx                # Root Stack Layout & StatusBar Provider
│   └── index.tsx                  # Root redirect ke (tabs)
├── src/
│   ├── components/                # Reusable Custom Components
│   │   ├── WashUpLogo.tsx         # Logo Ikon Mesin Cuci + Wordmark WashUp
│   │   ├── StatusBadge.tsx        # Badge Status Dinamis (Inline Styling)
│   │   ├── ServiceCard.tsx        # Kartu Katalog Layanan Laundry (.map)
│   │   ├── OrderCard.tsx          # Kartu Riwayat Pesanan (Typed Props)
│   │   ├── ProfileMenuItem.tsx    # Baris Menu Profil Reusable (Pressable)
│   │   ├── CustomButton.tsx       # Tombol Reusable (Primary / Outline / Secondary)
│   │   └── IconSymbol.tsx         # Wrapper Ikon Konsisten
│   ├── constants/
│   │   ├── theme.ts               # Design System (Colors, Spacing, Shadows, Radius)
│   │   └── dummyData.ts           # Array of Objects: Services, Orders, Profile, User
│   ├── types/
│   │   └── laundry.ts             # TypeScript Interfaces & Types
│   └── utils/
│       └── helpers.ts             # Helper Functions: formatRupiah, getStatusStyle, filter
├── App.tsx                        # Root App Component (Standalone Tab Runner)
├── app.json                       # Konfigurasi Expo & Branding WashUp
├── package.json                   # Dependencies & Scripts
├── tsconfig.json                  # Konfigurasi TypeScript & Path Alias (@/*)
├── babel.config.js                # Babel Preset Expo
├── .gitignore                     # Git Ignore File
└── README.md                      # Dokumentasi Proyek WashUp
```

---

## 🚀 Panduan Menjalankan Aplikasi (Getting Started)

### Prasyarat
1. Node.js (versi 18 atau 20 LTS disarankan).
2. NPM atau Yarn.
3. Aplikasi **Expo Go** pada smartphone Android / iOS (unduh dari Play Store atau App Store).

### Langkah Instalasi
1. Buka terminal pada folder project `WashUp`:
   ```bash
   cd WashUp
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan development server Expo:
   ```bash
   npx expo start
   ```

4. Buka aplikasi:
   - **Pada Smartphone (Android/iOS)**: Buka aplikasi **Expo Go**, lalu scan QR code yang muncul di terminal.
   - **Pada Emulator Android**: Tekan tombol `a` pada keyboard terminal.
   - **Pada Simulator iOS**: Tekan tombol `i` pada keyboard terminal.
   - **Pada Browser Web**: Tekan tombol `w` pada keyboard terminal.

---

## 📊 Struktur Data & Tipe (TypeScript)

### 1. Interface `Order`
```typescript
export interface Order {
  id: string;
  customerName?: string;
  service: string;
  date: string;
  amount: number;
  unit: string;
  price: number;
  status: 'Sedang Dicuci' | 'Selesai' | 'Dibatalkan' | 'Diproses' | 'Disetrika';
  notes?: string;
  progressStep?: number;
  address?: string;
  paymentMethod?: string;
}
```

### 2. Interface `Service`
```typescript
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
```

### 3. Interface `ProfileMenuItemType`
```typescript
export interface ProfileMenuItemType {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}
```

---

## 👥 Tim Pengembang (Team)

*Praktikum Pemrograman Mobile — Modul 1 (Sintaks & UI Dasar)*

| No | Nama Anggota | NIM | Peran |
| :---: | :--- | :---: | :--- |
| 1 | **Rhiwugha Dwi. S** | [202410370110161] |
| 2 | **Nawa Istiqomah** | [202410370110372] |

---

## 📌 Status Project (Project Status)

- **Modul 1 (Sintaks & UI Dasar)**: **Selesai (100% Selesai)** ✅
- **Modul Berikutnya**: Persiapan integrasi State Management lanjutan, navigasi bertingkat, dan backend/API simulasi.
- **Lisensi**: Proyek Akademik — Praktikum Pemrograman Mobile.
