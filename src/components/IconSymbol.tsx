// ============================================================================
// WashUp - Icon Component
// Wrapper konsisten untuk Expo Vector Icons (Ionicons)
// ============================================================================

import React from 'react';
import { StyleSheet, View, ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface IconProps {
  name: string;
  size?: number;
  color?: ColorValue | string;
}

export const IconSymbol: React.FC<IconProps> = ({
  name,
  size = 20,
  color = COLORS.primaryDark,
}) => {
  // Mapping nama icon ke Ionicons valid icon names
  const validName = (name as any) || 'ellipse-outline';

  return (
    <View style={styles.iconContainer}>
      <Ionicons name={validName} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
