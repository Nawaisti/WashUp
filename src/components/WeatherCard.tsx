// ============================================================================
// WashUp - WeatherCard Component (Modul 3)
// Kartu cuaca ringkas: loading, success, error + retry.
// Informasi pendukung saja; tidak memengaruhi proses atau status pesanan.
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';
import { IconSymbol } from './IconSymbol';
import { WeatherData, WeatherStatus } from '../types/weather';

interface WeatherCardProps {
  status: WeatherStatus;
  data: WeatherData | null;
  errorMessage: string | null;
  onRetry: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  status,
  data,
  errorMessage,
  onRetry,
}) => {
  return (
    <View style={[styles.card, SHADOWS.card]}>
      <View style={styles.headerRow}>
        <IconSymbol name="location-outline" size={14} color={COLORS.primary} />
        <Text style={styles.label}>Cuaca di UMM, Malang</Text>
      </View>

      {status === 'loading' && (
        <View style={styles.bodyRow}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.statusText}>Memuat data cuaca...</Text>
        </View>
      )}

      {status === 'success' && data && (
        <View>
          <View style={styles.bodyRow}>
            <View style={styles.iconCircle}>
              <IconSymbol name={data.iconName} size={26} color={COLORS.primary} />
            </View>
            <View style={styles.mainInfo}>
              <Text style={styles.temperature}>{Math.round(data.temperature)}°C</Text>
              <Text style={styles.description}>{data.description}</Text>
            </View>
            <View style={styles.metaColumn}>
              <Text style={styles.metaText}>Terasa {Math.round(data.feelsLike)}°C</Text>
              <Text style={styles.metaText}>Lembap {data.humidity}%</Text>
              <Text style={styles.metaText}>Angin {data.windSpeed} km/j</Text>
            </View>
          </View>
          <Text style={styles.hint}>
            {data.isRaining
              ? 'Sedang hujan di sekitar kampus — bisa jadi pertimbangan saat merencanakan penjemputan cucian.'
              : 'Informasi cuaca saat ini untuk membantu merencanakan aktivitas laundry Anda.'}
          </Text>
        </View>
      )}

      {status === 'error' && (
        <View>
          <View style={styles.bodyRow}>
            <IconSymbol name="cloud-offline-outline" size={22} color={COLORS.statusDanger} />
            <Text style={styles.errorText}>
              {errorMessage ?? 'Gagal memuat data cuaca.'}
            </Text>
          </View>
          <Pressable
            onPress={onRetry}
            accessibilityLabel="Coba muat ulang data cuaca"
            style={({ pressed }) => [styles.retryButton, { opacity: pressed ? 0.8 : 1 }]}
          >
            <IconSymbol name="refresh" size={14} color={COLORS.primaryDark} />
            <Text style={styles.retryText}>Coba Lagi</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  metaColumn: {
    alignItems: 'flex-end',
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 1,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 10,
    lineHeight: 15,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
