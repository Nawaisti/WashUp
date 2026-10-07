// ============================================================================
// WashUp - ServiceCard Component
// (Modul 1: Custom Component, TypeScript Props, Pressable, Function formatRupiah, Inline Styling)
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ServiceCardProps } from '../types/laundry';
import { COLORS, SHADOWS, RADIUS } from '../constants/theme';
import { formatRupiah } from '../utils/helpers';
import { IconSymbol } from './IconSymbol';

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected = false,
  onPress,
}) => {
  return (
    <Pressable
      onPress={() => onPress && onPress(service)}
      style={({ pressed }) => [
        styles.cardContainer,
        SHADOWS.card,
        // INLINE STYLING: Border dan background berubah dinamis saat card dipilih (selected)
        {
          borderColor: isSelected ? COLORS.primary : COLORS.border,
          backgroundColor: isSelected ? COLORS.primarySoft : COLORS.surface,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        {/* Ikon Layanan dengan background melingkar */}
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: isSelected ? COLORS.primary : COLORS.primaryLight,
            },
          ]}
        >
          <IconSymbol
            name={service.icon}
            size={24}
            color={isSelected ? '#FFFFFF' : COLORS.primary}
          />
        </View>

        {/* Badge "Favorit" jika populer */}
        {service.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Favorit</Text>
          </View>
        )}

        {/* Radio indicator saat dalam mode seleksi */}
        {isSelected && (
          <View style={styles.checkIndicator}>
            <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Konten Teks Layanan */}
      <View style={styles.contentSection}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDesc} numberOfLines={2}>
          {service.description}
        </Text>
      </View>

      {/* Footer Harga Layanan (Memanggil function formatRupiah) */}
      <View style={styles.priceRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{formatRupiah(service.price)}</Text>
          <Text style={styles.unitText}> / {service.unit}</Text>
        </View>

        <View style={styles.arrowButton}>
          <IconSymbol
            name="chevron-forward"
            size={16}
            color={isSelected ? COLORS.primary : COLORS.textMuted}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularBadge: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  checkIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    marginBottom: 14,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  arrowButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
