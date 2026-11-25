// ============================================================================
// WashUp - Cloud & Local Laundry Orders Context (Modul 4: Cloud CRUD & RLS)
// Mengelola operasi PostgreSQL Supabase pada tabel `laundry_orders`:
// 1. SELECT: Mengambil pesanan milik user aktif (terisolasi via RLS auth.uid())
// 2. INSERT: Membuat pesanan laundry baru ke Supabase Cloud
// 3. UPDATE: Memperbarui tahap/status cucian dengan Optimistic UI & Rollback
// 4. DELETE: Menghapus pesanan cloud dengan Optimistic UI & Rollback
// 5. Kontinuitas Modul 1-2: Menyediakan mode filter Cloud (RLS) vs Semua (+Dummy)
// ============================================================================

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { ORDERS_DATA } from '../constants/dummyData';
import type { CloudLaundryOrderRow, Order, OrderStatus } from '../types/laundry';

export type OrderDataSourceMode = 'cloud' | 'all';

interface CreateOrderInput {
  customerName: string;
  service: string;
  amount: number;
  unit: string;
  price: number;
  notes?: string;
  address: string;
  paymentMethod: string;
}

interface OrdersContextValue {
  orders: Order[];
  cloudOrders: Order[];
  dummyOrders: Order[];
  dataSourceMode: OrderDataSourceMode;
  setDataSourceMode: (mode: OrderDataSourceMode) => void;
  isLoadingCloud: boolean;
  isMutating: boolean;
  cloudError: string | null;
  clearCloudError: () => void;
  refreshOrders: () => Promise<void>;
  createOrder: (input: CreateOrderInput) => Promise<{ order: Order; syncedToCloud: boolean; error?: string }>;
  advanceOrderStatus: (order: Order) => Promise<{ success: boolean; error?: string }>;
  cancelOrDeleteOrder: (order: Order) => Promise<{ success: boolean; error?: string }>;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const STEP_TO_STATUS: Record<number, OrderStatus> = {
  1: 'Diproses',
  2: 'Sedang Dicuci',
  3: 'Disetrika',
  4: 'Selesai',
};

function mapCloudRowToOrder(row: CloudLaundryOrderRow): Order {
  return {
    id: row.order_code,
    cloudId: row.id,
    userId: row.user_id,
    isCloud: true,
    customerName: row.customer_name,
    service: row.service,
    date: row.date,
    amount: Number(row.amount),
    unit: row.unit,
    price: Number(row.price),
    status: row.status,
    notes: row.notes ?? undefined,
    progressStep: row.progress_step,
    address: row.address ?? undefined,
    paymentMethod: row.payment_method ?? 'WashPay',
    createdAt: row.created_at,
  };
}

function formatIndonesianDate(now: Date = new Date()): string {
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${now.getDate()} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
}

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cloudOrders, setCloudOrders] = useState<Order[]>([]);
  const [dummyOrders, setDummyOrders] = useState<Order[]>(() => [...ORDERS_DATA]);
  const [dataSourceMode, setDataSourceMode] = useState<OrderDataSourceMode>('all');
  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(false);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  // 1. SELECT: Ambil daftar pesanan laundry dari Supabase (terisolasi RLS per user)
  const refreshOrders = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      setCloudOrders([]);
      return;
    }

    setIsLoadingCloud(true);
    setCloudError(null);

    try {
      const { data, error } = await supabase
        .from('laundry_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Failed to fetch laundry_orders:', error.message);
        setCloudError(error.message);
        return;
      }

      const mapped = ((data ?? []) as CloudLaundryOrderRow[]).map(mapCloudRowToOrder);
      setCloudOrders(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memuat pesanan dari cloud.';
      setCloudError(message);
    } finally {
      setIsLoadingCloud(false);
    }
  }, [user]);

  // Muat pesanan cloud secara otomatis setiap kali user yang login berganti
  useEffect(() => {
    if (user) {
      refreshOrders();
    } else {
      setCloudOrders([]);
      setCloudError(null);
    }
  }, [user, refreshOrders]);

  // 2. INSERT: Buat pesanan baru (disimpan ke Supabase Cloud & array lokal)
  const createOrder = useCallback(
    async (
      input: CreateOrderInput
    ): Promise<{ order: Order; syncedToCloud: boolean; error?: string }> => {
      const existingIds = new Set([
        ...cloudOrders.map((o) => o.id),
        ...dummyOrders.map((o) => o.id),
      ]);
      let newOrderCode = '';
      do {
        newOrderCode = `#WU00${Math.floor(100 + Math.random() * 900)}`;
      } while (existingIds.has(newOrderCode));

      const formattedDate = formatIndonesianDate();

      const optimisticOrder: Order = {
        id: newOrderCode,
        customerName: input.customerName,
        service: input.service,
        date: formattedDate,
        amount: input.amount,
        unit: input.unit,
        price: input.price,
        status: 'Diproses',
        notes: input.notes,
        progressStep: 1,
        address: input.address,
        paymentMethod: input.paymentMethod,
        isCloud: Boolean(user && isSupabaseConfigured),
        userId: user?.id,
      };

      // Jika user login & Supabase aktif, simpan ke PostgreSQL Cloud
      if (user && isSupabaseConfigured) {
        setIsMutating(true);
        setCloudError(null);

        // Optimistic UI: tampilkan langsung di daftar cloudOrders
        setCloudOrders((prev) => [optimisticOrder, ...prev]);

        try {
          const { data, error } = await supabase
            .from('laundry_orders')
            .insert([
              {
                user_id: user.id,
                order_code: newOrderCode,
                customer_name: input.customerName,
                service: input.service,
                date: formattedDate,
                amount: input.amount,
                unit: input.unit,
                price: input.price,
                status: 'Diproses',
                notes: input.notes ?? null,
                progress_step: 1,
                address: input.address,
                payment_method: input.paymentMethod,
              },
            ])
            .select()
            .single();

          if (error) {
            // Rollback Optimistic UI pada cloudOrders, simpan sebagai pesanan lokal agar tidak hilang
            setCloudOrders((prev) => prev.filter((o) => o.id !== newOrderCode));
            const fallbackLocal: Order = { ...optimisticOrder, isCloud: false };
            ORDERS_DATA.unshift(fallbackLocal);
            setDummyOrders([...ORDERS_DATA]);
            setCloudError(error.message);
            return { order: fallbackLocal, syncedToCloud: false, error: error.message };
          }

          const createdCloudOrder = mapCloudRowToOrder(data as CloudLaundryOrderRow);
          setCloudOrders((prev) =>
            prev.map((o) => (o.id === newOrderCode ? createdCloudOrder : o))
          );
          return { order: createdCloudOrder, syncedToCloud: true };
        } catch (err) {
          setCloudOrders((prev) => prev.filter((o) => o.id !== newOrderCode));
          const fallbackLocal: Order = { ...optimisticOrder, isCloud: false };
          ORDERS_DATA.unshift(fallbackLocal);
          setDummyOrders([...ORDERS_DATA]);
          const msg = err instanceof Error ? err.message : 'Gagal menyimpan pesanan ke cloud.';
          setCloudError(msg);
          return { order: fallbackLocal, syncedToCloud: false, error: msg };
        } finally {
          setIsMutating(false);
        }
      }

      // Fallback lokal (Modul 1 & 2)
      ORDERS_DATA.unshift(optimisticOrder);
      setDummyOrders([...ORDERS_DATA]);
      return { order: optimisticOrder, syncedToCloud: false };
    },
    [user, cloudOrders, dummyOrders]
  );

  // 3. UPDATE: Majukan tahapan proses cucian (Optimistic UI + Rollback jika gagal)
  const advanceOrderStatus = useCallback(
    async (targetOrder: Order): Promise<{ success: boolean; error?: string }> => {
      const currentStep = targetOrder.progressStep ?? 1;
      const nextStep = currentStep >= 4 ? 1 : currentStep + 1;
      const nextStatus: OrderStatus = STEP_TO_STATUS[nextStep] ?? 'Diproses';

      if (targetOrder.isCloud && targetOrder.cloudId && user && isSupabaseConfigured) {
        const previousCloudOrders = [...cloudOrders];

        // Optimistic UI: langsung perbarui di layar sebelum request selesai
        setCloudOrders((prev) =>
          prev.map((item) =>
            item.cloudId === targetOrder.cloudId
              ? { ...item, progressStep: nextStep, status: nextStatus }
              : item
          )
        );

        setIsMutating(true);
        setCloudError(null);

        try {
          const { error } = await supabase
            .from('laundry_orders')
            .update({
              progress_step: nextStep,
              status: nextStatus,
            })
            .eq('id', targetOrder.cloudId)
            .eq('user_id', user.id);

          if (error) {
            // Rollback ke state semula jika gagal di server
            setCloudOrders(previousCloudOrders);
            setCloudError(error.message);
            return { success: false, error: error.message };
          }
          return { success: true };
        } catch (err) {
          setCloudOrders(previousCloudOrders);
          const msg = err instanceof Error ? err.message : 'Gagal memperbarui status di cloud.';
          setCloudError(msg);
          return { success: false, error: msg };
        } finally {
          setIsMutating(false);
        }
      }

      // Update untuk data dummy lokal
      setDummyOrders((prev) =>
        prev.map((item) =>
          item.id === targetOrder.id
            ? { ...item, progressStep: nextStep, status: nextStatus }
            : item
        )
      );
      const idx = ORDERS_DATA.findIndex((o) => o.id === targetOrder.id);
      if (idx !== -1) {
        ORDERS_DATA[idx] = {
          ...ORDERS_DATA[idx],
          progressStep: nextStep,
          status: nextStatus,
        };
      }
      return { success: true };
    },
    [cloudOrders, user]
  );

  // 4. DELETE: Hapus pesanan cloud dari PostgreSQL (Optimistic UI + Rollback)
  const cancelOrDeleteOrder = useCallback(
    async (targetOrder: Order): Promise<{ success: boolean; error?: string }> => {
      if (targetOrder.isCloud && targetOrder.cloudId && user && isSupabaseConfigured) {
        const previousCloudOrders = [...cloudOrders];

        // Optimistic UI: langsung hapus dari daftar layar
        setCloudOrders((prev) => prev.filter((item) => item.cloudId !== targetOrder.cloudId));
        setIsMutating(true);
        setCloudError(null);

        try {
          const { error } = await supabase
            .from('laundry_orders')
            .delete()
            .eq('id', targetOrder.cloudId)
            .eq('user_id', user.id);

          if (error) {
            // Rollback jika gagal
            setCloudOrders(previousCloudOrders);
            setCloudError(error.message);
            return { success: false, error: error.message };
          }
          return { success: true };
        } catch (err) {
          setCloudOrders(previousCloudOrders);
          const msg = err instanceof Error ? err.message : 'Gagal menghapus pesanan cloud.';
          setCloudError(msg);
          return { success: false, error: msg };
        } finally {
          setIsMutating(false);
        }
      }

      // Untuk pesanan lokal, tandai sebagai Dibatalkan
      setDummyOrders((prev) =>
        prev.map((item) =>
          item.id === targetOrder.id
            ? { ...item, status: 'Dibatalkan', progressStep: 1 }
            : item
        )
      );
      const idx = ORDERS_DATA.findIndex((o) => o.id === targetOrder.id);
      if (idx !== -1) {
        ORDERS_DATA[idx] = { ...ORDERS_DATA[idx], status: 'Dibatalkan', progressStep: 1 };
      }
      return { success: true };
    },
    [cloudOrders, user]
  );

  const combinedOrders =
    dataSourceMode === 'cloud' ? cloudOrders : [...cloudOrders, ...dummyOrders];

  return (
    <OrdersContext.Provider
      value={{
        orders: combinedOrders,
        cloudOrders,
        dummyOrders,
        dataSourceMode,
        setDataSourceMode,
        isLoadingCloud,
        isMutating,
        cloudError,
        clearCloudError: () => setCloudError(null),
        refreshOrders,
        createOrder,
        advanceOrderStatus,
        cancelOrDeleteOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrders harus digunakan di dalam OrdersProvider');
  }
  return ctx;
}
