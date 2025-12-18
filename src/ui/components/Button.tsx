// src/ui/components/Button.tsx
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../../core/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode; // Para íconos futuros
}

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  style,
}: ButtonProps) => {

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.lightGray;
    if (variant === 'primary') return theme.colors.primary; // Rojo Crucianelli
    if (variant === 'secondary') return theme.colors.darkGray;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.mediumGray;
    if (variant === 'outline') return theme.colors.primary;
    return theme.colors.textInverse; // Blanco
  };

  const getBorder = () => {
    if (variant === 'outline') return { borderWidth: 2, borderColor: theme.colors.primary };
    return {};
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        getBorder(),
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>
          {title.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: theme.layout.buttonHeight,
    borderRadius: theme.layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xs,
    // Sombra sutil para profundidad
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 1,
  },
});