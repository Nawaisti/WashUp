// ============================================================================
// WashUp - Logo & Branding Component (Modul 1: JSX, View, Text, Custom Component)
// Ikon Mesin Cuci Modern + Wordmark "WashUp" + Tagline
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WashUpLogoProps } from '../types/laundry';
import { COLORS } from '../constants/theme';
import { IconSymbol } from './IconSymbol';

export const WashUpLogo: React.FC<WashUpLogoProps> = ({
  size = 'medium',
  showTagline = false,
  variant = 'light',
}) => {
  // Pengaturan ukuran proporsional
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const iconBoxSize = isSmall ? 32 : isLarge ? 54 : 42;
  const iconSize = isSmall ? 18 : isLarge ? 28 : 22;
  const titleSize = isSmall ? 18 : isLarge ? 28 : 22;
  const taglineSize = isSmall ? 10 : isLarge ? 13 : 11;

  // Warna teks berdasarkan variant
  const isWhite = variant === 'white';
  const primaryTextColor = isWhite ? '#FFFFFF' : COLORS.textPrimary;
  const accentColor = isWhite ? '#BAE6FD' : COLORS.primary;

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        {/* Ikon Mesin Cuci dengan Bubble Glow */}
        <View
          style={[
            styles.iconWrapper,
            {
              width: iconBoxSize,
              height: iconBoxSize,
              borderRadius: iconBoxSize / 2,
              backgroundColor: isWhite ? 'rgba(255, 255, 255, 0.2)' : COLORS.primaryLight,
            },
          ]}
        >
          <IconSymbol
            name="water"
            size={iconSize}
            color={isWhite ? '#FFFFFF' : COLORS.primary}
          />
          {/* Aksen gelembung kecil */}
          <View
            style={[
              styles.bubbleDot,
              {
                backgroundColor: isWhite ? '#FFFFFF' : COLORS.accent,
                top: isSmall ? 4 : 6,
                right: isSmall ? 4 : 6,
              },
            ]}
          />
        </View>

        {/* Wordmark: WashUp */}
        <View style={styles.textContainer}>
          <View style={styles.wordmarkRow}>
            <Text style={[styles.wordmarkMain, { fontSize: titleSize, color: primaryTextColor }]}>
              Wash
            </Text>
            <Text style={[styles.wordmarkAccent, { fontSize: titleSize, color: accentColor }]}>
              Up
            </Text>
            <View style={[styles.cleanDot, { backgroundColor: accentColor }]} />
          </View>

          {showTagline && (
            <Text
              style={[
                styles.taglineText,
                {
                  fontSize: taglineSize,
                  color: isWhite ? 'rgba(255, 255, 255, 0.85)' : COLORS.textSecondary,
                },
              ]}
            >
              Laundry lebih mudah, kapan saja.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  bubbleDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  textContainer: {
    justifyContent: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkMain: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  wordmarkAccent: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cleanDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: 3,
    marginBottom: 4,
  },
  taglineText: {
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.1,
  },
});
