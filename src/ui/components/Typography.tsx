// src/ui/components/Typography.tsx
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { theme } from '../../core/theme';

interface CruciTextProps extends TextProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export const H1 = ({ children, style, align = 'left', color, ...props }: CruciTextProps) => (
  <Text style={[styles.h1, { textAlign: align, color: color || theme.colors.textPrimary }, style]} {...props}>
    {children}
  </Text>
);

export const H2 = ({ children, style, align = 'left', color, ...props }: CruciTextProps) => (
  <Text style={[styles.h2, { textAlign: align, color: color || theme.colors.textPrimary }, style]} {...props}>
    {children}
  </Text>
);

export const Body = ({ children, style, align = 'left', color, ...props }: CruciTextProps) => (
  <Text style={[styles.body, { textAlign: align, color: color || theme.colors.textSecondary }, style]} {...props}>
    {children}
  </Text>
);

export const Label = ({ children, style, align = 'left', color, ...props }: CruciTextProps) => (
  <Text style={[styles.label, { textAlign: align, color: color || theme.colors.textSecondary }, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  h1: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.heavy,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.xs,
  },
  body: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    lineHeight: 24,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});