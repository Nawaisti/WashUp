// ============================================================================
// WashUp - OrderCard Component (Komponen Utama Modul 1)
// (Modul 1: Custom Component, TypeScript Props, Pressable, StatusBadge, formatRupiah, Inline Styling)
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { OrderCardProps } from '../types/laundry';
import { COLORS, SHADOWS, RADIUS } from '../constants/theme';
import { formatRupiah } from '../utils/helpers';
import { StatusBadge } from './StatusBadge';
import { IconSymbol } from './IconSymbol';

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  showDetailButton = true,
}) => {
  return (
    <Pressable
      onPress={() => onPress && onPress(order)}
      style={({ pressed }) => [
        styles.cardContainer,
        SHADOWS.card,
        // INLINE STYLING: Efek visual saat ditekan (tactile press feedback)
        {
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      {/* Header Card: Order ID, Tanggal, & Status Badge */}
      <View style={styles.cardHeader}>
        <View style={styles.idAndDate}>
          <View style={styles.idTag}>
            <Text style={styles.orderIdText}>{order.id}</Text>
          </View>
          <View style={styles.dateRow}>
            <IconSymbol name="calendar-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.dateText}>{order.date}</Text>
          </View>
        </View>

        {/* Status Badge Reusable Component */}
        <StatusBadge status={order.status} size="medium" />
      </View>

      {/* Divider halus */}
      <View style={styles.divider} />

      {/* Body Card: Nama Layanan & Kuantitas */}
      <View style={styles.cardBody}>
        <View style={styles.serviceIconCircle}>
          <IconSymbol
            name={
              order.service.toLowerCase().includes('sepatu')
                ? 'footsteps-outline'
                : order.service.toLowerCase().includes('setrika')
                ? 'sparkles-outline'
                : 'shirt-outline'
            }
            size={20}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{order.service}</Text>
          <Text style={styles.quantityText}>
            Jumlah: <Text style={styles.quantityHighlight}>{order.amount} {order.unit}</Text>
          </Text>
        </View>
      </View>

      {/* Catatan khusus jika ada */}
      {order.notes && (
        <View style={styles.notesBox}>
          <IconSymbol name="document-text-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.notesText} numberOfLines={1}>
            {order.notes}
          </Text>
        </View>
      )}

      {/* Footer Card: Total Harga & Tombol Aksi */}
      <View style={styles.cardFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Biaya</Text>
          {/* Format mata uang memanggil custom function formatRupiah */}
          <Text style={styles.priceValue}>{formatRupiah(order.price)}</Text>
        </View>

        {showDetailButton && (
          <View style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Lihat Detail</Text>
            <IconSymbol name="chevron-forward" size={14} color={COLORS.primary} />
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idAndDate: {
    flexDirection: 'column',
  },
  idTag: {
    marginBottom: 3,
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 0.2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  quantityText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  quantityHighlight: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
    gap: 6,
  },
  notesText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    gap: 4,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
