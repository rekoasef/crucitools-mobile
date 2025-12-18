// src/ui/components/Card.tsx
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../../core/theme';

interface CardProps {
  children: React.ReactNode;
  // CAMBIO: Ahora aceptamos StyleProp<ViewStyle> en lugar de solo ViewStyle
  style?: StyleProp<ViewStyle>; 
  variant?: 'default' | 'flat';
}

export const Card = ({ children, style, variant = 'default' }: CardProps) => {
  return (
    <View style={[
      styles.container, 
      variant === 'default' ? styles.shadow : styles.border, 
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.layout.borderRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  shadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  border: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});