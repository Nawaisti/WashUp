// ============================================================================
// WashUp - CustomButton Component
// (Modul 1: Custom Component, Pressable, TypeScript Props, Inline Styling)
// ============================================================================

import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { CustomButtonProps } from '../types/laundry';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';
import { IconSymbol } from './IconSymbol';

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  fullWidth = true,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const paddingVertical = isSmall ? 8 : isLarge ? 16 : 12;
  const paddingHorizontal = isSmall ? 14 : isLarge ? 24 : 18;
  const fontSize = isSmall ? 13 : isLarge ? 16 : 14;

  let backgroundColor = COLORS.primary;
  let textColor = '#FFFFFF';
  let borderColor = 'transparent';

  if (isSecondary) {
    backgroundColor = COLORS.primaryLight;
    textColor = COLORS.primaryDark;
  } else if (isOutline) {
    backgroundColor = 'transparent';
    textColor = COLORS.primary;
    borderColor = COLORS.primary;
  } else if (isGhost) {
    backgroundColor = 'transparent';
    textColor = COLORS.textSecondary;
  }

  if (disabled) {
    backgroundColor = COLORS.surfaceSubtle;
    textColor = COLORS.textMuted;
    borderColor = COLORS.border;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonBase,
        isPrimary && !disabled ? SHADOWS.card : null,
        // INLINE STYLING: Penentuan warna tombol, border, dan padding secara dinamis
        {
          backgroundColor,
          borderColor,
          borderWidth: isOutline ? 1.5 : 0,
          paddingVertical,
          paddingHorizontal,
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.6 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.contentRow}>
        {icon && (
          <View style={styles.iconWrapper}>
            <IconSymbol name={icon} size={fontSize + 2} color={textColor} />
          </View>
        )}
        <Text style={[styles.buttonText, { color: textColor, fontSize }]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
