// src/ui/components/ScreenLayout.tsx
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../core/theme';

interface ScreenLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const ScreenLayout = ({ children, scrollable = false, style }: ScreenLayoutProps) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}> 
      {/* Edges: evitamos el top porque el header de navegación ya lo maneja */}
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.headerBackground} />
      <Container 
        style={[styles.container, style]}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl, // Espacio extra al final para scroll
  },
});