// ============================================================================
// WashUp - ProfileMenuItem Component
// (Modul 1: Custom Component, TypeScript Props, Pressable, Inline Styling)
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ProfileMenuItemProps } from '../types/laundry';
import { COLORS, RADIUS } from '../constants/theme';
import { IconSymbol } from './IconSymbol';

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  item,
  onPress,
}) => {
  return (
    <Pressable
      onPress={() => onPress && onPress(item)}
      style={({ pressed }) => [
        styles.itemContainer,
        // INLINE STYLING: Highlight visual feedback saat item disentuh/ditekan
        {
          backgroundColor: pressed ? COLORS.surfaceSubtle : COLORS.surface,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      {/* Ikon Menu dalam lingkaran bergradasi lembut */}
      <View style={styles.iconCircle}>
        <IconSymbol name={item.icon} size={20} color={COLORS.primary} />
      </View>

      {/* Teks Judul & Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.menuSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
      </View>

      {/* Badge opsional (e.g. "3 Baru" / "Utama") */}
      {item.badge && (
        <View
          // INLINE STYLING: Warna latar badge dinamis
          style={[
            styles.badgePill,
            {
              backgroundColor: item.badgeColor ? `${item.badgeColor}15` : COLORS.primaryLight,
              borderColor: item.badgeColor ? item.badgeColor : COLORS.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: item.badgeColor ? item.badgeColor : COLORS.primaryDark },
            ]}
          >
            {item.badge}
          </Text>
        </View>
      )}

      {/* Right Chevron Arrow */}
      <View style={styles.arrowContainer}>
        <IconSymbol name="chevron-forward" size={18} color={COLORS.textMuted} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
});
