-- ============================================================================
-- WashUp - Skema Database Cloud PostgreSQL & Row Level Security (RLS)
-- Modul 4: Database & Autentikasi (Operasi Cloud Langsung & RLS)
--
-- Cara Menjalankan:
-- 1. Buka Dashboard Supabase proyek Anda -> SQL Editor -> New Query.
-- 2. Tempel seluruh skrip SQL ini lalu klik "Run".
-- ============================================================================

-- 1. Buat tabel pesanan laundry cloud (laundry_orders)
CREATE TABLE IF NOT EXISTS public.laundry_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  order_code TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'kg',
  price INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Diproses' CHECK (
    status IN ('Diproses', 'Sedang Dicuci', 'Disetrika', 'Selesai', 'Dibatalkan')
  ),
  notes TEXT,
  progress_step INTEGER NOT NULL DEFAULT 1 CHECK (progress_step BETWEEN 1 AND 4),
  address TEXT,
  payment_method TEXT DEFAULT 'WashPay',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS) pada tabel laundry_orders
ALTER TABLE public.laundry_orders ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan RLS: Isolasi penuh per pengguna (auth.uid() = user_id)
-- Pengguna A TIDAK DAPAT melihat, menambah, mengubah, atau menghapus pesanan Pengguna B.

DROP POLICY IF EXISTS "Users can view own laundry orders" ON public.laundry_orders;
CREATE POLICY "Users can view own laundry orders"
  ON public.laundry_orders
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own laundry orders" ON public.laundry_orders;
CREATE POLICY "Users can insert own laundry orders"
  ON public.laundry_orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own laundry orders" ON public.laundry_orders;
CREATE POLICY "Users can update own laundry orders"
  ON public.laundry_orders
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own laundry orders" ON public.laundry_orders;
CREATE POLICY "Users can delete own laundry orders"
  ON public.laundry_orders
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Hak akses schema & tabel untuk role Supabase (anon & authenticated)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.laundry_orders TO authenticated;
GRANT SELECT ON TABLE public.laundry_orders TO anon;

