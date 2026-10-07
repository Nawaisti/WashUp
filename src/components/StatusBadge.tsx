// ============================================================================
// WashUp - StatusBadge Component
// (Modul 1: Custom Component, TypeScript Props, Condition, Inline Styling)
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBadgeProps } from '../types/laundry';
import { getStatusStyle } from '../utils/helpers';
import { IconSymbol } from './IconSymbol';

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  // Mendapatkan warna dinamis berdasarkan kondisi status pesanan
  const styleConfig = getStatusStyle(status);

  // Ukuran dinamis
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const paddingVertical = isSmall ? 3 : isLarge ? 8 : 5;
  const paddingHorizontal = isSmall ? 8 : isLarge ? 14 : 10;
  const fontSize = isSmall ? 10 : isLarge ? 13 : 11;
  const iconSize = isSmall ? 11 : isLarge ? 16 : 13;

  return (
    // INLINE STYLING WAJIB: Digunakan untuk warna background dan border dinamis
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: styleConfig.bgColor,
          borderColor: styleConfig.borderColor,
          paddingVertical,
          paddingHorizontal,
        },
      ]}
    >
      {/* Icon status indikator */}
      <View style={styles.iconWrapper}>
        <IconSymbol
          name={styleConfig.iconName}
          size={iconSize}
          color={styleConfig.textColor}
        />
      </View>

      {/* Teks status dengan inline style warna */}
      <Text
        style={[
          styles.badgeText,
          {
            color: styleConfig.textColor,
            fontSize,
          },
        ]}
      >
        {styleConfig.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconWrapper: {
    marginRight: 4,
  },
  badgeText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
