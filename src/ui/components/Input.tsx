// src/ui/components/Input.tsx
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { theme } from '../../core/theme';
import { Body, Label } from './Typography';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  suffix?: string; // Ej: "cm", "kg", "km/h"
}

export const Input = ({ label, error, suffix, style, ...props }: InputProps) => {
  return (
    <View style={styles.container}>
      <Label style={styles.label}>{label}</Label>
      
      <View style={[
        styles.inputWrapper,
        error ? styles.errorBorder : styles.defaultBorder
      ]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.textSecondary}
          selectionColor={theme.colors.primary}
          {...props}
        />
        {suffix && <Body style={styles.suffix}>{suffix}</Body>}
      </View>
      
      {error && <Body style={styles.errorText} color={theme.palette.error}>{error}</Body>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.darkGray,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.layout.inputHeight,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.layout.borderRadius,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
  },
  defaultBorder: {
    borderColor: theme.colors.border,
  },
  errorBorder: {
    borderColor: theme.palette.error,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.bold,
    height: '100%',
  },
  suffix: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.bold,
  },
  errorText: {
    fontSize: theme.typography.sizes.xs,
    marginTop: 4,
  },
});